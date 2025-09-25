import {ENUM_REQUEST_TYPE, IMyRequest} from '@app/models/eplant/Request'
import {theme} from '@app/presentations/utils/styles'
import {
  ArrayTextWithMoreButton,
  RequestTextAccepted,
  RequestTextRejected,
  RequestTextWaiting,
  Text,
} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'

interface IProps {
  request: IMyRequest
  onArrayTextClick?: Function
  onTap?: Function
  onPopupEdit?: Function
  onPopupDelete?: Function
  isAllowedToOrganize?: boolean
}

const MyRequestCard = ({
  request,
  onArrayTextClick = (v: any) => {},
  onTap = () => {},
  onPopupDelete = () => {},
  onPopupEdit = () => {},
  isAllowedToOrganize = false
}: IProps) => {
  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      <MenuOption
        onSelect={() => {
          onPopupEdit && onPopupEdit()
        }}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      <MenuOption
        value={1}
        onSelect={() => {
          onPopupDelete && onPopupDelete()
        }}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )

  const MenuButton = () => (
    <Menu>
      <MenuTrigger>
        <View style={{padding: 10}}>
          <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
        </View>
      </MenuTrigger>
      {cardOptions()}
    </Menu>
  )
  return (
    <TouchableOpacity onPress={() => onTap()} style={styles.card}>
      <View style={styles.containerTitle}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.accent} type="semibold">
            {request?.requestNumber || ''}
          </Text>
        </View>
        {isAllowedToOrganize ? request.status == 'Menunggu Persetujuan' && <MenuButton />: null}
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, marginRight: 4}}>
          <Text color={theme.colors.label} size={11}>
            Permintaan
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {request?.name || '-'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Tanggal
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {request?.date || '-'}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flex: 1, marginRight: 4}}>
          <Text color={theme.colors.label} size={11}>
            Tipe Permintaan
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {request?.type || '-'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          {request?.status == 'Disetujui' && <RequestTextAccepted />}
          {request?.status == 'Ditolak' && <RequestTextRejected />}

          {request?.status == 'Menunggu Persetujuan' && <RequestTextWaiting />}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default MyRequestCard

const styles = StyleSheet.create({
  containerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 7.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
})
