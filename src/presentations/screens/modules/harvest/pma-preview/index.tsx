import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { theme } from '@app/presentations/utils/styles'
import { Header, Text } from '@app/presentations/_shared-components'
import PMATableHeader from './table-header'
import PMAPreviewInfo from './pma-preview-info'
import { Table, Row, TableWrapper, Cell, Col } from 'react-native-table-component'
import { useRoute } from '@react-navigation/native'
import { IPMAEmployee, IPMAEmployeeFormData, IPMAEmployeeMerged } from '@app/models/eplant/PMA'

const dummy = [['12345', 'Supratman', 'Blok Mandiri', '4', '5', '6', '7', '8', '9', '10']]
const widthArr = [150, 250, 180, 100, 175, 175, 175, 175, 100, 100]

interface ITableData {
  isDraft?: boolean
  nip: string
  name: string
  blockName: string
  plantingYear?: string
  ancak: string | number | undefined
  notHarvestFruit: string | number | undefined
  sunFruit: string | number | undefined
  looseOnPlateAndPiku: string | number | undefined
  looseOnTph: string | number | undefined
  brokenMidrib: string | number | undefined
  onPlateMidrib: string | number | undefined
}

const PMAPreview = () => {
  const route: any = useRoute()
  const pmaParent = route?.params?.pmaParent
  const employeeList = route?.params?.employeeList
  const pmaFilterData = route?.params?.pmaFilterData

  const constructTableData = () => {
    const pmas = employeeList || []
    const temp: ITableData[] = []
    pmas.forEach((e: IPMAEmployeeMerged) => {
      const tableData: ITableData = {
        isDraft: Boolean(e?.isDraft),
        nip: e.user?.nip || '',
        name: e.user?.name || '',
        blockName: e?.block?.code || '',
        plantingYear: e?.plantingYear || '-',
        ancak: e?.ancak,
        notHarvestFruit: e?.notHarvestFruit,
        sunFruit: e?.sunFruit,
        looseOnPlateAndPiku: e?.looseOnPlateAndPikul,
        looseOnTph: e?.looseOnTph,
        brokenMidrib: e?.brokenMidrib,
        onPlateMidrib: e?.onPlateMidrib,
      }
      temp.push(tableData)
    })
    return temp
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Lihat PMA" />
      <ScrollView style={styles.scroll}>
        <PMAPreviewInfo {...pmaFilterData} />

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View>
            <PMATableHeader />
            <ScrollView>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                {constructTableData().map((d, idx) => (
                  <Row
                    key={idx}
                    data={[
                      d.nip,
                      d.name,
                      d.blockName,
                      d.plantingYear,
                      d.ancak,
                      d.notHarvestFruit,
                      d.sunFruit,
                      d.looseOnPlateAndPiku,
                      d.looseOnTph,
                      d.brokenMidrib,
                      d.onPlateMidrib,
                    ]}
                    widthArr={widthArr}
                    style={[d.isDraft ? { backgroundColor: theme.colors.redSemiTransparent } : { backgroundColor: '#fff' }]}
                    textStyle={styles.tableRow}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PMAPreview

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    // marginBottom: 75,
  },
  container: {
    marginVertical: 5,
    justifyContent: 'center',
    flexDirection: 'row',
  },
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
