import { IBlockRow } from '@app/models/eplant/Block'
import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'

interface IBlockDetailInfoProps {
  isAllowedToOrganizeBlock?: boolean
  block?: IBlockRow
  onPopupEdit?: (v?: IBlockRow) => void
  onPopupDelete?: (v?: IBlockRow) => void
}

const BlockDetailInfo: React.FC<IBlockDetailInfoProps> = props => {
  return (
    <View style={styles.root}>
      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text type="bold" color={theme.colors.textThinBlack} size={14}>
          {props.block?.code}
        </Text>
        {props.isAllowedToOrganizeBlock && (
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
                  props.onPopupEdit && props.onPopupEdit(props.block)
                }}>
                <PopupEditDelete iconName="create" text="Edit" />
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  props.onPopupDelete && props.onPopupDelete(props.block)
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
              {props.block?.division?.organization?.name}
            </Text>
          </View>
        </View>

        <View style={[styles.itemWrapper, styles.leftSpacer]}>
          <Image source={require('@assets/icons/icon_area.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Nama Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.division?.name}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_coordinate.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Koordinat
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.fileGeoJson || 'Tidak tersedia'}
            </Text>
          </View>
        </View>

        <View style={[styles.itemWrapper, styles.leftSpacer]}>
          <Image source={require('@assets/icons/icon_area.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Blok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.blockArea ? props.block?.blockArea + ' Ha' : '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_area.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Terpakai
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.block?.usedArea ? props?.block?.usedArea + ' Ha' : '-'}
            </Text>
          </View>
        </View>

        <View style={[styles.itemWrapper, styles.leftSpacer]}>
          <Image source={require('@assets/icons/icon_area.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Tidak Terpakai
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.block?.unusedArea ? props?.block?.unusedArea + ' Ha' : '-'}
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
              {props?.block?.sph ? props?.block?.sph?.toFixed(2)?.toString() : '-'}
            </Text>
          </View>
        </View>

        <View style={[styles.itemWrapper, styles.leftSpacer]}>
          <Image source={require('@assets/icons/icon_pokok.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              BJR
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.block?.bjr ? props?.block?.bjr : '-'}
            </Text>
          </View>
        </View>
      </View>

      {/* <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_pokok.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Total Pokok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.totalTree}
            </Text>
          </View>
        </View>

        <View style={[styles.itemWrapper, styles.leftSpacer]}>
          <Image source={require('@assets/icons/icon_year.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Tahun Tanam
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.plantingYear ? props.block?.plantingYear.join(',') : '~'}
            </Text>
          </View>
        </View>
      </View> */}

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_kapel.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Kapel Panen
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.harvestChapel}
            </Text>
          </View>
        </View>

        <View style={[styles.itemWrapper, styles.leftSpacer]}>
          <Image source={require('@assets/icons/icon_line.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Jumlah Baris
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.numberOfLine}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_variety.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Varietas
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.varieties ? props.block.varieties.join(',') : '~'}
            </Text>
          </View>
        </View>

      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_year.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Tahun Tanam
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.plantingYear ? props.block?.plantingYear.join(', ') : '~'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_year.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Jumlah Pokok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.totalTreeEachYear ? props.block?.totalTreeEachYear.join(', ') : '~'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <Image source={require('@assets/icons/icon_year.png')} style={styles.icon} />
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas per Tahun Tanam
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.block?.blockAreaEachYear ? props.block?.blockAreaEachYear.join(', ') : '~'}
            </Text>
          </View>
        </View>
      </View>


    </View>
  )
}

export default BlockDetailInfo

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
