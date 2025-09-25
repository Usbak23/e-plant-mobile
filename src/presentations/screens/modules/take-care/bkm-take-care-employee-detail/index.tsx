import React from 'react'
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { Header, Text } from '@app/presentations/_shared-components'
import { useRoute } from '@react-navigation/native'
import { BkmEmployee2 } from '@models/eplant/BKMTakeCare'
import moment from 'moment'
import BKMTakeCareEmployeeTableHeader from './table-header'
import { Table, Row, TableWrapper, Cell, Col } from 'react-native-table-component'
import numberWithDot from '@app/presentations/utils/numberWithDot'
const { width } = Dimensions.get('window')
const widthArr = [width / 2.19, width / 2.19]

const BKMEmployeeDetail = () => {
  const route: any = useRoute()
  const item: BkmEmployee2 = route?.params?.item
  const bkmData = route.params?.bkmData
  const organizationName = bkmData?.organization?.label || ''
  const divisionName = bkmData?.division?.name || ''
  const subAct = route?.params?.subAct
  const foremanName = bkmData?.foreman?.name || ''
  const bkmDate = bkmData?.date || ''

  const data = [
    ['Tanggal BKM', moment(bkmDate).format('DD MMMM YYYY')],
    ['Organisasi', organizationName],
    ['Divisi', divisionName],
    ['Sub Aktivitas', subAct?.name || '-'],
    ['Blok', item?.block?.code || '-'],
    ['Mandor', foremanName],
    ['Peran', item?.role?.name || item?.user?.role?.name || '-'],
    ['Supervisi', item?.supervision?.name || '-'],
    ['Status Kerja', item?.workStatus?.name || '-'],
    ['Jenis Kerja', item?.typeEmployee],
    ['Tahun Tanam', item?.block?.plantingYear?.join(', ') || '-'],
    ['Luas Blok', item?.block?.blockArea + ' Ha'],
    ['Hasil Kerja (Ha)', item?.workResultHa],
    ['Jumlah HK', item?.hkAmount],
  ]

  if (item?.typeEmployee?.includes("Borongan")) {
    data.push(['Upah Karyawan', `Rp ${numberWithDot(parseFloat(item?.wages || '0'))}`])
  }

  const tableData = item.bkmMaterials?.map(e => [e?.material?.name || e?.name, e.qty])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Karyawan" />
      <ScrollView style={styles.scroll}>
        <Text type="semibold" style={{ marginBottom: 15 }} size={14}>
          {item?.user?.nip} - {item?.user?.name}
        </Text>
        {data.map(([label, value]) => (
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text size={13} color="black" style={{ flex: 0.5 }}>
              {label}
            </Text>
            <Text size={13} color="black" style={{ flex: 0.5 }}>
              : {value || '-'}
            </Text>
          </View>
        ))}
        <Text type="semibold" style={{ marginVertical: 8 }}>
          Material
        </Text>
        <ScrollView horizontal>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <BKMTakeCareEmployeeTableHeader />
            {tableData.map((d, idx) => (
              <Row key={idx} data={d} widthArr={widthArr} textStyle={styles.tableRow} />
            ))}
          </Table>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BKMEmployeeDetail

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    padding: 16,
  },
  tableRow: {
    padding: 8,
    alignSelf: 'center',
  },
})
