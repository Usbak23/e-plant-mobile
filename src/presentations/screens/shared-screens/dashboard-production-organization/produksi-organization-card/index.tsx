import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootStateType } from '@app/domain/states/store'
import { statusColor } from '../../dashboard/produksi-group-card/color'
import { Badge } from '../../dashboard/produksi-group-card'

const ProduksiOrganizationCard = () => {
    const productionOrganization = useSelector((state: RootStateType) => state.dashboardAndChart.productionOrganization)
    const lists = productionOrganization?.data?.productionOrganization || []
    const loading = productionOrganization?.loading
    const error = productionOrganization?.error

    return (
        <View style={styles.card}>
            <View style={styles.wrapCardHeader}>
                <Text type="semibold" size={12}>Dashboard Produksi Organisasi</Text>
            </View>
            {
                loading ? <Text>Memuat...</Text> : error?.message ? <Text>Error: {error?.message}</Text> :
                    lists.map(data => {
                        const status = statusColor(data?.status)
                        return (
                            <View key={data?.name} style={[styles.cardItem, { backgroundColor: status.bgColor }]}>
                                <Text type="semibold" size={11}>{data?.name}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12, marginBottom: 6, alignItems: "center" }}>
                                    <Text size={13} color={status.color} type="bold">{data?.persentase?.toFixed(2) || "-"} %</Text>
                                    <Badge status={data?.status} />
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={[styles.rowCenter, { flex: 1 }]}>
                                        <Text style={{ flex: 0.8 }} color={theme.colors.textThinBlack} size={9}>Budget</Text>
                                        <Text style={{ flex: 1 }} color={theme.colors.textThinBlack} size={9}>: {data?.budget?.toFixed(2) || "-"} Kg</Text>
                                    </View>
                                    <Text type='semibold' style={{ paddingBottom: 4 }} color={theme.colors.textThinBlack} >.</Text>
                                    <View style={[styles.rowCenter, { flex: 1 }]}>
                                        <Text style={{ flex: 0.8, textAlign: 'right' }} color={theme.colors.textThinBlack} size={9}>Realisasi</Text>
                                        <Text style={{ flex: 1, textAlign: 'right' }} color={theme.colors.textThinBlack} size={9}>: {data?.realisasi?.toFixed(2) || "-"} Kg</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
        </View>
    )
}

export default ProduksiOrganizationCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 16,
        paddingBottom: 8,
        borderRadius: 8,
        marginTop: 16,
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
    cardItem: {
        padding: 8,
        paddingBottom: 4,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#F1F3F6",
        marginBottom: 8
    },
})
