import React, {ReactNode} from 'react'
import {StyleSheet, View} from 'react-native'
import {MenuOption, MenuOptions} from 'react-native-popup-menu'
import {PopupLabel, Text} from '..'

interface ISortPopupProps {
  options: {
    value: string
    label: string
  }[]
  onSelect: (value: string) => void
  selectedValue: string
  title?: string
}

const SortPopup: React.FC<ISortPopupProps> = props => {
  return (
    <MenuOptions>
      <View style={{alignItems: 'center'}}>
        <Text size={12} type="semibold">
          {props?.title || 'Urutkan'}
        </Text>
      </View>
      {props.options.map((item, index) => (
        <MenuOption key={index} value={item.value} onSelect={() => props.onSelect(item.value)}>
          <PopupLabel text={item.label} isSelected={props.selectedValue == item.value} />
        </MenuOption>
      ))}
    </MenuOptions>
  )
}

export default SortPopup

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    padding: 8,
  },
})
