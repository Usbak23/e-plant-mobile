import React, { useCallback, useEffect, useState } from 'react'
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { theme } from '@app/presentations/utils/styles'
import WebView from 'react-native-webview'
import { Button, EmptyChart, Header, SelectInput, Text } from '@app/presentations/_shared-components'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import ModalFilter from '@app/presentations/_shared-components/ModalFilter'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MonthsSelect } from '@app/models/eplant/MonthConstant'
import {
  useLoggedInOrganizationsAndDivision,
  useLoggedInOrganizationsAndDivisionAndBlock,
} from '@app/domain/states/user/hooks'
import { useRangeYears } from '@app/domain/states/master/hooks'
import { useRoute } from '@react-navigation/native'
import downloadFile from '@app/presentations/utils/downloadFile'
import { showErrorToast, showInfoToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'
import { SceneMap, TabView } from 'react-native-tab-view'
import DailyWage from './daily-wage'
import BoronganWage from './borongan-wage'
import System from '@app/domain/services/System'

let debounceSearch: NodeJS.Timeout

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const EmployeeWageReport = () => {
  const dispatch = useDispatch()
  const route: any = useRoute()
  const q = route?.params?.query
  const [dimensions, setDimensions] = useState({ window, screen })
  const [modalFilter, setModalFilter] = useState(false)
  const [tabIdx, setTabIdx] = useState(0)
  const years = useRangeYears()
  const organizations = useLoggedInOrganizationsAndDivisionAndBlock()
  const [query, setQuery] = useState({
    search: '',
    organizationId: q?.organizationId || '',
    divisionId: q?.divisionId || '',
    // blockId: '',
    month: '',
    year: '',
  })

  const employeeWageReport = useSelector((state: RootStateType) => state.dashboardAndChart?.employeeWagesReport)

  const divisions = organizations.find(v => v.value == query.organizationId)?.divisions || []

  const constructTitleHelper = () => {
    const o = organizations.find(org => org.value == query.organizationId)?.label || ''
    const d = divisions.find(div => div?.value == query.divisionId)?.label || ''
    return `${o} - ${d} - ${query.month} - ${query.year} `
  }

  const isValidForm = () => {
    if (
      query.divisionId != '' &&
      query.organizationId != '' &&
      // query.month != '' &&
      // query.blockId != '' &&
      query.year != ''
    ) {
      return true
    }
    return false
  }

  const shouldClearQuery = () => {
    if (!isValidForm()) {
      setQuery({
        ...query,
        organizationId: q?.organizationId || '',
        divisionId: q?.divisionId || '',
        // blockId: '',
        month: '',
        year: '',
      })
    }
  }

  const handleExport = async (type: 1 | 0) => {   //-type:number 0 => Borongan, 1=> Harian
    try {
      const millis = new Date().getTime()
      const title = constructTitleHelper()
      const fileName = `upah_karyawan_${type === 1 ? "Harian" : "Borongan"}_${millis}.xlsx`
      const tofile = await downloadFile(System.instance.dashboardAndChartService.exportReportEmployeeWage({ ...query, type }), fileName)
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, c.NOTIF_BODY(fileName), c.EXPORT_NOTIFICATION_ID, {
          path: tofile,
        })
        .then(res => { })
        .catch(e => { })

      showSuccessToast('Berhasil mengekspor data.')
    } catch (error: any) {
      showErrorToast('Gagal saat mengekspor data')
    }
  }

  const handleSearch = (search: string) => {
    setQuery({ ...query, search: search })
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({ ...query, search: search })
    }, 500)
  }


  const onSubmitFilter = () => {
    getData(query)
    setModalFilter(false)
  }

  const getData = useCallback(data => {
    dispatch(actions.getEmployeeWagesReport.request({ loading: true, data: { ...data } }))
  }, [])

  useEffect(() => {
    const subscription: any = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen })
    })
    return () => subscription?.remove()
  })

  useEffect(() => {
    dispatch(actions.getRangeYear.request({ loading: true }))
  }, [])


  const routes = [
    { key: '0', title: 'Karyawan Harian' },
    { key: '1', title: 'Karyawan Borongan' },
  ]

  const renderScene = SceneMap({
    '0': () => <DailyWage data={employeeWageReport?.data?.daily} onExport={() => handleExport(1)} />,
    '1': () => <BoronganWage data={employeeWageReport?.data?.borongan} onExport={() => handleExport(0)} />,
  })

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Upah Karyawan" />
      <View style={[styles.container]}>
        <View style={styles.wrapSearch}>
          <TextInput
            placeholderTextColor={theme.colors.darkGray}
            value={query.search}
            onChangeText={handleSearch}
            placeholder="Masukkan kata kunci"
            style={[styles.searhInput]}
          />
          <View style={styles.icon}>
            <AntDesign name="search1" size={14} color={theme.colors.textThinBlack} />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setModalFilter(true)
          }}
          style={styles.button}>
          <AntDesign name="filter" size={14} color={theme.colors.textThinBlack} />
        </TouchableOpacity>
      </View>
      {isValidForm() ?
        <>
          {isValidForm() && (
            <Text type="semibold" style={{ marginHorizontal: 16, marginTop: 8 }}>
              {constructTitleHelper()}
            </Text>
          )}
          {Boolean(employeeWageReport?.loading) && isValidForm() && (
            <Text color={theme.colors.grey} style={{ margin: 16, alignSelf: 'center' }}>
              Memperbarui...
            </Text>
          )}
          <TabView
            navigationState={{ index: tabIdx, routes }}
            renderScene={renderScene}
            swipeEnabled={false}
            onIndexChange={i => {
              setTabIdx(i)
            }}
            renderTabBar={props => (
              <View style={styles.wrapTab}>
                {props.navigationState.routes.map((e, i) => {
                  const isActive = Boolean(i === tabIdx)
                  return (
                    <TouchableOpacity
                      key={e.title}
                      onPress={() => {
                        setTabIdx(i)
                      }}
                      activeOpacity={0.5}
                      disabled={isActive}
                      style={[styles.tabButton, isActive && {
                        borderBottomWidth: 2,
                        borderBottomColor: theme.colors.primary,
                      }]}>
                      <Text style={{ fontSize: 13 }} type={isActive ? "semibold" : "regular"} color={isActive ? theme.colors.primary : '#6C6C6C'}>
                        {e.title}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          />
        </>
        : <EmptyChart />}
      <ModalFilter
        isOpen={modalFilter}
        onTouchOutside={() => {
          shouldClearQuery()
          setModalFilter(false)
        }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', alignItems: 'center' }}>
          <Text type="semibold" size={13} color="#000000">
            Filter Upah Karyawan
          </Text>
          <TouchableOpacity
            style={{ padding: 8 }}
            onPress={() => {
              shouldClearQuery()
              setModalFilter(false)
            }}>
            <AntDesign name="close" size={18} />
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%', marginVertical: 8 }}>
          <Text size={11} type="semibold">
            Organisasi
            <Text size={11} color="red">
              *
            </Text>
          </Text>
          <SelectInput
            containerStyle={styles.filterInput}
            items={organizations}
            value={query.organizationId}
            isRequired
            placeholder="Pilih Organisasi"
            onChange={organizationId => setQuery({ ...query, divisionId: '', organizationId })}
          />
        </View>

        <View style={{ width: '100%', marginVertical: 8 }}>
          <Text size={11} type="semibold">
            Divisi
            <Text size={11} color="red">
              *
            </Text>
          </Text>
          <SelectInput
            containerStyle={styles.filterInput}
            items={divisions}
            value={query.divisionId}
            isRequired
            placeholder="Pilih Divisi"
            onChange={divisionId =>
              setQuery({
                ...query,
                divisionId,
                // blockId: ''
              })
            }
          />
        </View>

        {/* <View style={{width: '100%', marginVertical: 8}}>
          <Text size={11} type="semibold">
            Blok
            <Text size={11} color="red">
              *
            </Text>
          </Text>
          <SelectInput
            containerStyle={styles.filterInput}
            items={blocks}
            value={query.blockId}
            isRequired
            placeholder="Pilih Blok"
            onChange={blockId => setQuery({...query, blockId})}
          />
        </View> */}

        <View style={{ width: '100%', marginVertical: 8 }}>
          <Text size={11} type="semibold">
            Tahun
            <Text size={11} color="red">
              *
            </Text>
          </Text>
          <SelectInput
            containerStyle={styles.filterInput}
            items={years}
            value={query.year}
            isRequired
            placeholder="Pilih Tahun"
            onChange={v => setQuery({ ...query, year: v })}
          />
        </View>

        <View style={{ width: '100%', marginVertical: 8 }}>
          <Text size={11} type="semibold">
            Bulan
          </Text>
          <SelectInput
            containerStyle={styles.filterInput}
            items={MonthsSelect}
            value={query.month}
            placeholder="Pilih Bulan"
            onChange={v => setQuery({ ...query, month: v })}
          />
        </View>

        <Button disabled={!isValidForm()} style={{ width: '100%' }} onPress={() => onSubmitFilter()}>
          <Text color="white">Filter</Text>
        </Button>
      </ModalFilter>
    </SafeAreaView>
  )
}

export default EmployeeWageReport

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  webView: {
    resizeMode: 'cover',
    flex: 1,
  },
  filterInput: {
    marginVertical: -16,
  },
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
  },
  searhInput: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    color: theme.colors.textThinBlack,
    height: 40,
    width: '100%',
    flex: 1,
    paddingLeft: 35,
  },
  icon: {
    position: 'absolute',
    left: 11,
    top: 14,
  },
  button: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    height: 40,
    width: 40,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapSearch: { flex: 1, flexDirection: 'row' },
  regularInput: {
    marginTop: 8,
    color: theme.colors.textThinBlack,
    borderColor: theme.colors.defaultBorderColor,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 16,
    fontStyle: 'italic',
    fontSize: 13,
    alignSelf: 'stretch',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
  },
  tabButton: {
    paddingVertical: 9,
    paddingHorizontal: 9,
    flex: 1,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  wrapTab: { flexDirection: 'row', marginHorizontal: 16 },
})
