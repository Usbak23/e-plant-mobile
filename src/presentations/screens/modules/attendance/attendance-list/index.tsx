import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, SafeAreaView, TouchableOpacity, View } from 'react-native'
import styles from '@app/presentations/screens/modules/attendance/attendance-list/styles'
import { Header, ListFilterAlt, PopupLabel, SortPopup, Text } from '@app/presentations/_shared-components'
import { useNavigation, useRoute } from '@react-navigation/native'
import moment from 'moment'
import { sortOptions } from './sort-options'
import { MenuOption, MenuOptions } from 'react-native-popup-menu'
import { theme } from '@app/presentations/utils/styles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AttendanceCard from './attendance-card'
import Routes from '@app/presentations/navigation/Routes'
import { actions, RootStateType } from '@domain/states/store'
import { useDispatch, useSelector } from 'react-redux'
import { useDivisionsByOrganizationAll, useDivisionsByOrganizationFull } from '@app/domain/states/division/hooks'
import EmptyList from '@app/presentations/_shared-components/Empty'
import { IRSDivision } from '@app/domain/states/division/reducer'
import { IAttendanceFormData } from '@app/models/eplant/Attendance'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { filterData } from '@app/presentations/utils/filterData'
import { Division } from '@app/models/eplant/Division'
import { useIsAllowedToOrganizeAbsensi } from '@app/domain/states/user/hooks'
import downloadFile from '@app/presentations/utils/downloadFile'
import System from '@app/domain/services/System'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'


const AttendanceList = () => {
  const isAllowedToOrganizeAbsensi = useIsAllowedToOrganizeAbsensi()
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const attendanceData = route.params?.attendanceData

  const headerTitle = () => {
    const organizationName = attendanceData?.organization?.label || ''
    const headerTitle = `${organizationName} - ${moment(attendanceData?.dateAttendance).format('D MMMM YYYY')}`
    return headerTitle
  }

  const [query, setQuery] = useState({
    sort: 'name:asc',
    name: '',
  })

  const withSort = (datas: Division[]) => {
    if (!datas) {
      return []
    }
    if (query.sort == 'name:asc') {
      return datas.sort((a: Division, b: Division) => (a.name > b.name ? 1 : -1))
    } else if (query.sort == 'name:desc') {
      return datas.sort((a: Division, b: Division) => (a.name < b.name ? 1 : -1))
    }
    return datas
  }

  const { divisionAll }: IRSDivision = useSelector((state: RootStateType) => state.division || {})
  const attendanceTemps: IAttendanceFormData[] = useSelector(
    (state: RootStateType) => state.attendanceReducer?.attendanceTemp || [],
  )
  const loading = divisionAll?.loading || false
  const divisions = withSort(
    filterData(useDivisionsByOrganizationFull(attendanceData?.organization?.value), query.name),
  )

  const fetchDivision = () => {
    dispatch(
      actions.getAllDivision.request({
        loading: true,
        data: {
          organization: attendanceData?.organization?.value,
        },
      }),
    )
  }

  const isDraft = (divisionId: string): boolean => {
    const found = attendanceTemps.find(
      (a: IAttendanceFormData) => a.divisionId == divisionId && attendanceData.dateAttendance == a.date,
    )
    return Boolean(found)
  }

  const handleSearch = (q: string) => setQuery({ ...query, name: q })

  const handleSort = (sort: string) => setQuery({ ...query, sort })

  useEffect(() => {
    fetchDivision()
  }, [])

  const SortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={sortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const AltOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <MenuOption
        key={0}
        onSelect={async () => {
          const fileName = `Template Absensi.xls`
          const res = await downloadFile(System.instance.attendanceService.downloadTemplateAbsensi(), fileName)
          notifications
            .onDisplayNotificationExportFile(c.NOTIF_TITLE, 'Template absensi berhasil diunduh', c.EXPORT_NOTIFICATION_ID, {
              path: res,
            })
            .then(res => { })
            .catch(e => { })
          showSuccessToast('Template berhasil didiownload di' + res)
        }}>
        <View style={styles.popupLabel}>
          <AntDesign name="download" size={15} color={theme.colors.textThinBlack} />
          <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
            Download Template Absensi .xls
          </Text>
        </View>
      </MenuOption>
      <MenuOption
        key={1}
        onSelect={() => {
          navigation.navigate(Routes.ATTENDANCE_FILE_FORM, { attendanceData })
        }}>
        <View style={styles.popupLabel}>
          <AntDesign name="upload" size={15} color={theme.colors.textThinBlack} />
          <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
            Unggah File Absensi
          </Text>
        </View>
      </MenuOption>
      <MenuOption
        key={2}
        onSelect={() => {
          navigation.navigate(Routes.ATTENDANCE_EMPLOYEE_FORM, { attendanceData })
        }}>
        <View style={styles.popupLabel}>
          <AntDesign name="plus" size={15} color={theme.colors.textThinBlack} />
          <Text style={styles.text} color={theme.colors.textThinBlack} type="semibold">
            Tambah Karyawan
          </Text>
        </View>
      </MenuOption>
    </MenuOptions>
  )

  const ListHeaderComponent = () => (
    <View style={{ marginHorizontal: 18, marginTop: 16 }}>
      <OfflineView />
      <Text type="semibold">{headerTitle()}</Text>
    </View>
  )

  const OfflineView = () =>
    attendanceTemps.find((f: IAttendanceFormData) => f.date == attendanceData?.dateAttendance) ? (
      <View style={styles.syncView}>
        <Text style={{ flex: 1 }} type="semibold" size={12} color={theme.colors.tealDark}>
          Beberapa data tersimpan sebagai draft
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (!isConnected) {
              return showErrorToast('Anda dalam mode offline')
            }
            dispatch(actions.syncAttendances())
          }}>
          <Text color={theme.colors.tealDark} type="semibold" size={12}>
            Unggah
          </Text>
        </TouchableOpacity>
      </View>
    ) : null

  const renderItem = ({ item, index }: any) => {
    return <AttendanceCard isDraft={isDraft(item.id)} item={item} attendanceData={attendanceData} />
  }
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Absensi" />

      <ListFilterAlt
        searchValue={query.name}
        onChangeSearch={handleSearch}
        style={styles.filter}
        onPressDownload={() => { }}
        sortOptions={SortOptions}
        alts={isAllowedToOrganizeAbsensi ? AltOptions : undefined}
      />

      <FlatList
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeaderComponent}
        data={divisions}
        renderItem={renderItem}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={fetchDivision} />
        }
      />
    </SafeAreaView>
  )
}

export default AttendanceList
