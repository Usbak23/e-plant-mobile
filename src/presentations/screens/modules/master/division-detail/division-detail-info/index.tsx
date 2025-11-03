import { Division } from '@app/models/eplant/Division'
import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { MenuTrigger, Menu, MenuOptions, MenuOption } from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'

interface IDivisionDetailInfoProps {
  isAllowedToOrganizeDivision?: boolean
  division?: Division
  onPopupEdit?: (division?: Division) => void
  onPopupDelete?: (division?: Division) => void
}

const DivisionDetailInfo: React.FC<IDivisionDetailInfoProps> = props => {

  return (
    <View style={styles.root}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text type="bold" color={theme.colors.textThinBlack} size={14}>
          {props.division?.name}
        </Text>
        {props?.isAllowedToOrganizeDivision && (
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
                  props.onPopupEdit && props.onPopupEdit(props.division)
                }}>
                <PopupEditDelete iconName="create" text="Edit" />
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  props.onPopupDelete && props.onPopupDelete(props.division)
                }}>
                <PopupEditDelete iconName="delete" text="Hapus" />
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_organization.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Nama organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.organization?.name}
            </Text>
          </View>
        </View>

        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_pokok.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Jumlah Pokok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.totalTree}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_area.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Divisi (Ha)
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.area}
            </Text>
          </View>
        </View>

        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_block.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Jumlah Blok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.blocks}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_sph.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              SPH
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.sph != undefined ? props.division?.sph : '-'}
            </Text>
          </View>
        </View>

        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_assistant_div.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Asisten Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.assistantDivision?.name
                ? `${props.division?.assistantDivision?.name} - ${props?.division?.assistantDivision?.nip}`
                : '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_sph.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Terpakai
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.usedArea != undefined ? props?.division?.usedArea + ' Ha' : '-'}
            </Text>
          </View>
        </View>

        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_assistant_div.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Tidak Terpakai
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division?.unusedArea ? `${props.division?.unusedArea} Ha` : '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_sph.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Tahun Tanam
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {Array.isArray(props?.division?.plantingYear) &&
                props?.division?.plantingYear && props?.division?.plantingYear?.length > 0 ? props?.division?.plantingYear?.join(', ') : '-'}
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
})
