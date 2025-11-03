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
import {MonthsSelect} from '@app/models/eplant/MonthConstant'
import {
  useLoggedInOrganizationsAndDivision,
  useLoggedInOrganizationsAndDivisionAndBlock,
} from '@app/domain/states/user/hooks'
import {useRangeYears} from '@app/domain/states/master/hooks'
import {useRoute} from '@react-navigation/native'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import downloadFile from '@app/presentations/utils/downloadFile'
import {IBlockRow} from '@app/models/eplant/Block'
import * as notifications from '@utils/notifications/eksportNotification'
import * as c from '@utils/notifications/constantsNotificationt'

let debounceSearch: NodeJS.Timeout

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const BJRBlockReport = () => {
  const dispatch = useDispatch()
  const route: any = useRoute()
  const q = route?.params?.query
  const [dimensions, setDimensions] = useState({window, screen})
  const [modalFilter, setModalFilter] = useState(false)
  const years = useRangeYears()
  const organizations = useLoggedInOrganizationsAndDivisionAndBlock()
  const [query, setQuery] = useState({
    search: '',
    organizationId: q?.organizationId || '',
    divisionId: q?.divisionId || '',
    blockId: '',
    month: q?.month || '',
    year: q?.year || '',
  })
  const bjrReport = useSelector((state: RootStateType) => state.dashboardAndChart?.bjrBlockReport)
  const iframeUrl = bjrReport?.data?.response?.iframe

  const divisions = organizations.find(v => v.value == query.organizationId)?.divisions || []
  // const blocks = divisions.find(v => v.value == query.divisionId)?.blocks || []
  const blocks = useSelector((state: RootStateType) => state.dashboardAndChart?.blockAll?.data) || []

  const constructTitleHelper = () => {
    const o = organizations.find(org => org.value == query.organizationId)?.label || ''
    const d = divisions.find(div => div?.value == query.divisionId)?.label || ''
    return o + ' - ' + d
  }

  const isValidForm = () => {
    if (
      query.divisionId != '' &&
      query.organizationId != '' &&
      query.month != '' &&
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
        blockId: '',
        month: q?.month || '',
        year: q?.year || '',
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
    dispatch(actions.refreshMaterializedViews.request({loading: true}))
    if (isValidForm()) {
      getData(query)
    }
  }

  const onSubmitFilter = () => {
    getData(query)
    setModalFilter(false)
  }

  const getData = useCallback(data => {
    dispatch(actions.getBJRReport.request({loading: true, data: {...data}}))
  }, [])

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window, screen}) => {
      setDimensions({window, screen})
    })
    return () => subscription?.remove()
  })

  useEffect(() => {
    if (query.divisionId != '') {
      dispatch(
        actions.getAllBlockByDivision.request({
          loading: true,
          data: {
            division: query.divisionId,
          },
        }),
      )
    }
  }, [query.divisionId])

  useEffect(() => {
    // refreshMaterializedViews()
    dispatch(actions.getRangeYear.request({loading: true}))
  }, [])

  const handleExport = async (url: string, fileType: string) => {
    try {
      const millis = new Date().getTime()
      const title = constructTitleHelper()
      const fileName = `bjr_${millis}.${fileType}`
      const tofile = await downloadFile(url, fileName)
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, c.NOTIF_BODY(fileName), c.EXPORT_NOTIFICATION_ID, {
          path: tofile,
        })
        .then(res => {})
        .catch(e => {})
      showSuccessToast('Berhasil mengekspor data.')
    } catch (error: any) {
      showErrorToast('Gagal saat mengekspor data')
    }
  }

  const ChartView = () => (
    <View>
      {isValidForm() && (
        <Text type="semibold" style={{marginHorizontal: 16}}>
          {constructTitleHelper()}
        </Text>
      )}
      {Boolean(bjrReport?.loading) && isValidForm() && (
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
                console.log('error onShouldStartWithReq:', e)
                return true
              }
            }}
            style={[
              styles.webView,
              dimensions.window.height > dimensions.window.width
                ? {width: dimensions.window.width, height: dimensions.window.height * 2.5}
                : {width: dimensions.window.width, height: dimensions.window.height * 5},
            ]}
            source={{uri: iframeUrl}}
          />
        )
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header title="BJR" />
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
      <ScrollView contentContainerStyle={{paddingBottom: 56, paddingTop: 8}}>
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
            Filter BJR
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
            onChange={divisionId => setQuery({...query, divisionId, blockId: ''})}
          />
        </View>

        <View style={{width: '100%', marginVertical: 8}}>
          <Text size={11} type="semibold">
            Blok
          </Text>
          <SelectInput
            containerStyle={styles.filterInput}
            items={
              query.divisionId == '' || !blocks || !Array.isArray(blocks)
                ? []
                : blocks?.map((b: IBlockRow) => ({value: b.id, label: b.code}))
            }
            value={query.blockId}
            // isRequired
            placeholder="Pilih Blok"
            onChange={blockId => setQuery({...query, blockId})}
          />
        </View>

        <View style={{width: '100%', marginVertical: 8}}>
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
            onChange={v => setQuery({...query, year: v})}
          />
        </View>

        <View style={{width: '100%', marginVertical: 8}}>
          <Text size={11} type="semibold">
            Bulan
            <Text size={11} color="red">
              *
            </Text>
          </Text>
          <SelectInput
            containerStyle={styles.filterInput}
            items={MonthsSelect}
            value={query.month}
            isRequired
            placeholder="Pilih Bulan"
            onChange={v => setQuery({...query, month: v})}
          />
        </View>

        <Button disabled={!isValidForm()} style={{width: '100%'}} onPress={() => onSubmitFilter()}>
          <Text color="white">Filter</Text>
        </Button>
      </ModalFilter>
    </SafeAreaView>
  )
}

export default BJRBlockReport

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
})
