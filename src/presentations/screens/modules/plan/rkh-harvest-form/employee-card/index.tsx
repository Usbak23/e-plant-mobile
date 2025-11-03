import numberWithDot from '@app/presentations/utils/numberWithDot'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import IconDelete from 'react-native-vector-icons/MaterialIcons'

interface IRKHHarvestEmployeeCardProps {
  item?: {
    roleId: string
    qty: number
    cost: number
    name: string
    //353
    roleCategory: string[]
    typeEmployeeName: string
  }
  onRemove: () => void
}

const RKHHarvestEmployeeCard: React.FC<IRKHHarvestEmployeeCardProps> = props => {
  const calculateTotalPrice = () => {
    if (props.item?.qty != undefined && props.item?.cost != undefined) {
      const totalPrice = props.item.qty * props.item.cost
      return `Rp.${numberWithDot(totalPrice)}`
    }
    return 'Rp.-'
  }

  return (
    <View style={styles.card}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Text>{props.item?.name || '-'}</Text>
        </View>
        <TouchableOpacity onPress={props.onRemove}>
          <View style={styles.deleteBtn}>
            <IconDelete name="delete-outline" size={22} color="#24272B" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.horizontalContainer}>
        <View style={{flex: 1, marginRight: 8}}>
          <Text size={11} type="thin">
            Jenis Karyawan
          </Text>
          <Text>{props?.item?.typeEmployeeName || '-'}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={11} type="thin">
            Kuantitas
          </Text>
          <Text>{numberWithDot(props.item?.qty || 0) || '-'}</Text>
        </View>
      </View>

      <View style={styles.horizontalContainer}>
        <View style={{flex: 1}}>
          <Text size={11} type="thin">
            Biaya Per HK
          </Text>
          <Text>{props.item?.cost ? `Rp.${numberWithDot(props.item?.cost)}` : 'Rp.-'}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={11} type="thin">
            Total Biaya
          </Text>
          <Text>{calculateTotalPrice()}</Text>
        </View>
      </View>
    </View>
  )
}

export default RKHHarvestEmployeeCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
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
  horizontalContainer: {
    marginTop: 8,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  deleteBtn: {
    alignItems: 'center',
    borderRadius: 5,
    padding: 4,
    backgroundColor: '#F4F4F4',
  },
})
