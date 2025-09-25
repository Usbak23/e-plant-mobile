import React, {useCallback, useEffect, useState} from 'react'
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
import {theme} from '@app/presentations/utils/styles'
import WebView from 'react-native-webview'
import {Button, EmptyChart, Header, SelectInput, Text} from '@app/presentations/_shared-components'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import ModalFilter from '@app/presentations/_shared-components/ModalFilter'
import AntDesign from 'react-native-vector-icons/AntDesign'
import DateTimePicker, {Event} from '@react-native-community/datetimepicker'
import {useRoute} from '@react-navigation/native'
import {useLoggedInOrganizationsAndDivision} from '@app/domain/states/user/hooks'
import moment from 'moment'
import downloadFile from '@app/presentations/utils/downloadFile'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const AKPReport = () => {
  const dispatch = useDispatch()
  const route: any = useRoute()
  const q = route?.params?.query
  const [dimensions, setDimensions] = useState({window, screen})
  const [modalFilter, setModalFilter] = useState(false)

  const organizations = useLoggedInOrganizationsAndDivision()
  const [query, setQuery] = useState({
    search: '',
    organizationId: q?.organizationId || '',
    divisionId: q?.divisionId || '',
    date: q?.date || '',
  })

  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  const akpReport = useSelector((state: RootStateType) => state.dashboardAndChart?.akpReport)
  const iframeUrl = akpReport?.data?.data?.response?.iframe

  const divisions = organizations.find(v => v.value == query.organizationId)?.divisions || []

  const constructTitleHelper = () => {
    const o = organizations.find(org => org.value == query.organizationId)?.label || ''
    const d = divisions.find(div => div?.value == query.divisionId)?.label || ''
    return o + ' - ' + d
  }

  const isValidForm = () => {
    if (query.divisionId != '' && query.organizationId != '' && query.date != '') {
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
        date: q?.date || '',
      })
    }
  }

  const handleSearch = (search: string) => {
    setQuery({...query, search: search})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, search: search})
    }, 500)
  }

  const refreshMaterializedViews = () => {
    // dispatch(actions.refreshMaterializedViews.request({loading: true}))
  }

  const onSubmitFilter = () => {
    getData({...query})
    setModalFilter(false)
  }

  const getData = useCallback(data => {
    dispatch(actions.getAKPReport.request({loading: true, data: {...data}}))
  }, [])

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window, screen}) => {
      setDimensions({window, screen})
    })
    return () => {
      subscription?.remove()
    }
  })

  useEffect(() => {
    refreshMaterializedViews()
    if (isValidForm()) {
      getData({...query})
    }
  }, [])

  const handleExport = async (url: string, fileType: string) => {
    try {
      const millis = `${Date.now()}`
      const title = constructTitleHelper()
      let fileName = `akp_${millis}.${fileType == 'xlsx' ? 'xls' : fileType}`
      const tofile = await downloadFile(url, fileName)
      showSuccessToast('Berhasil mengekspor data.')
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, c.NOTIF_BODY(fileName), c.EXPORT_NOTIFICATION_ID, {
          path: tofile,
        })
        .then(res => {})
        .catch(e => {})
    } catch (e) {
      console.log(e)
      showErrorToast('Gagal saat mengekspor data')
    }
  }

  const ChartView = () => (
    <View>
      {isValidForm() && (
        <Text type="semibold" style={{marginHorizontal: 16, marginTop: 8}}>
          {constructTitleHelper()}
        </Text>
      )}
      {Boolean(akpReport?.loading) && isValidForm() && (
        <Text color={theme.colors.grey} style={{margin: 16, alignSelf: 'center'}}>
          Memperbarui
        </Text>
      )}

      {!isValidForm() ? (
        <EmptyChart />
      ) : (
        iframeUrl && (
          <WebView
            onShouldStartLoadWithRequest={request => {
              try {
                if (request?.url) {
                  const chunked = request.url.split('/')
                  if (
                    chunked[chunked.length - 1] == 'xlsx?' ||
                    chunked[chunked.length - 1] == 'csv?' ||
                    chunked[chunked.length - 1] == 'json?'
                  ) {
                    handleExport(request.url, chunked[chunked.length - 1].replace('?', ''))
                    return false
                  }
                }
                return true
              } catch (e) {
                return true
              }
            }}
            style={[
              styles.webView,
              dimensions.window.height > dimensions.window.width
                ? {width: dimensions.window.width, height: dimensions.window.height * 1.35}
                : {width: dimensions.window.width, height: dimensions.window.height * 2.5},
            ]}
            source={{uri: iframeUrl}}
          />
        )
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Laporan AKP" />
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
            setIsDatePickerOpen(false)
          }}
          style={styles.button}>
          <AntDesign name="filter" size={14} color={theme.colors.textThinBlack} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <ChartView />
      </ScrollView>
      <ModalFilter
        isOpen={modalFilter}
        onTouchOutside={() => {
          shouldClearQuery()
          setModalFilter(false)
          setIsDatePickerOpen(false)
        }}>
        <View
          style={{flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', alignItems: 'center'}}>
          <Text type="semibold" size={13} color="#000000">
            Filter AKP
          </Text>
          <TouchableOpacity
            style={{padding: 8}}
            onPress={() => {
              shouldClearQuery()
              setModalFilter(false)
              setIsDatePickerOpen(false)
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

        <Button disabled={!isValidForm()} style={{width: '100%', marginTop: 20}} onPress={() => onSubmitFilter()}>
          <Text color="white">Filter</Text>
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

export default AKPReport

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
  wrapSearch: {flex: 1, flexDirection: 'row'},
  regularInput: {
    marginTop: 16,
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
  textInputTouch: {
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'stretch',
    backgroundColor: 'red',
  },
  textV: {
    fontSize: 12,
    color: theme.colors.darkGray,
    alignContent: 'stretch',
    fontStyle: 'italic',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
  },
})
