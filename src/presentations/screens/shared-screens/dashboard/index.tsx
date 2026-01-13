import { theme } from '@app/presentations/utils/styles'
import { Button, EmptyChart, Header, SelectInput, Text } from '@app/presentations/_shared-components'
import React, { useEffect, useState } from 'react'
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View, ScrollView, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ModalFilter from '@app/presentations/_shared-components/ModalFilter'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { IDashboardChartRow } from '@app/models/eplant/Dashboard'
import WebView from 'react-native-webview'
import { DashboardMoreButtons } from '@app/models/eplant/DashboardMoreButtonConstant'
import { useNavigation } from '@react-navigation/native'
import DateTimePicker, { Event } from '@react-native-community/datetimepicker'
import {
  useIsAllowedToSeeDashboard,
  useIsAllowedToSeeDashboardBudgeting,
  useIsAllowedToSeeDashboardHarvestBudget,
  useIsAllowedToSeeDashboardTakeCareBudget,
  useIsAllowedToSeeDashboardTakeCareResult,
  useLoggedInOrganizationsAndDivision,
} from '@app/domain/states/user/hooks'
import { useRangeYears } from '@app/domain/states/master/hooks'
import { MonthsSelect } from '@app/models/eplant/MonthConstant'
import downloadFile from '@app/presentations/utils/downloadFile'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import NoAccessView from '@app/presentations/_shared-components/NoAccess'
import { ROLE_ACCESS_SLUG } from '@app/models/eplant/Role'
import { useSubActivityOptions } from '@app/domain/states/subactivity/hooks'
import { useForm } from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as yup from 'yup'
import * as c from '@utils/notifications/constantsNotificationt'
import * as notifications from '@utils/notifications/eksportNotification'
import ProduksiGroupCard from './produksi-group-card'
import moment from 'moment'
import { get } from 'react-hook-form'

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const dashboardSchema = yup.object().shape({
  subActivitydId: yup.string(),
})

const Dashboard = () => {
  const resolver = useYupValidationResolver(dashboardSchema)
  const modules = useSelector((state: RootStateType) => state.user?.currentUserInfo?.data?.role?.roleModules || [])
  const isAllowedToSeeDashboard = useIsAllowedToSeeDashboard()
  const isAllowedToSeeDashboardBudgeting = useIsAllowedToSeeDashboardBudgeting()
  const isAllowedToSeeTakeCareBudgeting = useIsAllowedToSeeDashboardTakeCareBudget()
  const isAllowedToSeeHarvestBudgeting = useIsAllowedToSeeDashboardHarvestBudget()
  const isAllowedToSeeDashboardTakeCareResult = useIsAllowedToSeeDashboardTakeCareResult()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [searchComponent, setSearchComponent] = useState('')
  const [dimensions, setDimensions] = useState({ window, screen })
  const [modalFilter, setModalFilter] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  const organizations = useLoggedInOrganizationsAndDivision()
  const years = useRangeYears()
  const subActivities = useSubActivityOptions('rawat')

  const [queryModal, setQueryModal] = useState({
    organizationId: organizations.length > 0 ? organizations[0].value : '',
    divisionId: '',
    year: new Date().getFullYear().toString(),
    month: '',
    subActivityId: '',
    subActivityIdBudgeting: '',
    restanParamsDate: ''
  })

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      subActivityId: '',
    },
  })

  const allChart = useSelector((state: RootStateType) => state.dashboardAndChart?.allCharts)
  const getShortName = (slug: string) => {
    //somehow react native fileviewer cannot open a file name with very long name. I will trim it here
    if (slug == 'total-produksi') {
      return 'total_produksi'
    } else if (slug == 'total-rawat-dan-pemupukan') {
      return 'total_rawat_pemupukan'
    } else if (slug == 'produksi-per-mandor') {
      return 'produksi_mandor'
    } else if (slug == 'produksi-per-pemanen') {
      return 'produksi_pemanen'
    } else if (slug == 'kualitas-buah-per-blok') {
      return 'kualitas_buah'
    } else if (slug == 'bjr') {
      return 'd-bjr'
    } else if (slug == 'pmb' || slug == 'pmb-organization' || slug == 'pmb-division') {
      return 'd-pmb'
    } else if (slug == 'akp') {
      return 'd-akp'
    } else if (slug == 'yield') {
      return 'd-yield'
    } else if (slug == 'hasil-perawatan') {
      return 'hasil-rawat'
    } else if (slug == 'budgeting') {
      return 'budgeting'
    } else if (slug == 'biaya-rawat-ha') {
      return 'biayaRawatHa'
    } else if (slug == 'biaya-panen-kg') {
      return 'biayaPanenKg'
    } else {
      return 'dasboard'
    }
  }

  const sortChart = (chartArr: any[]) => {
    const orderArray = [
      "total-produksi",
      "yield",
      "akp",
      "bjr",
      "refraksi-pks",
      "total-restan",
      "produksi-per-mandor",
      "produksi-per-pemanen",
      "hasil-perawatan",
      "pmb-organization",
      "pmb-division",
      "pmb",
      "kualitas-buah-per-blok",
      "biaya-rawat-ha",
      "biaya-panen-kg",
      "budgeting"
    ];
    return orderArray.map((slug) => chartArr.find((obj: any) => obj.slug === slug));
  }

  const filteredChart = (chartArr: any) => {
    return chartArr.filter((chart: any) => {
      if (
        chart?.slug == 'total-produksi' &&
        modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_TOTAL_PRODUCTION)
      ) {
        return true
      // } else if (
      //   chart?.slug == 'total-rawat-dan-pemupukan' &&
      //   modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_TOTAL_TAKECARE_AND_FERTILIZATION)
      // ) {
      //   return true
      // } else if (
      //   chart?.slug == 'produksi-per-mandor' &&
      //   modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_PRODUCTION_PER_MANDOR)
      // ) {
      //   return true
      // } else if (
      //   chart?.slug == 'produksi-per-pemanen' &&
      //   modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_PRODUCTION_PER_HARVESTER)
      // ) {
      //   return true
      } else if (
        chart?.slug == 'kualitas-buah-per-blok' &&
        modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_QUALITY_OF_FRUIT_PER_BLOCK)
      ) {
        return true
      // } else if (chart?.slug == 'bjr' && modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_REPORT_BJR)) {
      //   return true
      // } else if (chart?.slug == 'refraksi-pks' && modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_DASHBOARD_REFRAKSI)) {
      //   return true
      // } else if (chart?.slug == 'total-restan' && modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_REPORT_PMB)) {
      //   return true
      // } else if (chart?.slug == 'pmb' && modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_REPORT_PMB)) {
      //   return true
      // } else if (chart?.slug == 'pmb-organization' && modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_REPORT_PMB)) {
      //   return true
      // } else if (chart?.slug == 'pmb-division' && modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_REPORT_PMB)) {
      //   return true
      } else if (chart?.slug == 'akp' && modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_REPORT_AKP)) {
        return true
      } else if (chart?.slug == 'yield' && modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_REPORT_YIELD)) {
        return true
      } else if (chart?.slug == 'bpbks' && modules.find((m: any) => m.slug == ROLE_ACCESS_SLUG.SEE_REPORT_BPBKS)) {
        return true
      // } else if (chart?.slug == 'hasil-perawatan') {
      //   return isAllowedToSeeDashboardTakeCareResult
      // } else if (chart?.slug == 'budgeting') {
      //   return isAllowedToSeeDashboardBudgeting
      // } else if (chart?.slug == 'biaya-rawat-ha') {
      //   return isAllowedToSeeTakeCareBudgeting
      // } else if (chart?.slug == 'biaya-panen-kg') {
      //   return isAllowedToSeeHarvestBudgeting
      }

      return false
    })
  }
  const charts = () => filteredChart(sortChart(allChart?.data?.response || []))

  const divisions = organizations.find(v => v.value == queryModal.organizationId)?.divisions || []

  const withSearch = (datas = []) => {
    const filteredComponents = datas.filter((c: IDashboardChartRow) => {
      return c.label?.toLowerCase().includes(searchComponent.toLowerCase())
    })
    return filteredComponents || []
  }

  const isValidForm = () => {
    if (queryModal.organizationId != '' && queryModal.year != '') {
      return true
    }
    return false
  }

  const getData = (query: any) => {
    dispatch(actions.getAllChart.request({ loading: true, data: query }))
    if (Boolean(modules.some(e => e.slug === ROLE_ACCESS_SLUG.SEE_DASHBOARD_PRODUCTION_PER_GROUP))) {
      dispatch(actions.getProductionOrganization.request({ loading: true, data: query }))
    }
  }

  const onSubmitFilter = () => {
    getData(queryModal)
    setModalFilter(false)
  }

  useEffect(() => {
    const subscription: any = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen })
    })
    // @ts-ignore
    return () => subscription?.remove()
  })

  useEffect(() => {
    if (isValidForm()) {
      getData(queryModal)
    }
  }, [])

  const shouldUsePopup = (slug: string): boolean => {
    return DashboardMoreButtons.find((s: any) => s.key == slug) != undefined
  }

  const handleExport = async (url: string, fileType: string, name: string = '') => {
    try {
      const cleanedName = name.replace('/', ' ')
      const millis = new Date().getTime()
      const fileName = `${name}.${fileType}`
      const tofile = await downloadFile(url, fileName)
      notifications
        .onDisplayNotificationExportFile(c.NOTIF_TITLE, c.NOTIF_BODY(fileName), c.EXPORT_NOTIFICATION_ID, {
          path: tofile,
        })
        .then(res => { })
        .catch(e => {
          console.log('e', e)
        })
      showSuccessToast('Berhasil mengekspor data. Periksa folder Download anda')
    } catch (error: any) {
      showErrorToast('Gagal saat mengekspor data')
    }
  }


  return (
    <SafeAreaView style={styles.root}>
      <Header
        hideBackButton={true}
        title={'Dashboard'}
        headerRight={() => (
          <TouchableOpacity
            onPress={() => {
              setModalFilter(true)
            }}>
            <AntDesign name="filter" size={16} color={theme.colors.textThinBlack} />
          </TouchableOpacity>
        )}
      />
      {!isAllowedToSeeDashboard ? (
        <View style={{ flex: 1 }}>
          <NoAccessView />
        </View>
      ) : (
        <>
          {/* <View style={[styles.container]}>
            <View style={styles.wrapSearch}>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalFilter(true)
              }}
              style={styles.button}>
              <AntDesign name="filter" size={14} color={theme.colors.textThinBlack} />
            </TouchableOpacity>
          </View> */}
          <ScrollView overScrollMode="never" style={{ flex: 1, zIndex: 1, marginBottom: 6 }}>
            {allChart?.error?.message ? (
              <Text style={{ alignSelf: 'center' }}>Tidak dapat memuat dashboard {allChart?.error?.message || ''}</Text>
            ) : (
              <View>
                {Boolean(allChart?.loading) && (
                  <Text color={theme.colors.grey} style={{ margin: 16, alignSelf: 'center' }}>
                    Memperbarui
                  </Text>
                )}

                {isValidForm() ? (
                  <View style={{ marginHorizontal: 8 }}>
                    {Boolean(modules.some(e => e.slug === ROLE_ACCESS_SLUG.SEE_DASHBOARD_PRODUCTION_PER_GROUP)) &&
                      <View style={{ margin: 8 }}>
                        <ProduksiGroupCard query={queryModal} />
                      </View>}
                    {charts().map((c: IDashboardChartRow, i: number) => (
                      <View key={i} style={{ marginBottom: 8, }}>
                        <View style={{ flex: 1, alignItems: "flex-end", alignSelf: 'flex-end', paddingEnd: 8, flexDirection: "row" }}>
                          {c.slug === "total-restan" && <TouchableOpacity onPress={() => setIsDatePickerOpen(true)}>
                            <TextInput
                              editable={false}
                              placeholderTextColor={theme.colors.darkGray}
                              keyboardType="phone-pad"
                              value={queryModal.restanParamsDate}
                              placeholder="Pilih tanggal"
                              style={[styles.regularInput]}
                            />
                          </TouchableOpacity>}
                          {shouldUsePopup(c.slug) ? (
                            <SeeReportButton
                              route={DashboardMoreButtons.find(m => m.key == c.slug)?.route || ''}
                              nav={navigation}
                              query={queryModal}
                            />
                          ) : null}
                        </View>

                        {c.slug == 'hasil-perawatan' && (
                          <View style={{ marginHorizontal: 8 }}>
                            <SelectInput
                              label="Sub Aktivitas"
                              placeholder="Pilih Sub Aktivitas"
                              control={control}
                              name="subActivityId"
                              items={subActivities}
                              onChange={v => {
                                setQueryModal(prevQuery => {
                                  const query = { ...prevQuery, subActivityId: v }
                                  getData(query)
                                  return query
                                })
                              }}
                            />
                          </View>
                        )}
                        {c.slug == 'budgeting' && (
                          <View style={{ margin: 8 }}>
                            <SelectInput
                              label="Sub Aktivitas"
                              placeholder="Pilih Sub Aktivitas"
                              control={control}
                              name="subActivityIdBudgeting"
                              items={subActivities}
                              onChange={v => {
                                setQueryModal(prevQuery => {
                                  const query = { ...prevQuery, subActivityIdBudgeting: v }
                                  getData(query)
                                  return query
                                })
                              }}
                            />
                          </View>
                        )}

                        <WebView
                          androidHardwareAccelerationDisabled={true}
                          onShouldStartLoadWithRequest={request => {
                            try {
                              if (request?.url) {
                                const chunked = request.url.split('/')
                                if (
                                  chunked[chunked.length - 1] == 'xlsx?' ||
                                  chunked[chunked.length - 1] == 'csv?' ||
                                  chunked[chunked.length - 1] == 'json?'
                                ) {
                                  handleExport(request.url, chunked[chunked.length - 1].replace('?', ''), getShortName(c.slug))
                                  return false
                                }
                              }
                              return true
                            } catch (e) {
                              console.log('error onShouldStartWithReq:', e)
                              return true
                            }
                          }}
                          onError={e => {
                            console.log('crash dashboard', e)
                          }}
                          onTouchEnd={e => { }}
                          // nestedScrollEnabled
                          style={[
                            styles.webView,
                            dimensions.window.height > dimensions.window.width
                              ? { width: "100%", height: dimensions.window.height / 1.5 }
                              : { width: "100%", height: dimensions.window.height * 1.5 },
                          ]}
                          source={{ uri: c.data?.iframe }}
                        />
                      </View>
                    ))}
                  </View>
                ) : (
                  <EmptyChart />
                )}
              </View>
            )}
          </ScrollView>
        </>
      )}

      <ModalFilter
        isOpen={modalFilter}
        onTouchOutside={() => {
          setModalFilter(false)
        }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', alignItems: 'center' }}>
          <Text type="semibold" size={13} color="#000000">
            Filter Dashboard
          </Text>
          <TouchableOpacity
            style={{ padding: 8 }}
            onPress={() => {
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
            value={queryModal.organizationId}
            isRequired
            placeholder="Pilih Organisasi"
            onChange={organizationId =>
              setQueryModal(prevQuery => ({ ...prevQuery, divisionId: '', organizationId }))
            }
          />
        </View>

        <View style={{ width: '100%', marginVertical: 8 }}>
          <Text size={11} type="semibold">
            Divisi
          </Text>
          <SelectInput
            containerStyle={styles.filterInput}
            items={divisions}
            value={queryModal.divisionId}
            placeholder="Pilih Divisi"
            onChange={divisionId =>
              setQueryModal(prevQuery => ({ ...prevQuery, divisionId }))
            }
          />
        </View>

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
            value={`${queryModal.year}`}
            isRequired
            placeholder="Pilih Tahun"
            onChange={v =>
              setQueryModal(prevQuery => ({ ...prevQuery, year: v }))
            }
          />
        </View>

        <View style={{ width: '100%', marginVertical: 8 }}>
          <Text size={11} type="semibold">
            Bulan
          </Text>
          <SelectInput
            containerStyle={styles.filterInput}
            items={MonthsSelect}
            value={`${queryModal.month}`}
            placeholder="Pilih Bulan"
            onChange={v =>
              setQueryModal(prevQuery => ({ ...prevQuery, month: v }))
            }
          />
        </View>

        <Button disabled={!isValidForm()} style={{ width: '100%', marginTop: 16 }} onPress={() => onSubmitFilter()}>
          <Text color="white">Filter</Text>
        </Button>
      </ModalFilter>
      {isDatePickerOpen && (
        <DateTimePicker
          testID="datepicker-library"
          value={queryModal.restanParamsDate != '' ? new Date(queryModal.restanParamsDate) : new Date()}
          onChange={(event: Event, selectedDate: Date | undefined) => {
            setIsDatePickerOpen(false)
            if (event.type == 'set') {
              const stringDate = moment(selectedDate).format('YYYY-MM-DD')
              setQueryModal(prevQuery => {
                const q = { ...prevQuery, restanParamsDate: stringDate }
                getData(q)
                return q
              })
            }
          }}
        />
      )}
    </SafeAreaView>
  )
}

export default Dashboard

interface Props {
  route: string
  query: any
  nav: any
}
export const SeeReportButton: React.FC<Props> = props => (
  <TouchableOpacity
    onPress={() => {
      props.nav.navigate(props.route, { query: props.query })
    }}
    style={{ padding: 8, borderRadius: 6, borderWidth: 1, borderColor: theme.colors.grey }}>
    <Text color={theme.colors.textThinBlack} type="semibold" size={11}>
      Lihat Laporan
    </Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  webView: {
    resizeMode: 'cover',
    opacity: 0.99,
    // flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
  },
  wrapSearch: { flex: 1, flexDirection: 'row' },
  searhInput: {
    color: theme.colors.textThinBlack,
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
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
  filterInput: {
    marginVertical: -16,
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
  regularInput: {
    color: theme.colors.textThinBlack,
    marginTop: 8,
    borderColor: theme.colors.defaultBorderColor,
    borderWidth: 1,
    borderRadius: 6,
    padding: 2,
    paddingHorizontal: 16,
    fontStyle: 'italic',
    fontSize: 13,
    alignSelf: 'stretch',
    marginRight: 8,
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
