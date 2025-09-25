import {IReceptionHistoryRow} from '@app/models/eplant/RawMaterial'
import Routes from '@app/presentations/navigation/Routes'
import {dateFormatter} from '@app/presentations/utils/dateFormatter'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {useNavigation} from '@react-navigation/core'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface IRawMaterialReceptionCardProps {
  isAllowedToOrganizeReceivement?: boolean
  reception: IReceptionHistoryRow
  onPopupEdit?: () => void
  onPopupDelete?: () => void
  onReceiveTap?: () => void
}

const RawMaterialReceptionCard: React.FC<IRawMaterialReceptionCardProps> = props => {
  const navigation: any = useNavigation()
  const onEdit = () => props.onPopupEdit && props.onPopupEdit()
  const onDelete = () => props.onPopupDelete && props.onPopupDelete()
  const onReceive = () => props.onReceiveTap && props.onReceiveTap()

  const ReceiveButton = () => (
    <TouchableOpacity onPress={onReceive}>
      <View style={styles.receiveButton}>
        <Text color="#F0B10D" type="semibold" size={11}>
          Terima Sekarang
        </Text>
      </View>
    </TouchableOpacity>
  )
  return (
    <View style={styles.card}>
      <TouchableOpacity>
        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
          {props.reception?.dateAccepted ? (
            <View>
              <Text type="semibold">
                {props.reception?.dateAccepted ? dateFormatter(props.reception?.dateAccepted) : '-'}
              </Text>
            </View>
          ) : (
            props.isAllowedToOrganizeReceivement && <ReceiveButton />
          )}

          {props.reception?.dateAccepted && props.isAllowedToOrganizeReceivement && (
            <View style={{alignItems: 'flex-end', alignContent: 'flex-end', padding: 10}}>
              <TouchableOpacity onPress={onEdit}>
                <Icon name="create" size={15} color={theme.colors.textThinBlack} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', marginTop: 15}}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Penerima
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {props.reception?.consignee?.name || '-'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Jumlah Diterima
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {props.reception?.qtyAccepted || '-'}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 15}}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            No. Purchase Order
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {props.reception?.purchaseOrder || '-'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Jumlah Pembelian
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {props.reception?.qty || '-'}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 15}}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Tanggal Pembelian
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {props.reception?.date ? dateFormatter(props.reception?.date) : '-'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default RawMaterialReceptionCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  receiveButton: {
    backgroundColor: 'rgba(240, 177, 13, 0.15);',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    alignContent: 'center',
  },
})
