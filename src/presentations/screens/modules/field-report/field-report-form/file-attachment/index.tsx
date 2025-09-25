import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconFile from '@assets/icons/ic_file.svg'

interface IProps {
  onDelete?: Function
  onTouchFile?: Function
  title?: string
  hideDelete?: boolean
}

const FieldAttachment = ({onDelete = () => {}, onTouchFile = () => {}, title, hideDelete}: IProps) => {
  return (
    <View style={{flexDirection: 'row', marginVertical: 8}}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <IconFile width={32} height={32} />
        <TouchableOpacity onPress={() => onTouchFile()} style={{flex: 1}}>
          <Text maxLines={1} color={theme.colors.yellowDark} type="semibold">
            {title || '-'}
          </Text>
        </TouchableOpacity>
      </View>
      {hideDelete ? null : (
        <TouchableOpacity onPress={() => onDelete()} style={{alignSelf: 'flex-end'}}>
          <Icon name="close" size={24} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default FieldAttachment
