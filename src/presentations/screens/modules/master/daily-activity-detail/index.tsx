import {IDailyActivity} from '@app/models/eplant/IDailyActivity'
import {IItemRow} from '@app/models/eplant/Item'
import {theme} from '@app/presentations/utils/styles'
import {Header, Text} from '@app/presentations/_shared-components'
import {useRoute} from '@react-navigation/native'
import moment from 'moment'
import React from 'react'
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native'

const DailyActivityDetail = () => {
  const route: any = useRoute()
  const item: IItemRow | undefined = route.params?.item
  const dailyActivity: IDailyActivity | undefined = route.params?.dailyActivity

  const LABELS = [
    {
      label: 'Item Kategori',
      value: item?.itemMaster?.categoryItem?.name,
    },
    {
      label: 'Master Item',
      value: item?.itemMaster?.name,
    },
    {
      label: 'Organisasi',
      value: item?.organization?.name,
    },
    {
      label: 'Divisi',
      value: dailyActivity?.block?.division?.name || '-',
    },
    {
      label: 'Blok',
      value: dailyActivity?.block?.code || '-',
    },
    {
      label: 'Model',
      value: item?.model,
    },
    {
      label: 'Tahun Pembelian',
      value: item?.yearOfPurchase,
    },
    {
      label: 'Penanggung Jawab',
      value: item?.personResponsible?.name + ' - ' + item?.personResponsible?.nip,
    },
    {
      label: 'Supir',
      value: dailyActivity?.driver || '',
    },
    {
      label: 'Tanggal',
      value: moment(dailyActivity?.date).format('DD MMMM YYYY'),
    },
    {
      label: 'Waktu',
      value: dailyActivity?.time,
    },
    {
      label: 'Kode Kegiatan',
      value: dailyActivity?.subActivity?.accountNumber,
    },
    {
      label: 'Nama Kegiatan',
      value: dailyActivity?.subActivity?.name,
    },
    {
      label: 'Lokasi',
      value: dailyActivity?.block?.code,
    },
    {
      label: 'Km Awal',
      value: dailyActivity?.kmStart != undefined ? dailyActivity?.kmStart.toString() : '-',
    },
    {
      label: 'Km Akhir',
      value: dailyActivity?.kmEnd != undefined ? dailyActivity?.kmEnd.toString() : '-',
    },
    {
      label: 'Kalkulasi Km',
      value:
        dailyActivity?.kmCalculation != undefined && dailyActivity?.kmCalculation != null
          ? dailyActivity?.kmCalculation.toFixed(2).toString()
          : '-',
    },
    {
      label: 'Basis BBM (km/liter)',
      value: dailyActivity?.bbmBase != undefined ? dailyActivity?.bbmBase.toString() : '-',
    },
    {
      label: 'BBM Diambil (liter)',
      value: dailyActivity?.bbmTaken != undefined ? dailyActivity?.bbmTaken.toString() : '-',
    },
    {
      label: 'Pemakaian BBM (liter)',
      value:
        dailyActivity?.bbmUsed != undefined && dailyActivity?.bbmUsed != '' && dailyActivity?.bbmUsed != null
          ? dailyActivity?.bbmUsed.toFixed(2).toString()
          : '-',
    },
    {
      label: 'Hasil Kerja',
      value:
        dailyActivity?.workResult != undefined
          ? dailyActivity?.workResult.toString() + ' ' + dailyActivity?.uom?.name
          : '-',
    },
    {
      label: 'SAE Oli',
      value: dailyActivity?.oilSae || '-',
    },
    {
      label: 'Liter Oli',
      value: dailyActivity?.oilLiter || '-',
    },
    {
      label: 'Keterangan',
      value: dailyActivity?.description || '-',
    },
    {
      label: 'Pemakai',
      value: dailyActivity?.user?.name || '-',
    },
  ]

  const LabelValue = (item: {label: string; value?: string | number}) => (
    <View style={styles.row}>
      <View style={{flex: 1, flexGrow: 1}}>
        <Text color={theme.colors.grey}>{item?.label || '-'}</Text>
      </View>
      <View style={{flex: 1, marginStart: 8, flexGrow: 2.5}}>
        <Text>: {item?.value != undefined ? item?.value : '-'}</Text>
      </View>
    </View>
  )
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Aktivitas Harian" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <Text style={{marginBottom: 16}} type="semibold" color={theme.colors.yellowDark}>
          {item?.name || '-'} - {item?.serialNumber || '-'}
        </Text>
        {LABELS.map((l, i) => (
          <LabelValue key={i} label={l.label} value={l.value} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default DailyActivityDetail

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 4,
  },
})
