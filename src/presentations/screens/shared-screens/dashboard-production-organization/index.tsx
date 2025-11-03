import { theme } from '@app/presentations/utils/styles'
import { Button, EmptyChart, Header, SelectInput, Text } from '@app/presentations/_shared-components'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ModalFilter from '@app/presentations/_shared-components/ModalFilter'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
    useIsAllowedToSeeDashboard,
    useLoggedInOrganizationsAndDivision,
} from '@app/domain/states/user/hooks'
import { useRangeYears } from '@app/domain/states/master/hooks'
import { MonthsSelect } from '@app/models/eplant/MonthConstant'
import NoAccessView from '@app/presentations/_shared-components/NoAccess'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as yup from 'yup'
import * as c from '@utils/notifications/constantsNotificationt'
import ProduksiGroupCard from '../dashboard/produksi-group-card'
import WebView from 'react-native-webview'
import { IProductionOrganizationChartRow } from '@app/models/eplant/Dashboard'
import ProduksiOrganizationCard from './produksi-organization-card'

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const dashboardSchema = yup.object().shape({
    subActivitydId: yup.string(),
})

const DashboardProductionOrganization = () => {
    const resolver = useYupValidationResolver(dashboardSchema)
    const isAllowedToSeeDashboard = useIsAllowedToSeeDashboard()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [modalFilter, setModalFilter] = useState(false)
    const years = useRangeYears()
    const route: any = useRoute()
    const queryParams: any = route?.params?.query
    const organizations = useLoggedInOrganizationsAndDivision()
    const [dimensions, setDimensions] = useState({ window, screen })

    const [queryModal, setQueryModal] = useState({
        organizationId: queryParams?.organizationId || '',
        year: queryParams?.year || '',
        month: queryParams?.month || '',
    })

    const allChart = useSelector((state: RootStateType) => state.dashboardAndChart?.productionOrganizationChart)

    // @ts-ignore
    const charts = allChart?.data || []

    const isValidForm = () => {
        if (queryModal.organizationId != '' && queryModal.year != '') {
            return true
        }
        return false
    }

    const getData = (query: any) => {
        dispatch(actions.getProductionOrganization.request({ loading: true, data: query }))
        dispatch(actions.getProductionOrganizationChart.request({ loading: true, data: query }))
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

    return (
        <SafeAreaView style={styles.root}>
            <Header
                title={'Dashboard Produksi Organisasi'}
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
                    <ScrollView overScrollMode="never" style={{ flex: 1, zIndex: 1 }}>
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
                                        <View style={{ margin: 8 }}>
                                            <ProduksiGroupCard hideButtonDetail />
                                            <ProduksiOrganizationCard />
                                        </View>
                                        {charts?.map((c, i) => (
                                            <View key={i} style={{ marginTop: -8 }}>
                                                <WebView
                                                    androidHardwareAccelerationDisabled={true}
                                                    scrollEnabled={false}
                                                    useWebKit={true}
                                                    style={[
                                                        styles.webView,
                                                        dimensions.window.height > dimensions.window.width
                                                            ? { width: "100%", height: dimensions.window.height / 1.5 }
                                                            : { width: "100%", height: dimensions.window.height * 1.5 },
                                                    ]}
                                                    source={{ uri: c.data?.iframe }}
                                                    injectedJavaScript={webViewScript}
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
                            setQueryModal(prevQuery => ({ ...prevQuery, organizationId }))
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
        </SafeAreaView>
    )
}

export default DashboardProductionOrganization

const webViewScript = `
  setTimeout(function() { 
    window.ReactNativeWebView.postMessage(document.body.scrollHeight)
  }, 500);
  true; // note: this is required, or you'll sometimes get silent failures
`;

const styles = StyleSheet.create({
    root: {
        backgroundColor: theme.colors.pureWhite,
        flex: 1,
    },
    webView: {
        resizeMode: 'cover',
        opacity: 0.99
    },
    filterInput: {
        marginVertical: -16,
    },
})
