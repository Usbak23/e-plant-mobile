import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import Text from '../Text'
import Entypo from 'react-native-vector-icons/Entypo'

interface IProps {
  arrayOfText: string[]
  breakpoint?: number
  textSize?: number
  textColor?: string
  textType?: 'regular' | 'bold' | 'semibold'
  onMorePress?: Function
}

const ArrayTextWithMoreButton = ({
  arrayOfText = [],
  breakpoint = 2,
  textSize = 14,
  textColor = theme.colors.textThinBlack,
  textType = 'regular',
  onMorePress = () => {},
}: IProps) => {
  const t = arrayOfText.length > breakpoint ? arrayOfText.slice(0, breakpoint).join(', ') : arrayOfText.join(', ')
  return (
    <View style={styles.container}>
      <Text size={textSize} color={textColor} type={textType}>
        {t || '-'}
      </Text>
      <TouchableOpacity testID="onMoreButton" onPress={() => onMorePress()}>
        <View style={styles.miniButton}>
          <Entypo name="dots-three-horizontal" size={12} color={theme.colors.textThinBlack} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ArrayTextWithMoreButton

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // flex: 1,
    // flexDirection: 'row',
  },
  miniButton: {
    alignContent: 'center',
    padding: 5,
    borderRadius: 6,
    backgroundColor: theme.colors.lightGrey,
  },
})
