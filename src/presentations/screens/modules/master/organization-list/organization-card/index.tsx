import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Text from '@components/Text'
import { theme } from '@app/presentations/utils/styles'
import Entypo from 'react-native-vector-icons/Entypo'
import { IOrganizationRow } from '@models/eplant/Organization'
import { MenuOptions, MenuOption } from 'react-native-popup-menu'
import PopupEditDelete from '@components/PopupEditDelete'
import { MenuTrigger, Menu } from 'react-native-popup-menu'
import Routes from '@app/presentations/navigation/Routes'
import { useNavigation } from '@react-navigation/core'

interface Props {
  isAllowedToOrganizeOrganization?: boolean
  item: IOrganizationRow
  onDelete: (item: IOrganizationRow) => void
}
export default function Card({ item, onDelete, isAllowedToOrganizeOrganization }: Props) {
  const navigation: any = useNavigation()

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 10,
          borderRadius: 10,
        },
      }}>
      <MenuOption value={0} onSelect={() => navigation.navigate(Routes.ORGANIZATION_FORM, { item })}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      {item?.id === 'bce5c5b8-c685-4a9a-ac80-7bb5af31a31d' ||
        item?.id === 'ef70442e-a865-4266-97b5-375187d73acc' ? null : (
        <MenuOption value={1} onSelect={() => onDelete(item)}>
          <PopupEditDelete iconName="delete" text="Hapus" />
        </MenuOption>
      )}
    </MenuOptions>
  )

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.card}
      onPress={() => navigation.navigate(Routes.ORGANIZATION_DETAIL, { item })}>
      <View style={[styles.header, { alignItems: 'center' }]}>
        <View style={{ flex: 1 }}>
          <Text color={theme.colors.accent} type="semibold">
            {item?.name || '-'}
          </Text>
        </View>

        {isAllowedToOrganizeOrganization ? (
          <Menu>
            <MenuTrigger customStyles={{ triggerTouchable: styles.menu }}>
              <View style={{ padding: 10 }}>
                <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
              </View>
            </MenuTrigger>
            {cardOptions()}
          </Menu>
        ) : null}
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Kota
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.district?.name || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Jumlah Divisi
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.divisions?.length || '0'}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Luas Organisasi
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.organizationArea ? `${item?.organizationArea} Ha` : '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Jumlah Karyawan
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.totalUser || '0'}
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
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  menu: { padding: 13, margin: -13 },
  wrapInfo: { flexDirection: 'row', marginTop: 15 },
  wrapLabelValue: { flex: 1 },
})
