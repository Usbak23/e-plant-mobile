import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootStateType } from '@app/domain/states/store'
import { useNavigation } from '@react-navigation/native'
import { statusColor } from './color'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import Routes from '@app/presentations/navigation/Routes'

interface IProps {
    query?: any
    hideButtonDetail?: boolean
}

const ProduksiGroupCard = (props?: IProps) => {
    const productionGroup = useSelector((state: RootStateType) => state.dashboardAndChart.productionOrganization?.data?.productionGroup)

    const navigation: any = useNavigation()

    const CARD_DATA = [
        {
            label: "Budget Sensus",
            value: `${numberWithDot(productionGroup?.budget || 0)} Kg`
        },
        {
            label: "Realisasi",
            value: `${numberWithDot(productionGroup?.realisasi || 0)} Kg`
        },
        {
            label: "Persentase",
            value: `${productionGroup?.persentase?.data?.toFixed(2) || '-'} %`,
            status: productionGroup?.persentase?.status
        }
    ]

    return (
        <View style={styles.card}>
            <View style={styles.wrapCardHeader}>
                <Text type="semibold" size={12}>Dashboard Produksi Group</Text>
                <View style={styles.rowCenter}>
                    {!props?.hideButtonDetail && <TouchableOpacity onPress={() => navigation.navigate(Routes.DASHBOARD_PRODUCTION_ORGANIZATION, { query: props?.query })} style={styles.button}>
                        <Text size={10} color='#24272B'>Lihat Detail</Text>
                    </TouchableOpacity>}
                    {/* <AntDesign name="clouddownloado" size={18} color={theme.colors.textThinBlack} /> */}
                </View>
            </View>
            {CARD_DATA.map(data => {
                const status = statusColor(data?.status)
                return (
                    <View style={[styles.cardItem, data?.status !== undefined && { backgroundColor: status.bgColor }]}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text size={11} style={{ marginBottom: 8 }} color={theme.colors.label} type="semibold">{data.label}</Text>
                            {data?.status !== undefined && <Badge status={data.status} />}
                        </View>
                        <Text size={13} type="bold">{data.value}</Text>
                    </View>
                )
            })}
        </View>
    )
}

export const Badge = (props: { status: number }) => {
    const status = statusColor(props.status)
    return (
        <View style={[styles.badge, { backgroundColor: status.bgColor1 }]}>
            <Text size={9} color={status.color}>{status.text}</Text>
        </View>
    )
}

export default ProduksiGroupCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 16,
        paddingBottom: 8,
        borderRadius: 8,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1.5,
    },
    wrapCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    rowCenter: { flexDirection: "row", alignItems: "center" },
    button: {
        padding: 6,
        paddingHorizontal: 8,
        backgroundColor: "#F1F3F6",
        borderRadius: 4,
    },
    cardItem: {
        padding: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#F1F3F6",
        marginBottom: 8
    },
    badge: { padding: 12, borderRadius: 50, paddingVertical: 4, alignItems: "center" }
})
