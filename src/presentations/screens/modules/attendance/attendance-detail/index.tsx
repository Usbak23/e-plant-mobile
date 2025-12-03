import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, TouchableOpacity, View, TextInput} from 'react-native'
import styles from '@app/presentations/screens/modules/attendance/attendance-detail/styles'
import { Header, ModalAsk, Text} from '@app/presentations/_shared-components'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import moment from 'moment'
import {Table, Row} from 'react-native-table-component'
import {theme} from '@app/presentations/utils/styles'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {IAttendanceEmployee, IAttendanceFormData} from '@app/models/eplant/Attendance'
import {IRSAttendance} from '@app/domain/states/attendance/reducer'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import Routes from '@app/presentations/navigation/Routes'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {useIsAllowedToOrganizeAbsensi} from '@app/domain/states/user/hooks'

const tHeader = ['NIP', 'Nama', 'Peran', 'Tanggal', 'Jam Kerja', 'Scan Masuk', 'Scan Pulang', 'Aksi', 'Keterangan']
const widthArr = [100, 250, 150, 150, 100, 150, 150, 80, 200]

const AttendanceDetail = () => {
  const isAllowedToOrganizeAbsensi = useIsAllowedToOrganizeAbsensi()
  const isFocused = useIsFocused()
  const navigation: any = useNavigation()
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)
  const routes: any = useRoute()
  const dispatch = useDispatch()
  const attendanceData = routes?.params?.attendanceData
  const division = routes?.params?.division
  const attendance = useSelector((state: RootStateType) => state.attendanceReducer?.attendanceList)
  const employees = attendance?.data?.attendanceEmployees || []
  const attendanceTemps: IAttendanceFormData[] = useSelector(
    (state: RootStateType) => state.attendanceReducer?.attendanceTemp || [],
  )

  const [selectedEmployee, setSelectedEmployee] = useState<{id?: string; tempId?: string} | undefined>()
  const {deleteAttendanceStatus}: IRSAttendance = useSelector((state: RootStateType) => state?.attendanceReducer || {})
  const [search, setSearch] = useState<string>('')

  const handleDelete = () => {
    if (selectedEmployee) {
      dispatch(
        actions.deleteAttendanceEmployee.request({
          loading: true,
          data: selectedEmployee,
        }),
      )
      setSelectedEmployee(undefined)
    }
  }

  const concatWithOfflineData = () => {
    const filtered = attendanceTemps.filter(
      (a: IAttendanceFormData) => a.date == attendanceData?.dateAttendance && a.divisionId == division?.id,
    )
    const offlines =
      filtered.map((a: IAttendanceFormData) => ({
        ...a,
        user: {
          nip: a.nip,
          name: a.name,
        },
        role: {
          roleCategory: a.roleCategory,
        },
      })) || []

    return isConnected ? offlines.concat(employees) : offlines
  }

  // 353
  const doFilter = (datas: any[], query: string) => {
    if (query != '') {
      return datas?.filter(row => {
        const name = row?.user?.name || ''
        const nip = row?.user?.nip || ''
        const role = row?.role?.roleCategory || []
        const workingHours = row?.workingHours || ''
        const _in = row?.in || ''
        const out = row?.out || ''
        const type = row?.type || ''
        const q = query.toLowerCase()

        return (
          name.toLowerCase().includes(q) ||
          nip.toLowerCase().includes(q) ||
          role.toLowerCase().includes(q) ||
          workingHours.toString().toLowerCase().includes(q) ||
          _in.toString().toLowerCase().includes(q) ||
          out.toString().toLowerCase().includes(q) ||
          type.toLowerCase().includes(q)
        )
      })
    }
    return datas
  }

  const withSearch = doFilter(concatWithOfflineData(), search)

  const headerTitle = () => {
    const organizationName = attendanceData?.organization?.label || ''
    const headerTitle = `${organizationName} - ${division?.name || ''}`
    return headerTitle
  }

  const title = () => {
    const t = `Absensi - ${moment(attendanceData?.dateAttendance).format('D MMM YYYY')}`
    return t
  }

  const fetchAttendance = () => {
    const data = {
      divisionId: division?.id,
      date: attendanceData?.dateAttendance,
    }
    dispatch(
      actions.getAttendanceList.request({
        loading: true,
        data: {
          divisionId: division?.id,
          date: attendanceData?.dateAttendance,
        },
      }),
    )
  }

  useEffect(() => {
    const error = deleteAttendanceStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [deleteAttendanceStatus?.error])

  useEffect(() => {
    const data = deleteAttendanceStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Karyawan berhasil dihapus')
      fetchAttendance()
    }
  }, [deleteAttendanceStatus?.data])

  const ActionButton = (employee: {id?: string; tempId?: string}) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedEmployee(employee)
      }}>
      <View style={styles.deleteFileButton}>
        <Icon name="delete" size={18} color={theme.colors.black} />
      </View>
    </TouchableOpacity>
  )

  useEffect(() => {
    if (isFocused) {
      fetchAttendance()
    }
  }, [isFocused])

  return (
    <SafeAreaView style={styles.root}>
      <Header title={title()} />
      <View style={styles.scroll}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Text type="semibold">{headerTitle()}</Text>
          </View>
        </View>

        <View style={[styles.container]}>
          <View style={styles.wrapSearch}>
            <TextInput
              placeholderTextColor={theme.colors.darkGray}
              value={search}
              onChangeText={v => setSearch(v)}
              placeholder="Masukkan kata kunci"
              style={[styles.searhInput]}
            />
            <View style={styles.icon}>
              <AntDesign name="search1" size={14} color={theme.colors.textThinBlack} />
            </View>
          </View>
          {isAllowedToOrganizeAbsensi && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Routes.ATTENDANCE_EMPLOYEE_FORM, {attendanceData, division: division})
              }}
              style={styles.button}>
              <AntDesign name="plus" size={14} color={theme.colors.textThinBlack} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.tableViewContainer}>
            {withSearch.length > 0 && attendance?.loading == false ? (
              <>
                <Table borderStyle={{borderWidth: 1, borderColor: theme.colors.grey}}>
                  <Row
                    widthArr={widthArr}
                    data={tHeader}
                    style={styles.tableHeader}
                    textStyle={styles.tableHeaderText}
                  />
                </Table>
                <ScrollView>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {withSearch.map((e: IAttendanceEmployee | IAttendanceFormData, idx: number) => {
                      const data = [
                        `${e?.user?.nip}`,
                        `${e?.user?.name}`,
                        // 353 `${e?.role?.roleCategory}`,
                        e?.role?.roleCategory ? `${e?.role?.roleCategory.join(',')}` : '-',
                        `${attendanceData?.dateAttendance}`,
                        `${e?.workingHours}`,
                        `${e?.in}`,
                        `${e?.out}`,
                        isAllowedToOrganizeAbsensi ? (
                          ActionButton({id: e?.id, tempId: e?.tempId})
                        ) : (
                          <View style={{padding: 2}}>
                            <Text type="semibold" style={{textAlign: 'center'}}>
                              -
                            </Text>
                          </View>
                        ),
                        `${e?.type}`,
                      ]
                      return (
                        <Row
                          key={idx}
                          data={data}
                          widthArr={widthArr}
                          style={[
                            e?.tempId
                              ? {backgroundColor: theme.colors.redSemiTransparent}
                              : {backgroundColor: theme.colors.pureWhite},
                          ]}
                          textStyle={styles.tableRow}
                        />
                      )
                    })}
                  </Table>
                </ScrollView>
              </>
            ) : (
              <Text style={{alignSelf: 'center'}}>Tidak ada data</Text>
            )}
          </View>
        </ScrollView>
      </View>
      <ModalAsk
        onPositiveButtonTap={handleDelete}
        isDanger={true}
        isOpen={selectedEmployee != undefined}
        onTouchOutside={() => {
          setSelectedEmployee(undefined)
        }}
        title={'Anda yakin ingin menghapus karyawan ini dari daftar absensi?'}
        description={'Data absensi akan diperbarui'}
        positiveButtonText={'Hapus'}
      />
    </SafeAreaView>
  )
}

export default AttendanceDetail
