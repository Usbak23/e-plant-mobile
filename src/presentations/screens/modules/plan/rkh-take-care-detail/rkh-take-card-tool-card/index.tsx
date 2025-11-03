import React from 'react'
import Text from '@app/presentations/_shared-components/Text'
import {StyleSheet, View} from 'react-native'
import numberWithDot from '@app/presentations/utils/numberWithDot'

interface Props {
  item: {
    _id: string
    cost: number
    qty: number
    name: string
    roleCategory: string
  }
}

const RKHTakeCareToolCard: React.FC<Props> = props => {
  const calculatePrice = () => {
    if (props.item?.qty != undefined && props.item?.cost != undefined) {
      const totalPrice = props.item.cost
      return `Rp.${numberWithDot(totalPrice)}`
    }
    return 'Rp.-'
  }

  const calculateTotalPrice = () => {
    if (props.item?.qty != undefined && props.item?.cost != undefined) {
      const totalPrice = props.item.qty * props.item.cost
      return `Rp.${numberWithDot(totalPrice)}`
    }
    return 'Rp.-'
  }
  return (
    <View style={styles.card}>
      <View style={styles.horizontalContainer}>
        <View style={{flex: 1, marginRight: 8}}>
          <Text size={11} type="thin">
            Alat
          </Text>
          <Text>{props?.item?.name || '-'}</Text>
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
            Biaya / Alat Rencana
          </Text>
          <Text>{props.item?.cost ? `Rp.${numberWithDot(props.item?.cost)}` : 'Rp.-'}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={11} type="thin">
            Biaya / Alat Realisasi
          </Text>
          <Text>{calculatePrice()}</Text>
        </View>
      </View>

      <View style={styles.horizontalContainer}>
        <View style={{flex: 1}}>
          <Text size={11} type="thin">
            Total Biaya Rencana
          </Text>
          <Text>{props.item?.cost ? `Rp.${numberWithDot(props.item?.cost)}` : 'Rp.-'}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={11} type="thin">
            Total Biaya Realisasi
          </Text>
          <Text>{calculateTotalPrice()}</Text>
        </View>
      </View>
    </View>
  )
}

export default RKHTakeCareToolCard

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
})
