import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import Text from '@components/Text'
import {theme} from '@app/presentations/utils/styles'
import Entypo from 'react-native-vector-icons/Entypo'
import {IMasterItemRow} from '@models/eplant/MasterItem'
import {MenuOptions, MenuOption} from 'react-native-popup-menu'
import PopupEditDelete from '@components/PopupEditDelete'
import {MenuTrigger, Menu} from 'react-native-popup-menu'
import Routes from '@app/presentations/navigation/Routes'
import {useNavigation} from '@react-navigation/core'

interface Props {
  item: IMasterItemRow
  onDelete: (item: IMasterItemRow) => void
  onTap: (item: IMasterItemRow) => void
  isShowAll?: boolean
  module?: any
  isAllowedToOrganizeToolsAndItems?: boolean
}
export default function Card({item, onDelete, onTap, isShowAll, module, isAllowedToOrganizeToolsAndItems}: Props) {
  const navigation: any = useNavigation()

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 10,
          borderRadius: 10,
        },
      }}>
      <MenuOption value={0} onSelect={() => navigation.navigate(Routes.MASTER_ITEM_FORM, {item, module})}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      <MenuOption value={1} onSelect={() => onDelete(item)}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )

  return (
    <TouchableOpacity style={styles.card} onPress={() => onTap(item)}>
      <View style={styles.header}>
        <Text color={theme.colors.accent} type="semibold">
          {item?.name || '-'}
        </Text>
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
              {item?.categoryItem?.name || '-'}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Deskripsi
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.description || '-'}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Jumlah Item
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.totalItems || '0'}
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
