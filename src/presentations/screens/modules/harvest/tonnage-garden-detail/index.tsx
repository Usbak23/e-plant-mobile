import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { theme } from '@app/presentations/utils/styles'
import { Header, Text } from '@app/presentations/_shared-components'
import { Table, Row } from 'react-native-table-component'
import { useRoute } from '@react-navigation/native'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { ITonnageGardenBlok } from '@app/models/eplant/TonnageGarden'

const TonnageGardenDetail = () => {
  const route: any = useRoute()
  const dispatch = useDispatch()
  const item = route?.params?.item

  const tonnageGardenDetail = useSelector((state: RootStateType) => state.tonnageGarden?.tonnageGardenDetail)

  const constructTableBlocks = () => {
    const temps: string[][] = []
    if (tonnageGardenDetail?.data?.gardenTonnageBlocks) {
      tonnageGardenDetail?.data?.gardenTonnageBlocks.map((data: ITonnageGardenBlok) => {
        const t = [data.block?.code || '-', data.totalJanjang.toString()]
        temps.push(t)
      })
      return temps
    }
    return [[]]
  }
  const infos: { label: string; value: string }[] = [
    {
      label: 'No. Nota (PO/DO)',
      value: item?.poNumber || '-',
    },
    {
      label: 'Tanggal',
      value: moment(item?.date).format('DD MMMM YYYY'),
    },
    {
      label: 'Supir',
      value: item?.driver || '-',
    },
    {
      label: 'Kendaraan',
      value: `${item?.item?.name || ''} - ${item?.item?.serialNumber || ''}`,
    },
    {
      label: 'Berat Gross',
      value: item?.grossWeight.toString() + ' Kg',
    },
    {
      label: 'Berat Tare',
      value: item?.tareWeight.toString() + ' Kg',
    },
    {
      label: 'Netto',
      value: item?.netto.toString() + ' Kg',
    },
    {
      label: 'Janjang',
      value: item?.janjang || '-'
    },
    {
      label: 'BJR',
      value: item?.bjr ? item?.bjr?.toFixed(2) : '-'
    }
  ]

  useEffect(() => {
    dispatch(actions.getTonnageGardenDetail.request({ loading: true, data: item.id }))
  }, [])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Tonase Kebun" />
      <ScrollView style={styles.scroll}>
        {infos.map((info: { label: string; value: string }, index: number) => (
          <LabelValue label={info.label} value={info.value} key={index} />
        ))}

        <Text style={{ marginVertical: 16 }} type="bold">
          Jumlah Janjang per Blok
        </Text>

        <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.grey }}>
          <Row data={['Blok', 'Jumlah Janjang']} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
        </Table>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          {constructTableBlocks().map((d, i) => (
            <Row key={i} data={d} textStyle={styles.tableRow} />
          ))}
        </Table>
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

export default TonnageGardenDetail

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 56,
  },
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
    padding: 3,
    alignSelf: 'center',
  },
})
