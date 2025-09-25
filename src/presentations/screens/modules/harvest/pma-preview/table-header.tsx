import React from 'react'

import { StyleSheet, View } from 'react-native'
import { theme } from '@app/presentations/utils/styles'
import { Table, Row, TableWrapper, Cell, Col } from 'react-native-table-component'

const PMATableHeader = () => (
  <View style={styles.tableViewContainer}>
    <Table style={{ flexDirection: 'row' }} borderStyle={{ borderWidth: 1, borderColor: theme.colors.grey }}>
      <Row
        data={['NIP', 'Nama', 'Blok', 'Tahun Tanam', 'Ancak']}
        widthArr={[150, 250, 180, 100, 100]}
        style={styles.tableHeader}
        textStyle={styles.tableHeaderText}
      />
      <TableWrapper style={{ width: 350 }}>
        <Cell data={['Buah/Janjang']} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
        <TableWrapper style={{ flexDirection: 'row' }}>
          <Col
            style={[{ flex: 1 }, styles.tableHeader]}
            data={['Tidak Dipanen']}
            heightArr={[40]}
            textStyle={styles.tableHeaderText}
          />
          <Col
            style={[{ flex: 1 }, styles.tableHeader]}
            data={['Matahari']}
            heightArr={[40]}
            textStyle={styles.tableHeaderText}
          />
        </TableWrapper>
      </TableWrapper>

      <TableWrapper style={{ width: 350 }}>
        <Cell
          data={['Brondolan Tidak Dikutip']}
          style={[{ flex: 1 }, styles.tableHeader]}
          textStyle={styles.tableHeaderText}
        />
        <TableWrapper style={{ flexDirection: 'row' }}>
          <Col
            style={[{ flex: 1 }, styles.tableHeader]}
            data={['Di Piringan & Pasar Pikul']}
            heightArr={[40]}
            textStyle={styles.tableHeaderText}
          />
          <Col
            style={[{ flex: 1 }, styles.tableHeader]}
            data={['Di TPH']}
            heightArr={[40]}
            textStyle={styles.tableHeaderText}
          />
        </TableWrapper>
      </TableWrapper>

      <TableWrapper style={{ width: 200 }}>
        <Cell data={['Pelepah/Pokok']} style={[{ flex: 1 }, styles.tableHeader]} textStyle={styles.tableHeaderText} />
        <TableWrapper style={{ flexDirection: 'row' }}>
          <Col
            style={[{ flex: 1 }, styles.tableHeader]}
            data={['Sengkleh']}
            heightArr={[40]}
            textStyle={styles.tableHeaderText}
          />
          <Col
            style={[{ flex: 1 }, styles.tableHeader]}
            data={['Di Piringan']}
            heightArr={[40]}
            textStyle={styles.tableHeaderText}
          />
        </TableWrapper>
      </TableWrapper>

      {/* <TableWrapper style={{flex: 1}}>
        <Cols data={tableData} heightArr={[40, 30, 30, 30, 30]} />
      </TableWrapper> */}
    </Table>
  </View>
)

export default PMATableHeader

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
