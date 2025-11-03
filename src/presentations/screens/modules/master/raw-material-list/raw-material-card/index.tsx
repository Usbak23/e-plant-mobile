import {IRawMaterialRow} from '@app/models/eplant/RawMaterial'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'

interface IRawMaterialCardProps {
  isAllowedToOrganizeMaterial?: boolean
  isAllowedToOrganizePurchasement?: boolean
  onTap?: () => void
  onPopupEdit?: () => void
  onPopupDelete?: () => void
  onPopupAddStock?: () => void
  rawMaterial?: IRawMaterialRow
}

const RawMaterialCard: React.FC<IRawMaterialCardProps> = props => {
  const onTap = () => {
    if (props.onTap) {
      props.onTap()
    }
  }

  const onEdit = () => {
    props.onPopupEdit && props.onPopupEdit()
  }

  const onDelete = () => {
    props.onPopupDelete && props.onPopupDelete()
  }

  const onAddStock = () => {
    props.onPopupAddStock && props.onPopupAddStock()
  }

  const isLowStockBg = () => {
    if (props.rawMaterial?.isLessThanStock) {
      return {
        backgroundColor: '#f9e4e9',
      }
    }
    return {
      backgroundColor: 'white',
    }
  }

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      {props.isAllowedToOrganizeMaterial && (
        <>
          <MenuOption onSelect={onEdit}>
            <PopupEditDelete iconName="create" text="Edit" />
          </MenuOption>
          <MenuOption onSelect={onDelete}>
            <PopupEditDelete iconName="delete" text="Hapus" />
          </MenuOption>
        </>
      )}

      {props?.isAllowedToOrganizePurchasement && (
        <MenuOption onSelect={onAddStock}>
          <PopupEditDelete iconName="add" text="Tambah Stok" />
        </MenuOption>
      )}
    </MenuOptions>
  )
  return (
    <View style={[styles.card, isLowStockBg()]}>
      <TouchableOpacity onPress={onTap}>
        {props.rawMaterial?.isLessThanStock && (
          <Text type="semibold" style={styles.lowStockText}>
            Material telah mencapai stok minimum. Tambah stok sekarang
          </Text>
        )}

        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text color={theme.colors.accent} type="semibold">
            {props.rawMaterial?.name}
          </Text>
          {(props.isAllowedToOrganizeMaterial || props.isAllowedToOrganizePurchasement) && (
            <Menu>
              <MenuTrigger>
                <View style={{padding: 10}}>
                  <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
                </View>
              </MenuTrigger>
              {cardOptions()}
            </Menu>
          )}
        </View>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Kode
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.code}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Lokasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.location}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Jumlah Item
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.qty}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Satuan
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.uom?.name}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.organization?.name || '-'}
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default RawMaterialCard

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 22,
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

  topSpacer: {
    marginTop: 16,
  },

  lowStockText: {
    fontSize: 10.5,
    marginBottom: 16,
    color: '#E95675',
  },
})
