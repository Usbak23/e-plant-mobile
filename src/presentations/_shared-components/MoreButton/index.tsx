import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import {Text} from '..'
import Entypo from 'react-native-vector-icons/Entypo'
import {theme} from '@app/presentations/utils/styles'

interface Props {
  label: string
  onTap: () => void
  hideIcon?: boolean
}
const MoreButton: React.FC<Props> = props => {
  return (
    <TouchableOpacity
      testID="onTapButton"
      onPress={props.onTap}
      style={{paddingVertical: 16, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text type="semibold" style={{marginEnd: 8}}>
        {props.label}
      </Text>
      {props.hideIcon ? null : <Entypo size={20} color={theme.colors.tabIconBlack} name="chevron-right" />}
    </TouchableOpacity>
  )
}

export default MoreButton
