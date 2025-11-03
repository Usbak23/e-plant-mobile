import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'

import {Text} from '@components/index'

import {theme} from '@app/presentations/utils/styles'
import Feather from 'react-native-vector-icons/Feather'

export default function LineCard(props: any) {
  return (
    <TouchableOpacity
      key={props.item.numbersOfLines}
      disabled={!props?.onEdit}
      style={styles.cardLine}
      onPress={() => props?.onEdit && props.onEdit(props.item)}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text size={13} type="semibold">
          Baris {props.item.numbersOfLines}
        </Text>
        {props?.deleteLine && (
          <TouchableOpacity onPress={() => props.deleteLine(props.item)}>
            <Feather name="trash" size={18} />
          </TouchableOpacity>
        )}
      </View>
      <View style={{flexDirection: 'row', marginTop: 6}}>
        <View style={{flex: 1}}>
          <Text size={11} color={theme.colors.label}>
            Total Pokok
          </Text>
          <Text size={13}>{props.item.totalTree}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={11} color={theme.colors.label}>
            Total Tandan
          </Text>
          <Text size={13}>{props.item.totalBunches}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  cardLine: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
})
