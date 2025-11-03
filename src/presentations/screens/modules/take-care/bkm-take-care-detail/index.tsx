import React, {useState} from 'react'
import {SafeAreaView, ScrollView, View} from 'react-native'
import styles from '@app/presentations/screens/modules/attendance/attendance-detail/styles'
import {Header, Text} from '@app/presentations/_shared-components'
import {useRoute} from '@react-navigation/native'
import moment from 'moment'
import {Table, Row, Rows} from 'react-native-table-component'
import {theme} from '@app/presentations/utils/styles'
import {useOrientation} from '@app/presentations/hooks/userOrientation'
import {BkmEmployee2} from '@app/models/eplant/BKMTakeCare'

const tHeaderDefault = [
  'NIP',
  'Nama',
  'Peran',
  'Supervisi',
  'Status Kerja',
  'Blok',
  'Tahun Tanam',
  'Luas Blok',
  'Hasil Kerja (Ha)',
  'Jumlah HK',
]

const BKMDetail = () => {
  const routes: any = useRoute()
  const bkmData = routes.params?.bkmData

  const organizationName = bkmData?.organization?.label || ''
  const divisionName = bkmData?.division?.name || ''
  const foremanName = bkmData?.foreman?.name || ''
  const bkmDate = bkmData?.date || ''
  const bkmEmployees: BkmEmployee2[] = bkmData?.bkmEmployees || []

  const orientation = useOrientation()

  const [highestLenghtMaterial] = bkmEmployees?.map(e => e.bkmMaterials.length).sort((a, b) => b - a)

  const tHeader = [
    ...tHeaderDefault,
    ...Array(highestLenghtMaterial || 1)
      .fill(0)
      .map((_, i) => ['Material ' + (i + 1), 'Jumlah Material'])
      .flat(),
  ]

  const widthArr = [
    100,
    250,
    150,
    150,
    100,
    110,
    110,
    150,
    150,
    100,
    ...Array(highestLenghtMaterial || 1)
      .fill(0)
      .map((_, i) => [100, 100])
      .flat(),
  ]

  const data = bkmEmployees.map((i: any) => [
    i?.user?.nip || '-',
    i?.user?.name || '-',
    i?.role?.name || '-',
    i?.supervision?.name || '-',
    i?.workStatus?.name || '-',
    i?.block?.code || '-',
    i?.block?.plantingYear?.join(', ') || '-',
    i?.block?.blockArea || '-',
    i?.workResultHa || '-',
    i?.hkAmount || '-',
    ...Array(highestLenghtMaterial || 1)
      .fill(0)
      .map((_, idx) => [
        (i.bkmMaterials[idx] && i.bkmMaterials[idx].name) || i.bkmMaterials[idx]?.material?.name || '-',
        (i.bkmMaterials[idx] && i.bkmMaterials[idx].qty) || '-',
      ])
      .flat(),
  ])

  const TableHeader = () => (
    <>
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'row', flex: orientation === 'LANDSCAPE' ? 0.5 : 1}}>
          <Text type="semibold" style={{flex: 0.5}}>
            Tanggal
          </Text>
          <Text type="semibold" style={{flex: 0.5}}>
            : {moment(bkmDate).format('DD MMMM YYYY')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', flex: orientation === 'LANDSCAPE' ? 0.5 : 1}}>
          <Text type="semibold" style={{flex: 0.5}}>
            Organisasi
          </Text>
          <Text type="semibold" style={{flex: 0.5}}>
            : {organizationName}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'row', flex: orientation === 'LANDSCAPE' ? 0.5 : 1}}>
          <Text type="semibold" style={{flex: 0.5}}>
            Mandor
          </Text>
          <Text type="semibold" style={{flex: 0.5}}>
            : {foremanName}
          </Text>
        </View>
        <View style={{flexDirection: 'row', flex: orientation === 'LANDSCAPE' ? 0.5 : 1}}>
          <Text type="semibold" style={{flex: 0.5}}>
            Divisi
          </Text>
          <Text type="semibold" style={{flex: 0.5}}>
            : {divisionName}
          </Text>
        </View>
      </View>
    </>
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Lihat BKM" />
      <View style={styles.scroll}>
        <TableHeader />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.tableViewContainer}>
            <Table borderStyle={{borderWidth: 1, borderColor: theme.colors.grey}}>
              <Row widthArr={widthArr} data={tHeader} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
            </Table>

            <ScrollView>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {data.map((data, index) => (
                  <Row
                    key={index}
                    data={data}
                    widthArr={widthArr}
                    style={[index % 2 && {backgroundColor: '#F7F6E7'}]}
                    textStyle={styles.tableRow}
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
