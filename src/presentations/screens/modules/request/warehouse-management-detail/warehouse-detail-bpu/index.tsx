import {IManagementWarehouseBPU} from '@app/models/eplant/WarehouseManagement'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import {Table, Row} from 'react-native-table-component'

const tHeader = ['Blok', 'Jenis Pupuk', 'Kg/Pokok', 'Tonase', 'Kg/Until']
const widthArr = [150, 150, 150, 150, 150]
const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

interface IWarehouseBPU {
  bpus?: IManagementWarehouseBPU[]
  materialName?: string
}

const WarehouseBPU = ({bpus = [], materialName}: IWarehouseBPU) => {
  return (
    <View style={{marginVertical: 16}}>
      <ScrollView horizontal={true}>
        {bpus.length == 0 ? (
          <Text style={{alignSelf: 'center'}}>Tidak ada data untilan</Text>
        ) : (
          <View style={styles.tableViewContainer}>
            <>
              <Table borderStyle={{borderWidth: 1, borderColor: theme.colors.grey}}>
                <Row widthArr={widthArr} data={tHeader} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
              </Table>
              <ScrollView>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {(bpus || []).map((e: IManagementWarehouseBPU, idx: number) => {
                    return (
                      <Row
                        key={idx}
                        data={[e?.block?.code || '-', materialName || '-', e?.kgPerPokok, e?.tonnage, e?.kgPerUntil]}
                        widthArr={widthArr}
                        style={{backgroundColor: theme.colors.pureWhite}}
                        textStyle={styles.tableRow}
                      />
                    )
                  })}
                </Table>
              </ScrollView>
            </>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default WarehouseBPU

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
