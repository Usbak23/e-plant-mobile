import React, {ReactNode, memo} from 'react'
import {Text, StyleSheet, Platform} from 'react-native'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import {theme} from '@styles'
import {IProps} from '@app/presentations/types'

interface IPText extends IProps {
  type?: 'default' | 'thin' | 'regular' | 'semibold' | 'bold'
  color?: string
  size?: number
  children: string | ReactNode | null
  maxLines?: number
  onPress?: () => void
  onTextLayout?: any
}

const Typography: React.FC<IPText> = props => {
  const TextStyles = styles[props.type || 'default']
  const colors = {
    color: props.color || theme.colors.primary,
  }
  const sizeText = {
    fontSize: props.size ? fs(props.size) : fs(14),
  }
  return (
    <Text
      onTextLayout={props.onTextLayout}
      onPress={props.onPress}
      numberOfLines={props.maxLines}
      style={[TextStyles, colors, sizeText, props.style]}>
      {props.children}
    </Text>
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: fs(13),
    fontFamily: 'OpenSans-Regular',
  },
  thin: {
    fontSize: fs(14),
    fontFamily: 'OpenSans-Light',
    fontWeight: Platform.select({ios: '400'}),
  },
  regular: {
    fontSize: fs(14),
    fontFamily: 'OpenSans-Regular',
  },
  semibold: {
    fontSize: fs(14),
    fontFamily: 'OpenSans-SemiBold',
  },
  bold: {
    fontSize: fs(14),
    fontFamily: 'OpenSans-Bold',
  },
})

export default memo(Typography)
