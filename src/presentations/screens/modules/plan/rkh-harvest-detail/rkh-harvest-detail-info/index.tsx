import {IRKHHarvestAllRowData} from '@app/models/eplant/RKHHarvest'
import {theme} from '@app/presentations/utils/styles'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import Text from '@app/presentations/_shared-components/Text'
import moment from 'moment'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'

interface Props {
  item: IRKHHarvestAllRowData
}
const RKHHarvestDetailInfo: React.FC<Props> = props => {
  const {item} = props

  const INFO = [
    ['Organisasi', item?.akp?.block?.division?.organization?.name],
    ['Divisi', item?.akp?.block?.division?.name],
    ['Blok', item?.akp?.block?.code],
    ['Luas Blok', item?.akp?.block?.blockArea],
    ['Tahun Tanam', item?.akp?.block?.plantingYear ? item.akp?.block.plantingYear.join(',') : '-'],
    ['Tanggal Panen', item?.akp?.harvestDate ? moment(item.akp.harvestDate).format('D MMMM YYYY') : '-'],
    ['Kapel Panen', item?.harvestChapel],
    [
      'Mandor Panen',
      item?.akp?.block?.harvestForeman
        ? `${props.item.akp?.block.harvestForeman.name || ''} - ${props.item.akp?.block.harvestForeman.nip || ''} - ${
            props.item.akp?.block.harvestForeman.role?.name || ''
          }`
        : '-',
    ],
    ['Kilogram', item.kilogram],
    ['Total Janjang', item.ripeFruit],
    ['Total HK Rencana', item.totalPlanHk],
    ['Total HK Realisasi', item.totalActualHk],
    // ['Rencana Biaya', item.costPlan != undefined ? `Rp. ${item.costPlan}` : '-'],
    // ['Realisasi Biaya', item.actualCost ? `Rp. ${item.actualCost}` : '-'],
  ]
  return (
    <View style={styles.root}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <Text type="bold" color={theme.colors.accent} size={14}>
          Panen
        </Text>
      </View>

      <View style={styles.container}>
        {INFO.map(([label, value]) => (
          <LabeValue label={label} value={value} />
        ))}
      </View>
    </View>
  )
}

export default RKHHarvestDetailInfo

const LabeValue = ({label, value}: any) => (
  <View style={{flexDirection: 'row', marginBottom: 5}}>
    <Text color={theme.colors.label} size={12} style={{flex: 0.5}}>
      {label}
    </Text>
    <Text color={theme.colors.black} size={12} type="semibold" style={{flex: 0.5}}>
      : {value || '-'}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  root: {
    margin: 16,
    padding: 18,
    borderRadius: 10,
    // backgroundColor: '#F4F4F4',
  },
  container: {
    marginTop: 8,
  },
  receiveButton: {
    backgroundColor: 'rgba(240, 177, 13, 0.15);',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    alignContent: 'center',
  },
})
