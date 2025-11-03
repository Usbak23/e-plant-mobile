import {IPurchasementHistoryRow} from '@app/models/eplant/RawMaterial'
import {dateFormatter} from '@app/presentations/utils/dateFormatter'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'

interface IRawMaterialPurchasementCardProps {
  isAllowedToOrganizePurchasement?: boolean
  purchasement: IPurchasementHistoryRow
  onPopupEdit?: () => void
  onPopupDelete?: () => void
}

const RawMaterialPurchasementCard: React.FC<IRawMaterialPurchasementCardProps> = props => {
  const onEdit = () => props.onPopupEdit && props.onPopupEdit()

  const calculatePricePerPiece = () => {
    if (props.purchasement?.qty && props.purchasement?.price) {
      const result = props.purchasement?.price / props.purchasement?.qty
      return parseInt(result.toString()).toString() || '-'
    }
    return '-'
  }

  const title = () => {
    const date = props.purchasement?.date ? dateFormatter(props.purchasement?.date) : '-'
    const purchaseOrder = props.purchasement?.purchaseOrder ? `[${props.purchasement?.purchaseOrder}] - ` : ''
    return `${purchaseOrder}${date}`
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity>
        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text type="semibold">{title()}</Text>
          {props.isAllowedToOrganizePurchasement && (
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
            Penginput
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {props.purchasement?.user?.name}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Jumlah
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {props.purchasement?.qty}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 15}}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Harga Pembelian
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {`Rp.${numberWithDot(props.purchasement?.price) || 'Rp.-'}`}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Harga Satuan
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {calculatePricePerPiece() == '-' || isNaN(calculatePricePerPiece()) || !isFinite(calculatePricePerPiece())
              ? 'Rp.-'
              : `Rp.${numberWithDot(calculatePricePerPiece())}`}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default RawMaterialPurchasementCard

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
})
