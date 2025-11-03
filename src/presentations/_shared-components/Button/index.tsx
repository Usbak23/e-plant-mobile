import React, {ReactNode} from 'react'
import {TouchableOpacity, StyleProp, ViewStyle} from 'react-native'
import {theme} from '@utils/styles'
import styles from './styles'

interface Props {
  mode?: 'outlined' | 'default' | 'link'
  onPress?: ((event: any) => void) | undefined
  children?: ReactNode | null
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  testId?: string
}

const CustomButton: React.FC<Props> = props => {
  return (
    <TouchableOpacity
      testID={props.testId}
      activeOpacity={0.5}
      onPress={props.onPress}
      disabled={props.disabled}
      style={[
        styles.button,
        {
          backgroundColor: props.disabled ? theme.colors.disabled : theme.colors.primary,
        },
        props?.mode && styles[props.mode],
        props.style,
      ]}>
      {props.children}
    </TouchableOpacity>
  )
}

export default CustomButton
