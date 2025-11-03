import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { MenuTrigger, Menu, MenuOptions, MenuOption } from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import { Material } from '@app/models/eplant/BKMTakeCare'

interface Props {
  item: Material
  onEdit?: (item?: Material) => void
  onDelete?: (item?: Material) => void
}

const MaterialCard = (props: Props) => {
  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      <MenuOption onSelect={props.onEdit}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      <MenuOption value={1} onSelect={props.onDelete}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )

  const MenuButton = () => (
    <Menu>
      <MenuTrigger>
        <View style={{ padding: 10 }}>
          <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
        </View>
      </MenuTrigger>
      {cardOptions()}
    </Menu>
  )

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text size={10} color={theme.colors.label}>
          Material
        </Text>
        <Text size={10}>{props?.item?.name}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text size={10} color={theme.colors.label}>
          Satuan
        </Text>
        <Text size={10}>{props?.item?.uom?.name}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text size={10} color={theme.colors.label}>
          Jumlah Material
        </Text>
        <Text size={10}>{props?.item?.qty}</Text>
      </View>
      <MenuButton />
    </View>
  )
}

export default MaterialCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
})
