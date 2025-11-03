import { theme } from '@app/presentations/utils/styles'
import { Header, Text } from '@app/presentations/_shared-components'
import { useRoute } from '@react-navigation/native'
import moment from 'moment'
import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

const TonnagePKSDetail = () => {
  const route: any = useRoute()
  const item = route?.params?.item

  const constructNettoFirst = () => {
    const temp = parseFloat(item.grossWeight) - parseFloat(item.tareWeight)
    return isNaN(temp) || temp == undefined || temp < 0 ? '-' : temp.toFixed(2).toString()
  }

  const constructNettoSecond = () => {
    const netto1 = constructNettoFirst()
    const toSubstract = (parseFloat(netto1) * item.refraksi) / 100
    const refraction = parseFloat(netto1) - toSubstract
    return isNaN(refraction) || refraction == undefined || refraction < 0 ? '-' : refraction.toFixed(2).toString()
  }

  const informasiUmum = [
    {
      label: 'No. Nota (PO/DO)',
      value: item?.spb?.po?.poNumber || '',
    },
    {
      label: 'Tanggal',
      value: moment(item?.date).format('DD MMMM YYYY'),
    },
    {
      label: 'Supir',
      value: `${item?.spb?.po?.driver || ''}`,
    },
    {
      label: 'Kendaraan',
      value: `${item?.item?.name || ''} - ${item?.item?.serialNumber || ''}`,
    },
    {
      label: 'Status',
      value: item?.item?.vehicleOwnership || '-',
    },
    {
      label: 'Berat Gross (Kg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.grossWeight + ' Kg',
    },
    {
      label: 'Berat Tare (Kg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.tareWeight + ' Kg',
    },
    {
      label: 'Netto 1 (Kg)',
      value: item?.decision == 'Ditolak' ? '-' : constructNettoFirst() + ' Kg',
    },
    {
      label: 'Refraksi (Kg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.refraksiKg != undefined ? `${item?.refraksiKg} Kg` : '-',
    },
    {
      label: 'Refraksi (%)',
      value:
        item?.decision == 'Ditolak'
          ? '-'
          : item?.refraksi != undefined
            ? `${parseFloat(item?.refraksi).toFixed(2)}%`
            : '-',
    },
    {
      label: 'Netto 2 (Kg)',
      value: item?.decision == 'Ditolak' ? '-' : constructNettoSecond() + ' Kg',
    },
    {
      label: 'Janjang',
      value: item?.janjang || '-'
    },
    {
      label: 'BJR',
      value: item?.bjr || '-'
    },

    {
      label: 'Keputusan',
      value: item?.decision,
    },
  ]

  const kualitas = [
    {
      label: 'Tenera (Jjg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.tenera,
    },
    {
      label: 'Dura (Jjg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.dura,
    },
    {
      label: 'Total',
      value: item?.decision == 'Ditolak' ? '-' : item?.total,
    },
  ]

  const tbsRetur = [
    {
      label: 'Mengkal (Jjg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.halfRipe,
    },
    {
      label: 'Mentah (Jjg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.raw,
    },
    {
      label: 'Abnormal (Jjg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.abnormal,
    },
    {
      label: 'Peram (Jjg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.peram,
    },
    {
      label: 'Jangkos (Jjg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.jangkos,
    },
    {
      label: 'Brondolan Busuk (Kg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.rottenLooseFruit,
    },
    {
      label: 'Sampah (Kg)',
      value: item?.decision == 'Ditolak' ? '-' : item?.rubbish,
    },
    {
      label: 'Lewat Matang (Janjang)',
      value: item?.decision == 'Ditolak' ? '-' : item?.lateRipe,
    },
  ]

  const lainLain = [
    {
      label: 'Tangkai',
      value: item?.decision == 'Ditolak' ? '-' : item?.longStalk || '-',
    },
    {
      label: 'Lain-lain',
      value: item?.decision == 'Ditolak' ? '-' : item?.etc || '-',
    },
    {
      label: 'Buah Dipulangkan',
      value: item?.decision == 'Ditolak' ? '-' : item?.fruitReturned,
    },
  ]
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Tonase PKS" />
      <ScrollView style={styles.scroll}>
        <Text style={{ marginTop: 16, marginBottom: 8 }} type="bold">
          Informasi Umum
        </Text>

        {informasiUmum.map((item: { label: string; value: string }, index: number) => (
          <LabelValue label={item.label} value={item.value} key={index} />
        ))}

        <Text style={{ marginTop: 16, marginBottom: 8 }} type="bold">
          Kualitas
        </Text>
        {kualitas.map((item: { label: string; value: string }, index: number) => (
          <LabelValue label={item.label} value={item.value} key={index} />
        ))}

        <Text style={{ marginTop: 16, marginBottom: 8 }} type="bold">
          TBS Retur
        </Text>
        {tbsRetur.map((item: { label: string; value: string }, index: number) => (
          <LabelValue label={item.label} value={item.value} key={index} />
        ))}

        <Text style={{ marginTop: 16, marginBottom: 8 }} type="bold">
          Lain-lain
        </Text>
        {lainLain.map((item: { label: string; value: string }, index: number) => (
          <LabelValue label={item.label} value={item.value} key={index} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const LabelValue = (item: { label: string; value: string }) => (
  <View style={{ flexDirection: 'row', flex: 1 }}>
    <View style={{ flex: 1 }}>
      <Text style={{ paddingVertical: 2 }}>{item.label}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text type="semibold">: {item.value}</Text>
    </View>
  </View>
)

export default TonnagePKSDetail

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 56,
  },
})
