import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import Text from '@components/Text'
import {theme} from '@app/presentations/utils/styles'
import Entypo from 'react-native-vector-icons/Entypo'
import {IItemRow} from '@models/eplant/Item'
import {MenuOptions, MenuOption} from 'react-native-popup-menu'
import PopupEditDelete from '@components/PopupEditDelete'
import {MenuTrigger, Menu} from 'react-native-popup-menu'
import Routes from '@app/presentations/navigation/Routes'
import {useNavigation} from '@react-navigation/core'

interface Props {
  isAllowedToOrganizeToolsAndItems?: boolean
  item: IItemRow
  onDelete: (item: IItemRow) => void
  onTap: (item: IItemRow) => void
  isShowAll?: boolean
  module?: any
}
export default function Card({item, onDelete, module, isShowAll, isAllowedToOrganizeToolsAndItems, onTap}: Props) {
  const navigation: any = useNavigation()

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 10,
          borderRadius: 10,
        },
      }}>
      <MenuOption value={0} onSelect={() => navigation.navigate(Routes.ITEM_FORM, {item, module})}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      <MenuOption value={1} onSelect={() => onDelete(item)}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )

  return (
    <TouchableOpacity style={styles.card} onPress={() => onTap(item)}>
      <View style={[styles.header]}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.accent} type="semibold" style={{flexWrap: 'wrap'}}>
            {`${item?.name} - ${item?.serialNumber}` || '-'}
          </Text>
        </View>
        {isAllowedToOrganizeToolsAndItems && (
          <Menu>
            <MenuTrigger customStyles={{triggerTouchable: styles.menu}}>
              <View style={{padding: 10}}>
                <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
              </View>
            </MenuTrigger>
            {cardOptions()}
          </Menu>
        )}
      </View>
      {isShowAll && (
        <View style={styles.wrapInfo}>
          <View style={styles.wrapLabelValue}>
            <Text color={theme.colors.label} size={11}>
              Item Kategori
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.itemMaster?.categoryItem?.name || '-'}
            </Text>
          </View>
          <View style={styles.wrapLabelValue}>
            <Text color={theme.colors.label} size={11}>
              Master Item
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.itemMaster?.name || '-'}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Organisasi
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.organization?.name || item?.organization || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Model
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.model || '0'}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Tahun Pembelian
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.yearOfPurchase || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Penanggung jawab
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.personResponsible?.name || item?.personResponsible || '0'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    // flex: 1,
    // justifyContent: 'space-between',
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
  header: {flexDirection: 'row', justifyContent: 'space-between'},
  menu: {padding: 13, margin: -13},
  wrapInfo: {flexDirection: 'row', marginTop: 15},
  wrapLabelValue: {flex: 1},
})
