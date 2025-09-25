import { theme } from '@app/presentations/utils/styles'
import { Text } from '@components/index'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { MenuTrigger, Menu, MenuOptions, MenuOption } from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import PopupEditDelete from '@components/PopupEditDelete'
import { useNavigation } from '@react-navigation/core'
import Routes from '@navigation/Routes'

const DivisionDetailInfo = ({ item, onPopupDelete, isAllowedToOrganizeOrganization }: any) => {
  const navigation: any = useNavigation()
  return (
    <View style={styles.root}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text type="bold" color={theme.colors.textThinBlack} size={14}>
            {item?.name || '-'}
          </Text>
        </View>

        {isAllowedToOrganizeOrganization ? (
          <Menu>
            <MenuTrigger>
              <View style={{ padding: 10 }}>
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
                  navigation.navigate(Routes.ORGANIZATION_FORM, { item })
                }}>
                <PopupEditDelete iconName="create" text="Edit" />
              </MenuOption>
              {item?.id === 'bce5c5b8-c685-4a9a-ac80-7bb5af31a31d' ||
                item?.id === 'ef70442e-a865-4266-97b5-375187d73acc' ? null : (
                <MenuOption
                  onSelect={() => {
                    onPopupDelete(item)
                  }}>
                  <PopupEditDelete iconName="delete" text="Hapus" />
                </MenuOption>
              )}
            </MenuOptions>
          </Menu>
        ) : null}
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_organization.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Alamat organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.address || '-'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/phone_yellow.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Nomor Telepon
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.phone || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/manager_estate_yellow.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>

            <Text style={styles.itemTitle} size={11}>
              Manajer Estate
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.manajerEstate?.name ? `${item?.manajerEstate?.name} - ${item?.manajerEstate?.nip}` : '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/manager_estate_yellow.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Jumlah Karyawan
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.totalUser?.allUser || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_area.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Jumlah Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {Array.isArray(item?.divisions) ? item.divisions.length : item.divisions}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_area.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.organizationArea ? `${item?.organizationArea} Ha` : '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_area.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Terpakai
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.usedArea ? `${item?.usedArea} Ha` : '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_area.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Tidak Terpakai
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.unusedArea ? `${item?.unusedArea} Ha` : '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default DivisionDetailInfo

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
  },
  icon: {
    width: 24,
    height: 24,
  },
  leftSpacer: {
    marginStart: 8,
  },
})
