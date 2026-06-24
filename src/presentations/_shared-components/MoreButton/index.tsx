import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import {Text} from '..'
import Entypo from 'react-native-vector-icons/Entypo'
import {theme} from '@app/presentations/utils/styles'

interface Props {
  label: string
  onTap: () => void
  hideIcon?: boolean
  iconName?: string
  customIcon?: React.ReactNode
  disabled?: boolean
}
const MoreButton: React.FC<Props> = props => {
  return (
    <TouchableOpacity
      testID="onTapButton"
      onPress={props.onTap}
      disabled={props.disabled}
      style={{
        paddingVertical: 16,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: props.disabled ? 0.5 : 1,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        {props.customIcon && <View style={{marginRight: 12}}>{props.customIcon}</View>}
        {!props.customIcon && props.iconName && (
          <Entypo
            size={20}
            color={props.disabled ? theme.colors.label : theme.colors.accent}
            name={props.iconName as any}
            style={{marginRight: 12}}
          />
        )}
        <Text type="semibold" style={{flex: 1}}>
          {props.label}
        </Text>
      </View>
      {props.hideIcon ? null : <Entypo size={20} color={theme.colors.tabIconBlack} name="chevron-right" />}
    </TouchableOpacity>
  )
}

export default MoreButton
