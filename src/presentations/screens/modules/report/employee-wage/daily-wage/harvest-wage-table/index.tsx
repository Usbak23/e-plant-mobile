import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Table, Row } from 'react-native-table-component'
import { CostPanen, IEmployeeWageRow } from '@app/models/eplant/EmployeeWage'
import numberWithDot from '@app/presentations/utils/numberWithDot'

const tHeader = [
    'Nama Karyawan',
    'Tahun Tanam',
    'Luas (Ha)',
    'Tandan (Kg)',
    'Biaya Basis 1 (Rp)',
    'Biaya Basis 2 (Rp)',
    'Telur',
    'Makan',
    'Total Upah Panen',
    'Total Potongan',
    'Total Upah',
]

interface IProps {
    data?: IEmployeeWageRow['daily']['costPanen']
}

const HarvestWageTable = ({ data }: IProps) => {
    return (
        <View style={styles.tableViewContainer}>
            <>
                <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.grey }}>
                    <Row widthArr={Array(tHeader.length).fill(120)} data={tHeader} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                </Table>
                <ScrollView>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                        {(data || []).map((e: CostPanen, idx: number) => {
                            const row = [
                                e?.name || '-',
                                e?.plantingYear || '-',
                                e?.areaHa || '-',
                                e?.bunchKg ? 'Rp ' + numberWithDot(e?.bunchKg) : '-',
                                e?.costBaseOne ? 'Rp ' + numberWithDot(e?.costBaseOne) : '-',
                                e?.costBaseTwo ? 'Rp ' + numberWithDot(e?.costBaseTwo) : '-',
                                e?.egg ? 'Rp ' + numberWithDot(e?.egg) : '-',
                                e?.eat ? 'Rp ' + numberWithDot(e?.eat) : '-',
                                e?.totalHarvestWage ? 'Rp ' + numberWithDot(e?.totalHarvestWage) : '-',
                                e?.totalPieces ? 'Rp ' + numberWithDot(e?.totalPieces) : '-',
                                e?.totalWage ? 'Rp ' + numberWithDot(e?.totalWage) : '-',
                            ]
                            return (
                                <Row
                                    key={idx}
                                    data={row}
                                    widthArr={Array(tHeader.length).fill(120)}
                                    style={{ backgroundColor: theme.colors.pureWhite }}
                                    textStyle={styles.tableRow}
                                />
                            )
                        })}
                    </Table>
                </ScrollView>
            </>
        </View>
    )
}

export default HarvestWageTable

const styles = StyleSheet.create({
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
    tableViewContainer: {
        marginTop: 16,
        marginBottom: 1,
    },
})
