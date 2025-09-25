import {IMyRequest} from '@app/models/eplant/Request'
import {theme} from '@app/presentations/utils/styles'
import {
  ArrayTextWithMoreButton,
  DropdownRequestStatus,
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
  onTap?: Function
  onPopupReject?: Function
  onPopupAccept?: Function
  isAllowedToOrganize?: boolean
}

const ListRequestCard = ({onPopupReject = () => {}, onPopupAccept = () => {}, request, onTap = () => {}, isAllowedToOrganize = false}: IProps) => {
  return (
    <TouchableOpacity onPress={() => onTap()} style={styles.card}>
      <View style={styles.containerTitle}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.accent} type="semibold">
            {request?.requestNumber || '-'}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 16}}>
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
        {
          isAllowedToOrganize ? 
          <View style={{flex: 1}}>
          {request?.status === 'Menunggu Persetujuan' && (
            <DropdownRequestStatus onAccept={onPopupAccept} onReject={onPopupReject} />
          )}

          {request?.status === 'Disetujui' && <RequestTextAccepted />}
          {request?.status === 'Ditolak' && <RequestTextRejected />}
        </View>:
        <View style={{flex: 1, marginStart: 4}}>
          <Text color={theme.colors.label} size={11}>
            Status
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {request?.status || '-'}
          </Text>
      </View>
        }

      </View>
    </TouchableOpacity>
  )
}

export default ListRequestCard

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
