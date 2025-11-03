import {theme} from '@app/presentations/utils/styles'
import {Button, EmptyChart, Header, SelectInput, Text} from '@app/presentations/_shared-components'
import React, {useCallback, useEffect, useState} from 'react'
import DateTimePicker, {Event} from '@react-native-community/datetimepicker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {useRangeYears} from '@app/domain/states/master/hooks'
import {useLoggedInOrganizationsAndDivisionAndBlock} from '@app/domain/states/user/hooks'
import {useSubActivityOptions} from '@app/domain/states/subactivity/hooks'
import {actions, RootStateType} from '@app/domain/states/store'
import WebView from 'react-native-webview'
import downloadFile from '@app/presentations/utils/downloadFile'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import ModalFilter from '@app/presentations/_shared-components/ModalFilter'
import {useRawMaterialOptionsByType} from '@app/domain/states/raw-material/hooks'
import {IOrganizationRow} from '@app/models/eplant/Organization'
import moment from 'moment'
import {CHAPELS} from '@app/models/eplant/Chapel'
import {Table, Row, Rows} from 'react-native-table-component'
import {IReportChapelResponse} from '@app/models/eplant/ReportChapel'
import System from '@app/domain/services/System'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const tHeader = [
  'Rotasi (Hari)',
  'Kapel A [Senin](Ha)',
  'Kapel A [Senin](%)',
  'Kapel B [Selasa](Ha)',
  'Kapel B [Selasa](%)',
  'Kapel C [Rabu](Ha)',
  'Kapel C [Rabu](%)',
  'Kapel D [Kamis](Ha)',
  'Kapel D [Kamis](%)',
  'Kapel E [Jumat](Ha)',
  'Kapel E [Jumat](%)',
  'Kapel F [Sabtu](Ha)',
  'Kapel F [Sabtu](%)',
]

const widthArr = [200, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220,220, 220]

const ChapelReport = () => {
  const dispatch = useDispatch()

  const [dimensions, setDimensions] = useState({window, screen})
  const [modalFilter, setModalFilter] = useState(false)
  const organizations = useLoggedInOrganizationsAndDivisionAndBlock()

  const [query, setQuery] = useState({
    organizationId: '',
    divisionId: '',
    date: '',
  })

  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  const chapelReport = useSelector((state: RootStateType) => state.dashboardAndChart?.chapelReport)

  const datas = chapelReport?.data?.data?.response || []

  const divisions = organizations.find(v => v.value == query.organizationId)?.divisions || []

  const constructTitleHelper = () => {
    const o = organizations.find(org => org.value == query.organizationId)?.label || ''
    const d = divisions.find(div => div?.value == query.divisionId)?.label || ''
    return o + ' - ' + d + ' - ' + moment(query?.date).format('DD MMMM YYYY')
  }

  const isValidForm = () => {
    if (query.divisionId != '' && query.organizationId != '' && query.date != '') {
      return true
    }
    return false
  }

  const getSumHa = (arr = [], chapelName: string, toGet: string): string => {
    let sum = 0
    arr.forEach((pusingan: IReportChapelResponse) => {
      if (pusingan.rotation) {
        sum += pusingan[chapelName][toGet] || 0
      }
    })
    return (sum || 0).toString()
  }

  const constructData = () => {
    const mapped = datas.map((d: IReportChapelResponse) => {
      const temps = [
        'Pusingan ' + d?.rotation,
        d?.a?.ha || '0',
        d?.a?.percent || '0',
        d?.b?.ha || '0',
        d?.b?.percent || '0',
        d?.c?.ha || '0',
        d?.c?.percent || '0',
        d?.d?.ha || '0',
        d?.d?.percent || '0',
        d?.e?.ha || '0',
        d?.e?.percent || '0',
        d?.f?.ha || '0',
        d?.f?.percent || '0',
      ]
      return temps
    })

    mapped.push([
      'Total',
      getSumHa(datas, 'a', 'ha'),
      getSumHa(datas, 'a', 'percent'),
      getSumHa(datas, 'b', 'ha'),
      getSumHa(datas, 'b', 'percent'),
      getSumHa(datas, 'c', 'ha'),
      getSumHa(datas, 'c', 'percent'),
      getSumHa(datas, 'd', 'ha'),
      getSumHa(datas, 'd', 'percent'),
      getSumHa(datas, 'e', 'ha'),
      getSumHa(datas, 'e', 'percent'),
      getSumHa(datas, 'f', 'ha'),
      getSumHa(datas, 'f', 'percent'),
    ])

    return mapped
  }

  const shouldClearQuery = () => {
    if (!isValidForm()) {
      setQuery({
        ...query,
        organizationId: '',
        divisionId: '',
        date: '',
      })
    }
  }

  const getData = useCallback(data => {
    dispatch(actions.getChapelReport.request({loading: true, data: {...data}}))
  }, [])

  const refreshMaterializedViews = () => {
    dispatch(actions.refreshMaterializedViews.request({loading: true}))
    if (isValidForm()) {
      getData(query)
    }
  }

  const onSubmitFilter = () => {
    getData(query)
    setModalFilter(false)
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window, screen}) => {
      setDimensions({window, screen})
    })
    return () => subscription?.remove()
  })

  useEffect(() => {
    // refreshMaterializedViews()
    dispatch(actions.getOrganizationAll.request({loading: true}))
    dispatch(actions.getAllDivision.request({loading: true}))
  }, [])

  const handleExport = async () => {
    try {
      if (query?.divisionId == '' || query?.date == '') {
        showErrorToast('Pilih divisi dan tanggal terlebih dahulu')
        return
      }
      const millis = new Date().getTime()
      const title = constructTitleHelper()
      const fileName = `report_kapel__${millis}.xls`
      const tofile = await downloadFile(
        System.instance.dashboardAndChartService.getExportChapelReportURL({
          divisionId: query?.divisionId || '',
          date: query?.date || '',
        }),
        fileName,
      )
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, c.NOTIF_BODY(fileName), c.EXPORT_NOTIFICATION_ID, {
          path: tofile,
        })
        .then(res => {})
        .catch(e => {})
      showSuccessToast('Berhasil mengekspor data. Periksa folder Download anda')
    } catch (error: any) {
      showErrorToast('Gagal saat mengekspor data. (' + error.message + ')')
    }
  }

  const ChartView = () => (
    <View>
      {isValidForm() && (
        <View>
          <Text>{constructTitleHelper()}</Text>
        </View>
      )}
      {Boolean(chapelReport?.loading) && isValidForm() && (
        <Text color={theme.colors.grey} style={{margin: 16, alignSelf: 'center'}}>
          Memperbarui
        </Text>
      )}

      {!isValidForm() ? (
        <EmptyChart />
      ) : (
        !chapelReport?.loading && (
          <View>
            <View style={{alignSelf: 'flex-end'}}>
              <Button onPress={handleExport}>
                <Text size={11} color={theme.colors.white}>
                  Export Excel
                </Text>
              </Button>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={styles.tableViewContainer}>
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
                    {constructData().map((data, index) => (
                      <Row
                        key={index}
                        data={data}
                        widthArr={widthArr}
                        style={[index % 2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.tableRow}
                      />
                    ))}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title={'Laporan Pusingan & Kapel'}
        headerRight={() => (
          <TouchableOpacity
            onPress={() => {
              setModalFilter(true)
            }}
            style={{alignItems: 'center'}}>
            <AntDesign name="filter" size={14} color={theme.colors.textThinBlack} />
          </TouchableOpacity>
        )}
      />

      <ScrollView style={{paddingHorizontal: 16}} contentContainerStyle={{paddingBottom: 86, paddingTop: 8}}>
        <ChartView />
      </ScrollView>
      <ModalFilter
        isOpen={modalFilter}
        onTouchOutside={() => {
          shouldClearQuery()
          setModalFilter(false)
        }}>
        <View
          style={{flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', alignItems: 'center'}}>
          <Text type="semibold" size={13} color="#000000">
            Filter
          </Text>
          <TouchableOpacity
            style={{padding: 8}}
            onPress={() => {
              shouldClearQuery()
              setModalFilter(false)
            }}>
            <AntDesign name="close" size={18} />
          </TouchableOpacity>
        </View>

        <View style={{width: '100%', marginVertical: 8}}>
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
            onChange={organizationId => setQuery({...query, divisionId: '', organizationId})}
          />
        </View>

        <View style={{width: '100%', marginVertical: 8}}>
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
            onChange={divisionId => setQuery({...query, divisionId})}
          />
        </View>

        <View style={{width: '100%', marginVertical: 8}}>
          <Text size={11} type="semibold">
            Tanggal
            <Text size={11} color="red">
              *
            </Text>
          </Text>

          <TouchableOpacity style={{alignSelf: 'stretch'}} onPress={() => setIsDatePickerOpen(true)}>
            <TextInput
              editable={false}
              placeholderTextColor={theme.colors.darkGray}
              keyboardType="phone-pad"
              value={query.date}
              placeholder="Pilih tanggal"
              style={[styles.regularInput]}
            />
          </TouchableOpacity>
        </View>

        <Button disabled={!isValidForm()} style={{width: '100%'}} onPress={() => onSubmitFilter()}>
          <Text color="white">Filter Kapel</Text>
        </Button>
      </ModalFilter>

      {isDatePickerOpen && (
        <DateTimePicker
          testID="datepicker-library"
          value={query.date != '' ? new Date(query.date) : new Date()}
          onChange={(event: Event, selectedDate: Date | undefined) => {
            setIsDatePickerOpen(false)
            if (event.type == 'set') {
              const stringDate = moment(selectedDate).format('YYYY-MM-DD')
              setQuery({...query, date: stringDate})
            }
          }}
        />
      )}
    </SafeAreaView>
  )
}

export default ChapelReport

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  wrapSearch: {flex: 1, flexDirection: 'row'},
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
  tableViewContainer: {
    marginTop: 16,
    marginBottom: 1,
  },
  tableHeader: {
    height: 40,
    backgroundColor: theme.colors.lightGrey,
  },
  tableHeaderText: {
    fontWeight: '700',
    padding: 10,
    alignSelf: 'center',
  },
  tableRow: {
    padding: 8,
    alignSelf: 'center',
  },
})
