import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import IconImage from '@assets/icons/ic_picture.svg'
import IconDocument from '@assets/icons/ic_document.svg'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {Text} from '@app/presentations/_shared-components'
import {IFieldReportAttachmentDetail} from '@app/models/eplant/FieldReport'
import {ICurrentUser} from '@app/models/eplant/User'

interface IProps {
  onPreview?: Function
  onDelete?: Function
  onDownload?: Function
  file?: IFieldReportAttachmentDetail
  isOwner?: boolean
  isAllowedToOrganize?: boolean
}

const AttachmentCard = ({
  onPreview = () => {},
  onDelete = () => {},
  onDownload = () => {},
  file,
  isOwner,
  isAllowedToOrganize = false,
}: IProps) => {
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
        {file?.mime?.includes('image') && (
          <MenuOption
            onSelect={() => {
              onPreview()
            }}>
            <PopupEditDelete iconName="remove-red-eye" text="Lihat Lampiran" />
          </MenuOption>
        )}

        {isOwner && isAllowedToOrganize && (
          <MenuOption onSelect={() => onDelete()}>
            <PopupEditDelete iconName="delete" text="Hapus Lampiran" />
          </MenuOption>
        )}

        <MenuOption onSelect={() => onDownload()}>
          <PopupEditDelete iconName="file-download" text="Unduh Lampiran" />
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
            onPreview()
          }}
          style={[
            file?.mime?.includes('image')
              ? {backgroundColor: theme.colors.lightPurple}
              : {backgroundColor: theme.colors.yellowSemiTransparent},
            {padding: 8, borderRadius: 8},
          ]}>
          {file?.mime?.includes('image') ? (
            <IconImage width={24} height={24} />
          ) : (
            <IconDocument width={24} height={24} />
          )}
        </TouchableOpacity>
        <MenuButton />
      </View>

      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Text style={{marginTop: 16}} type="semibold">
            {file?.name || '-'}
          </Text>
        </View>

        <Text style={{marginStart: 8}}>
          {(file?.size || 0) / 1000000 < 1000000
            ? ((file?.size || 0) / 1000).toFixed(2) + 'KB'
            : ((file?.size || 0) / 1000000).toFixed(2) + 'MB'}
        </Text>
      </View>
    </View>
  )
}

export default AttachmentCard
