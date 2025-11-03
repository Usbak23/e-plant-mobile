import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Text} from '..'

interface IPopupLabelProps {
  text: string
  isSelected: boolean
}

const PopupLabel: React.FC<IPopupLabelProps> = props => {
  return (
    <View style={styles.root}>
      <View style={props.isSelected ? styles.selectedContainer : styles.container}>
        <Text style={styles.text} color={props.isSelected ? '#F0B10D' : theme.colors.textThinBlack} type="semibold">
          {props.text}
        </Text>
      </View>
    </View>
  )
}

export default PopupLabel

const styles = StyleSheet.create({
  root: {
    borderRadius: 8,
  },
  container: {
    backgroundColor: 'white',
  },
  selectedContainer: {
    backgroundColor: 'rgba(240, 177, 13, 0.15)',
  },
  text: {
    padding: 8,
  },
})
