import React from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import styles from '@app/presentations/screens/modules/harvest/pma-detail/styles'
import { Header, Text } from '@app/presentations/_shared-components'
import { useRoute } from '@react-navigation/native'

const PMADetail = () => {
  const route: any = useRoute()
  // const pmaParent = route?.params?.pmaParent
  const pmaFilterData = route?.params?.pmaFilterData
  const item = route?.params?.item

  const infos: { label: string; value: string }[] = [
    {
      label: 'Tanggal PMA',
      value: pmaFilterData?.datePMA || '-',
    },
    {
      label: 'Organisasi',
      value: pmaFilterData?.division?.organization?.name || '-',
    },
    {
      label: 'Divisi',
      value: pmaFilterData?.division?.name || '-',
    },
    {
      label: 'Blok',
      value: item?.block?.code || '-',
    },
    {
      label: 'Tahun Tanam',
      value: item?.plantingYear || '-',
    },
    {
      label: 'Mandor',
      value: `${pmaFilterData?.foreman?.name || ''} - ${pmaFilterData?.foreman?.nip || ''} - ${pmaFilterData?.foreman?.role?.name || ''
        }`,
    },
    {
      label: 'Ancak',
      value: item?.ancak,
    },
    {
      label: 'Pokok Diperiksa',
      value: item?.checkedTree || '-'
    }
  ]

  const fruitInfos = [
    {
      label: 'Tidak Dipanen',
      value: item?.notHarvestFruit,
    },
    {
      label: 'Matahari',
      value: item?.sunFruit,
    },
  ]

  const brondolans = [
    {
      label: 'Di Piringan dan Pasar Pikul',
      value: item?.looseOnPlateAndPikul,
    },
    {
      label: 'Di TPH',
      value: item?.looseOnTph,
    },
  ]

  const pokoks = [
    {
      label: 'Sengkleh',
      value: item?.brokenMidrib,
    },
    {
      label: 'Di Piringan',
      value: item?.onPlateMidrib,
    },
  ]

  const persentase = [
    {
      label: 'Buah Tinggal Per-pokok',
      value: item?.remainingFruitTree,
    },
    {
      label: 'Brondolan Per-pokok',
      value: item?.brondolanEachTree,
    },
  ]

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Karyawan" />
      <ScrollView style={styles.scroll}>
        <Text size={16} type="bold" style={{ marginBottom: 16 }}>
          {item?.user?.nip || ''} - {item?.user?.name || ''}
        </Text>
        {infos.map((i: { label: string; value: string }, index: number) => (
          <LabelValue label={i.label} value={i.value} key={index} />
        ))}

        <Text size={15} type="semibold" style={{ marginVertical: 16 }}>
          Buah/Janjang
        </Text>
        {fruitInfos.map((i: { label: string; value: string }, index: number) => (
          <LabelValue label={i.label} value={i.value} key={index} />
        ))}

        <Text size={15} type="semibold" style={{ marginVertical: 16 }}>
          Brondolan Tidak Dikutip (Butir)
        </Text>
        {brondolans.map((i: { label: string; value: string }, index: number) => (
          <LabelValue label={i.label} value={i.value} key={index} />
        ))}

        <Text size={15} type="semibold" style={{ marginVertical: 16 }}>
          Pelepah (Pokok)
        </Text>
        {pokoks.map((i: { label: string; value: string }, index: number) => (
          <LabelValue label={i.label} value={i.value} key={index} />
        ))}

        <Text size={15} type="semibold" style={{ marginVertical: 16 }}>
          Persentase
        </Text>
        {persentase.map((i: { label: string; value: string }, index: number) => (
          <LabelValue label={i.label} value={i.value} key={index} />
        ))}

        <View style={{ marginBottom: 56 }} />
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
      <Text>: {item.value || '-'}</Text>
    </View>
  </View>
)

export default PMADetail
