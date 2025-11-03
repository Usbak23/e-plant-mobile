import { theme } from '@app/presentations/utils/styles'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { IEmployeeWageRow } from '@app/models/eplant/EmployeeWage'
import HarvestWageTable from './harvest-wage-table'
import { Button, Text } from '@app/presentations/_shared-components'
import TakecareWageTable from './takecare-wage-table'
import TotalWageTable from './total-wage-table'
import Icon from 'react-native-vector-icons/AntDesign'

interface IProps {
    data?: IEmployeeWageRow['daily']
    onExport: () => void
}

const DailyWage = ({ data, onExport }: IProps) => {
    return (
        <ScrollView contentContainerStyle={{ paddingVertical: 8 }} >
            <Button onPress={onExport} mode='outlined' style={styles.btnExport}>
                <Icon name="download" size={18} />
                <Text style={{ marginLeft: 8 }}>Eksport</Text>
            </Button>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text type='semibold'>Upah Panen</Text>
                    <HarvestWageTable data={data?.costPanen} />
                </View>
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text type='semibold'>Upah Rawat</Text>
                    <TakecareWageTable data={data?.costRawat} />
                </View>
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text type='semibold'>Total Upah</Text>
                    <TotalWageTable data={data?.totalCost} />
                </View>
            </ScrollView>
        </ScrollView>
    )
}

export default DailyWage

const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 6,
        marginHorizontal: 22,
        backgroundColor: theme.colors.pureWhite,
        borderWidth: 1,
        borderColor: theme.colors.defaultBorderColor,
        marginBottom: 16
    },
    btnExport: {
        borderColor: theme.colors.defaultBorderColor,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start", paddingVertical: 8, marginTop: 0, marginLeft: 22,
        paddingHorizontal: 16
    }
})
