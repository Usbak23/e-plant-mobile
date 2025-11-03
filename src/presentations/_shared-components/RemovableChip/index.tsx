import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {Text} from '..'

interface IRemovableChipProps {
  text: string
  onRemoveTap?: () => void
}

const RemovableChip: React.FC<IRemovableChipProps> = props => {
  return (
    <View style={styles.root}>
      <Text color={theme.colors.black}>{props.text}</Text>
      <TouchableOpacity
        testID={`removeChip-${props.text}`}
        onPress={() => {
          props.onRemoveTap && props.onRemoveTap()
        }}>
        <Icon style={{marginStart: 8}} name={'close'} size={22} color={theme.colors.black} />
      </TouchableOpacity>
    </View>
  )
}

export default RemovableChip

const styles = StyleSheet.create({
  root: {
    margin: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.black,
  },
})
