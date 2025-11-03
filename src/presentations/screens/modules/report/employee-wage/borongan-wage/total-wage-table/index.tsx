import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Table, Row } from 'react-native-table-component'
import { CostRawat, IEmployeeWageRow, TotalCost } from '@app/models/eplant/EmployeeWage'
import numberWithDot from '@app/presentations/utils/numberWithDot'

const tHeader = [
    'Upah Panen',
    'Upah Rawat	',
    'Total Upah',
    'Natura (Kg)',
]

interface IProps {
    data?: IEmployeeWageRow['borongan']['totalCost']
}

const TotalWageTable = ({ data }: IProps) => {
    return (
        <View style={styles.tableViewContainer}>
            <>
                <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.grey }}>
                    <Row widthArr={Array(tHeader.length).fill(110)} data={tHeader} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                </Table>
                <ScrollView>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                        <Row
                            key={0}
                            data={[
                                data?.costPanen ? 'Rp ' + numberWithDot(data?.costPanen) : '-',
                                data?.costRawat ? 'Rp ' + numberWithDot(data?.costRawat) : '-',
                                data?.totalCost ? 'Rp ' + numberWithDot(data?.totalCost) : '-',
                                data?.natura ? 'Rp ' + numberWithDot(data?.natura) : '-',
                            ]}
                            widthArr={Array(tHeader.length).fill(110)}
                            style={{ backgroundColor: theme.colors.pureWhite }}
                            textStyle={styles.tableRow}
                        />
                    </Table>
                </ScrollView>
            </>
        </View>
    )
}

export default TotalWageTable

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
