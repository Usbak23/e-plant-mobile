import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Table, Row } from 'react-native-table-component'
import { CostPanen2, IEmployeeWageRow } from '@app/models/eplant/EmployeeWage'
import numberWithDot from '@app/presentations/utils/numberWithDot'

const tHeader = [
    'Nama Karyawan',
    'Tahun Tanam',
    'Hari Kerja',
    'Tandan (Kg)',
    'Upah Borongan (Rp)',
    'Insentif HK (Rp)',
    'Natura Beras (Kg)',
    'Total Upah Panen',
]

interface IProps {
    data?: IEmployeeWageRow['borongan']['costPanen']
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
                        {(data || []).map((e: CostPanen2, idx: number) => {
                            const row = [
                                e?.name || '-',
                                e?.plantingYear || '-',
                                e?.workingDay || '-',
                                e?.bunchKg ? 'Rp ' + numberWithDot(e?.bunchKg) : '-',
                                e?.boronganWage ? 'Rp ' + numberWithDot(e?.boronganWage) : '-',
                                e?.incentiveHk ? 'Rp ' + numberWithDot(e?.incentiveHk) : '-',
                                e?.natureKg ? 'Rp ' + numberWithDot(e?.natureKg) : '-',
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
