import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import IconImage from '@assets/icons/ic_picture.svg'
import IconDocument from '@assets/icons/ic_document.svg'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {Text} from '@app/presentations/_shared-components'
import {IFieldReportAttachmentDetail} from '@app/models/eplant/FieldReport'

interface IProps {
  onGo?: Function
  onCopy?: Function
  link?: string
}

const VideoCard = ({link, onCopy = () => {}, onGo = () => {}}: IProps) => {
  const MenuButton = () => (
    <Menu>
      <MenuTrigger>
        <View style={{padding: 10}}>
          <Entypo name="dots-three-horizontal" size={15} color={theme.colors.textThinBlack} />
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            padding: 8,
            borderRadius: 10,
          },
        }}>
        <MenuOption
          onSelect={() => {
            onGo()
          }}>
          <PopupEditDelete iconName="remove-red-eye" text="Buka Link" />
        </MenuOption>
        <MenuOption onSelect={() => onCopy()}>
          <PopupEditDelete iconName="content-copy" text="Salin Link" />
        </MenuOption>
      </MenuOptions>
    </Menu>
  )
  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: theme.colors.yellowDark,
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
      }}>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          onPress={() => {
            onGo()
          }}
          style={[{padding: 8, borderRadius: 8, backgroundColor: 'rgba(233, 86, 117, 0.15)'}]}>
          <MaterialIcon name="ondemand-video" size={24} color={'#E95675'} />
        </TouchableOpacity>
        <MenuButton />
      </View>

      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Text style={{marginTop: 16}} type="semibold">
            {link || '-'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default VideoCard
