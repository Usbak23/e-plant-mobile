import {ICategoryItemRow} from '@app/models/eplant/CategoryItem'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@components/index'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import IconPOS from '@assets/icons/ic_small_point_of_sale.svg'
import IconMonetize from '@assets/icons/ic_small_monetization.svg'
import {MenuTrigger, Menu, MenuOptions, MenuOption} from 'react-native-popup-menu'
import PopupEditDelete from '@components/PopupEditDelete'
import Entypo from 'react-native-vector-icons/Entypo'

interface IDetailInfoProps {
  isAllowedToOrganizeToolsAndItems?: boolean
  item?: ICategoryItemRow
  onPopupEdit?: (item?: ICategoryItemRow) => void
  onPopupDelete?: (item?: ICategoryItemRow) => void
}

const DetailInfo: React.FC<IDetailInfoProps> = props => {
  return (
    <View style={styles.root}>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text type="bold" color={theme.colors.textThinBlack} size={14}>
          {props.item?.name}
        </Text>
        {props.isAllowedToOrganizeToolsAndItems && (
          <Menu>
            <MenuTrigger>
              <View style={{padding: 10}}>
                <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
              </View>
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  padding: 8,
                  borderRadius: 8,
                },
              }}>
              <MenuOption
                onSelect={() => {
                  props.onPopupEdit && props.onPopupEdit(props.item)
                }}>
                <PopupEditDelete iconName="create" text="Edit" />
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  props.onPopupDelete && props.onPopupDelete(props.item)
                }}>
                <PopupEditDelete iconName="delete" text="Hapus" />
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconPOS width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Deskripsi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.description}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconMonetize width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Jumlah Master Item
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.totalMasterItem}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default DetailInfo

const styles = StyleSheet.create({
  root: {
    margin: 16,
    padding: 24,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
  container: {
    marginTop: 16,
    flexDirection: 'row',
  },
  itemWrapper: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  itemTitle: {
    color: '#9C9C9C',
    overflow: 'hidden',
  },
  icon: {
    width: 24,
    height: 24,
  },
  leftSpacer: {
    flex: 1,
    marginStart: 8,
  },
  smallIconView: {
    backgroundColor: theme.colors.smallIconViewColor,
    padding: 4,
    borderRadius: 5,
  },
})
