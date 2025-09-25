import { theme } from '@app/presentations/utils/styles'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Table, Row } from 'react-native-table-component'
import { CostRawat2, IEmployeeWageRow } from '@app/models/eplant/EmployeeWage'
import numberWithDot from '@app/presentations/utils/numberWithDot'

const tHeader = [
    'Nama Karyawan',
    'Sub Aktivitas',
    'Satuan',
    'Hasil Kerja',
    'Total Upah Rawat',
]

interface IProps {
    data?: IEmployeeWageRow['borongan']['costRawat']
}

const TakecareWageTable = ({ data }: IProps) => {
    return (
        <View style={styles.tableViewContainer}>
            <>
                <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.grey }}>
                    <Row widthArr={Array(tHeader.length).fill(110)} data={tHeader} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                </Table>
                <ScrollView>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                        {(data || []).map((e: CostRawat2, idx: number) => {
                            const row = [
                                e?.name || '-',
                                e?.subActivityName || '-',
                                e?.unit || '-',
                                e?.workResult || '-',
                                e?.totalMaintenanceFee ? 'Rp ' + numberWithDot(e?.totalMaintenanceFee) : '-',
                            ]
                            return (
                                <Row
                                    key={idx}
                                    data={row}
                                    widthArr={Array(tHeader.length).fill(110)}
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

export default TakecareWageTable

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
