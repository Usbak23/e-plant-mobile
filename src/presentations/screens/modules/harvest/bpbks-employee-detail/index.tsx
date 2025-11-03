import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { Header, Text } from '@app/presentations/_shared-components'
import { useRoute } from '@react-navigation/native'
import moment from 'moment'
import { Doc } from '@app/models/eplant/BPBKS'
import { Table, Row } from 'react-native-table-component'
import { theme } from '@app/presentations/utils/styles'
import BPBKSEmployeeTableHeader from './table-header'
const widthArr = [100, 100, 100, 100, 100, 100, 100, 100, 100]

const BPBKSEmployeeDetail = () => {
  const route: any = useRoute()
  const item: Doc = route?.params?.item
  const tphs: Doc[] = route?.params?.tphs
  const bpbksData = route.params?.bpbksData
  const organizationName = bpbksData?.organization?.label || ''
  const divisionName = bpbksData?.division?.name || ''
  const foremanName =
    (bpbksData?.foreman?.name || '') +
    ' - ' +
    (bpbksData?.foreman?.nip || '') +
    ' - ' +
    (bpbksData?.foreman?.role?.name || '')
  const date = bpbksData?.date || ''

  const data = [
    ['No. Potong', item?.cutNumber],
    ['Nama Pemanen', (item?.harvester?.name || '') + ' - ' + (item?.harvester?.nip || '')],
    ['Tanggal', moment(date).format('DD MMMM YYYY')],
    ['Organisasi', organizationName],
    ['Divisi', divisionName],
    ['Blok', item?.tph?.block?.code || '-'],
    ['Mandor', foremanName],
    ['Status', item?.absent ? 'Absen' : 'Tidak Absen'],
  ]

  const tableData =
    tphs
      ?.filter(e => e?.harvester?.id === item?.harvester?.id)
      ?.map((tph: Doc) => {
        const ripeFruitChecked = `${parseInt(tph?.numberOfLength || '0') +
          parseInt(tph?.ripeFruitChecked || '0') +
          parseInt(tph?.rawFruitChecked || '0') +
          parseInt(tph?.lateRipeChecked || '0') +
          parseInt(tph?.rottenFruitChecked || '0') +
          parseInt(tph?.longHandleChecked || '0')
          }`
        return [
          tph?.tph?.name || '-',
          tph?.plantingYear != undefined ? tph?.plantingYear : '-',
          tph?.numberOfLength != undefined ? tph?.numberOfLength : '-',
          tph?.ripeFruitChecked != undefined ? tph?.ripeFruitChecked : '-',
          tph?.rawFruitChecked != undefined ? tph?.rawFruitChecked : '-',
          tph?.lateRipeChecked != undefined ? tph?.lateRipeChecked : '-',
          tph?.rottenFruitChecked != undefined ? tph?.rottenFruitChecked : '-',
          tph?.longHandleChecked != undefined ? tph?.longHandleChecked : '-',
          tph?.looseChecked != undefined ? tph?.looseChecked : '-',
        ]
      }) || []

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Karyawan" />
      <ScrollView style={styles.scroll}>
        {data.map(([label, value]) => (
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text size={13} color="black" style={{ flex: 0.5 }}>
              {label}
            </Text>
            <Text size={13} color="black" type="semibold" style={{ flex: 0.5 }}>
              : {value || '-'}
            </Text>
          </View>
        ))}
        <Text type="semibold" style={{ marginVertical: 8 }}>
          TPH
        </Text>
        <ScrollView horizontal style={{ paddingBottom: 80 }}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <BPBKSEmployeeTableHeader />
            {tableData.map((d, idx) => (
              <Row key={idx} data={d} widthArr={widthArr} textStyle={styles.tableRow} />
            ))}
          </Table>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BPBKSEmployeeDetail

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    padding: 16,
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
