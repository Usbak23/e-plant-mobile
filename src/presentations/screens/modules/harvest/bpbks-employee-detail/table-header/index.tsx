import React from 'react'

import { StyleSheet, View } from 'react-native'
import { theme } from '@app/presentations/utils/styles'
import { Table, Row, TableWrapper, Cell, Col } from 'react-native-table-component'

const dataHeader = ['Matang', 'Mentah', 'Lewat Matang', 'Busuk', 'Gagang PJG', 'Brondolan', 'Buah Abnormal', 'Buah Matahari']

const BPBKSEmployeeTableHeader = () => (
  <TableWrapper style={{ flexDirection: 'row' }} borderStyle={{ borderWidth: 1, borderColor: theme.colors.grey }}>
    <Row
      data={['TPH', 'Tahun Tanam', 'Jumlah Janjang']}
      widthArr={[100, 100, 100]}
      style={styles.tableHeader}
      textStyle={styles.tableHeaderText}
    />
    <TableWrapper style={{ width: 800 }}>
      <Cell data={['Buah / Janjang yang diperiksa']} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
      <TableWrapper style={{ flexDirection: 'row' }}>
        {dataHeader.map(e => (
          <Col style={[{ flex: 1 }, styles.tableHeader]} data={[e]} heightArr={[40]} textStyle={styles.tableHeaderText} />
        ))}
      </TableWrapper>
    </TableWrapper>
  </TableWrapper>
)

export default BPBKSEmployeeTableHeader

const styles = StyleSheet.create({
  tableViewContainer: {
    marginTop: 16,
  },
  tableHeader: {
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
})
