import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import Text from '@components/Text'
import {theme} from '@app/presentations/utils/styles'
import {IRKHHarvestAllRowData} from '@app/models/eplant/RKHHarvest'

interface Props {
  item?: IRKHHarvestAllRowData
  onTap?: () => void
}
export default function RKHHarvestCard({item, onTap}: Props) {
  const onTapped = () => {
    onTap && onTap()
  }

  return (
    <TouchableOpacity activeOpacity={0.5} style={[styles.card]} onPress={onTapped}>
      <View style={styles.header}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.accent} type="semibold">
            {item?.subActivity || 'Panen'}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Blok
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.akp?.block?.code || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Tonase
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.kilogram != undefined && item?.kilogram != null ? `${item.kilogram.toFixed(2)} Kg` : '-'}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Tahun Tanam
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.akp?.block?.plantingYear && Array.isArray(item?.akp?.block?.plantingYear)
              ? item.akp?.block.plantingYear.join(',')
              : '-'}
          </Text>
        </View>
        {/* <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Mandor
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.akp?.block?.harvestForeman
              ? `${item.akp?.block.harvestForeman.name || ''} - ${item.akp?.block.harvestForeman.nip || ''} - ${
                  item.akp?.block.harvestForeman.role?.name || ''
                }`
              : '-'}
          </Text>
        </View> */}
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Luas Ha Rencana
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.totalHectares != undefined ? item?.totalHectares : '-'}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Luas Ha Realisasi
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {/* {item?.actualHectareArea || '-'} */}
            {item?.realizationHectareArea || 0}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Total HK Rencana
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {/* {item?.kilogramPerHk != undefined ? item?.kilogramPerHk : '-'} */}
            {item?.numberOfEmployees || 0}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Total HK Realisasi
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.totalHkRealization || '-'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 22,
    marginVertical: 7.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  menu: {padding: 13, margin: -13},
  wrapInfo: {flexDirection: 'row', marginTop: 15},
  wrapLabelValue: {flex: 1},
  receiveButton: {
    backgroundColor: 'rgba(240, 177, 13, 0.15);',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    alignContent: 'center',
  },
})
