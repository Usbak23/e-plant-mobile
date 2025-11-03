import React, { useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import styles from '@app/presentations/screens/modules/attendance/attendance-detail/styles'
import { Header, Text } from '@app/presentations/_shared-components'
import { useRoute } from '@react-navigation/native'
import moment from 'moment'
import { Table, Row, Rows } from 'react-native-table-component'
import { theme } from '@app/presentations/utils/styles'
import { useOrientation } from '@app/presentations/hooks/userOrientation'
import { BkmEmployee2 } from '@app/models/eplant/BKM'

const tHeader = [
  'NIP',
  'Nama',
  'Peran',
  'Jenis Karyawan',
  'Supervisi',
  'Status Kerja',
  'Keterangan',
  'Blok',
  'Tahun Tanam',
  'Hari',
  'Luas Blok (Ha)',
  'Hasil Kerja (Ha)',
  'Janjang Kg',
  'Jumlah HK',
  'Periode Panen'
]
const widthArr = [100, 250, 150, 150, 100, 110, 110, 150, 150, 150, 120, 150, 120, 120, 120]

const BKMDetail = () => {
  const routes: any = useRoute()
  const bkmData = routes.params?.bkmData
  const organizationName = bkmData?.organization?.label || ''
  const divisionName = bkmData?.division?.name || ''
  const foremanName = bkmData?.foreman?.name || ''
  const bkmDate = bkmData?.date || ''
  const bkmEmployees: BkmEmployee2[] = bkmData?.bkmEmployees || []

  const orientation = useOrientation()

  const data = bkmEmployees.map((i: any) => [
    i?.user?.nip || '-',
    i?.user?.name || '-',
    i?.role?.name || '-',
    i?.typeEmployee || i?.typeEmployee?.value || '',
    i?.supervision?.name || '-',
    i?.workStatus?.name || '-',
    i?.employee_do_not_take_attendance ? 'Tidak / belum absen' : 'Sudah Absensi',
    i?.block?.code || '-',
    i?.plantingYear || '-',
    i?.workday || i?.workDay || '-',
    i?.block?.blockArea || '-',
    i?.workResultHa || '-',
    i?.workResultKg || '-',
    i?.hkAmount || '-',
    i?.categoryChapel || '-'


  ])

  const TableHeader = () => (
    <View>
      <View style={{ flexDirection: 'row', }}>
        <Text type="semibold" style={{ flex: 0.2 }}>
          Tanggal
        </Text>
        <Text type="semibold" style={{ flex: 0.8 }}>
          : {moment(bkmDate).format('DD MMM YYYY')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', }}>
        <Text type="semibold" style={{ flex: 0.2 }}>
          Mandor
        </Text>
        <Text type="semibold" style={{ flex: 0.8 }}>
          : {foremanName}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text type="semibold" style={{ flex: 0.2 }}>
          Org.
        </Text>
        <Text type="semibold" style={{ flex: 0.8 }}>
          : {organizationName}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text type="semibold" style={{ flex: 0.2 }}>
          Divisi
        </Text>
        <Text type="semibold" style={{ flex: 0.8 }}>
          : {divisionName}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text type="semibold" style={{ flex: 0.2 }}>
          Sub Aktv
        </Text>
        <Text type="semibold" style={{ flex: 0.8 }}>
          : {bkmData?.subActivity?.label || '-'}
        </Text>
      </View>

    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Lihat BKM" />
      <View style={styles.scroll}>
        <TableHeader />
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.tableViewContainer}>
            <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.grey }}>
              <Row widthArr={widthArr} data={tHeader} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
            </Table>

            <ScrollView>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                {data.map((data, index) => (
                  <Row
                    key={index}
                    data={data}
                    widthArr={widthArr}
                    style={[index % 2 && { backgroundColor: '#ffe29e', }]}
                    textStyle={[styles.tableRow, { padding: 8 }]}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default BKMDetail
