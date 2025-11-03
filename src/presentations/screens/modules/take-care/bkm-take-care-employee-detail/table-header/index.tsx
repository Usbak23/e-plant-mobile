import React from 'react'

import {StyleSheet, View, Dimensions} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import {Table, Row, TableWrapper, Cell, Col} from 'react-native-table-component'

const dataHeader = ['Nama Material', 'Jumlah Material']
const {width} = Dimensions.get('window')
const widthArr = [width / 2.19, width / 2.19]
const BKMTakeCareEmployeeTableHeader = () => (
  <TableWrapper style={{flexDirection: 'row'}} borderStyle={{borderWidth: 1, borderColor: theme.colors.grey}}>
    <Row data={dataHeader} widthArr={widthArr} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
  </TableWrapper>
)

export default BKMTakeCareEmployeeTableHeader

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
