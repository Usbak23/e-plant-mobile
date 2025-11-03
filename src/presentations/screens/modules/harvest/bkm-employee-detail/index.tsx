import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { Header, Text } from '@app/presentations/_shared-components'
import { useRoute } from '@react-navigation/native'
import { BkmEmployee2 } from '@models/eplant/BKM'
import moment from 'moment'

const BKMEmployeeDetail = () => {
  const route: any = useRoute()
  const item: BkmEmployee2 = route?.params?.item
  const bkmData = route.params?.bkmData
  const organizationName = bkmData?.organization?.label || ''
  const divisionName = bkmData?.division?.name || ''
  const foremanName = `${bkmData?.foreman?.name || ''} - ${bkmData?.foreman?.nip || ''} - ${bkmData?.foreman?.role?.name || ''
    }`
  const bkmDate = bkmData?.date || ''

  const data = [
    ['Tanggal BKM', moment(bkmDate).format('DD MMMM YYYY')],
    ['Organisasi', organizationName],
    ['Divisi', divisionName],
    ['Sub Aktivitas', bkmData?.subActivity?.label || '-'],
    ['Blok', item?.block?.code || '-'],
    ['Tahun Tanam', item?.plantingYear || '-'],
    ['Mandor', foremanName],
    ['Peran', item?.role?.name || item?.user?.role?.name || '-'],
    ['Supervisi', item?.supervision?.name || '-'],
    //@ts-ignore
    ['Hari Kerja', item?.workDay || item?.workday || '-'],
    ['Status Kerja', item?.workStatus?.name || '-'],
    ['Tahun Tanam', item?.block?.plantingYear?.join(', ') || '-'],
    ['Luas Blok', item?.block?.blockArea + ' Ha'],
    ['Hasil Kerja (Ha)', item?.workResultHa],
    ['Janjang (Kg)', item?.workResultKg],
    ['Jumlah HK', item?.hkAmount],
  ]

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Karyawan" />
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
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
})
