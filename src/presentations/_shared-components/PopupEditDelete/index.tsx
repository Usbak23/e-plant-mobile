import {theme} from '@app/presentations/utils/styles'
import React, {useState} from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Text} from '..'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface IPopupEditDelete {
  //   onTap: Function
  text: string
  iconName?: string
  bgIconColor?: string
}

const PopupEditDelete: React.FC<IPopupEditDelete> = props => {
  const [isOnTouch, setOnTouch] = useState<boolean>(false)

  const renderIcon = () => {
    if (props?.bgIconColor) {
      return (
        <View style={{backgroundColor: props.bgIconColor, borderRadius: 16, padding: 4}}>
          <Icon name={props.iconName} size={17} color={theme.colors.white} />
        </View>
      )
    }
    return <Icon name={props.iconName} size={17} color={theme.colors.black} />
  }

  return (
    <View style={styles.root} onTouchStart={() => setOnTouch(true)} onTouchEnd={() => setOnTouch(false)}>
      <View style={isOnTouch ? styles.selectedContainer : styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.iconName && renderIcon()}
          <Text style={styles.text} color={isOnTouch ? '#F0B10D' : theme.colors.textThinBlack} type="semibold">
            {props.text}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PopupEditDelete

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
