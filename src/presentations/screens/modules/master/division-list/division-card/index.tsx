import { Division } from '@app/models/eplant/Division'
import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { MenuTrigger, Menu, MenuOptions, MenuOption } from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'

interface IDivisionCardProps {
  isAllowedToOrganizeDivision?: boolean
  division?: Division
  onTap?: () => void
  onPopupEdit?: (division?: Division) => void
  onPopupDelete?: (division?: Division) => void
}

const DivisionCard: React.FC<IDivisionCardProps> = props => {
  const onCardTap = () => {
    if (props.onTap) {
      props.onTap()
    }
  }

  const onEdit = () => {
    props.onPopupEdit && props.onPopupEdit(props.division)
  }

  const onDelete = () => {
    props.onPopupDelete && props.onPopupDelete(props.division)
  }
  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      <MenuOption onSelect={onEdit}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      <MenuOption value={1} onSelect={onDelete}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onCardTap}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.accent} type="semibold">
              {props.division?.name || ''} - {props.division?.organization?.name || ''}
            </Text>
          </View>
          {props.isAllowedToOrganizeDivision && (
            <Menu>
              <MenuTrigger>
                <View style={{ padding: 10 }}>
                  <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
                </View>
              </MenuTrigger>
              {cardOptions()}
            </Menu>
          )}
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Asisten Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.assistantDivision?.name || 'Tidak tersedia'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Jumlah Blok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.blocks}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Jumlah Pokok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.totalTree}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Luas Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.area ? props.division.area + ' Ha' : props.division?.sph}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              SPH
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.sph ? props.division.sph.toFixed(2) : props.division?.sph}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Jumlah Karyawan
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.totalUser || '-'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default DivisionCard

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
})
