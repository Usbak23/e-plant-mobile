import {ICensusDetail} from '@app/models/eplant/Census'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import React from 'react'
import {Image, StyleSheet, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import IconBuilding from '@assets/icons/ic_small_building.svg'
import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconGeo from '@assets/icons/ic_small_geo.svg'
import IconDotsVert from '@assets/icons/ic_small_dots_vertical.svg'
import IconFruits from '@assets/icons/ic_small_fruits.svg'
import IconSquare from '@assets/icons/ic_small_square.svg'
import IconPOS from '@assets/icons/ic_small_point_of_sale.svg'
import {useNavigation} from '@react-navigation/native'

interface ICensusDetailInfoProps {
  isAllowedToOrganizeCensus?: boolean
  censusDetail?: ICensusDetail
  onPopupEdit: () => void
  onPopupDelete: () => void
}

const CensusDetailInfo: React.FC<ICensusDetailInfoProps> = props => {
  return (
    <View style={styles.root}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text type="bold" color={theme.colors.textThinBlack} size={14}>
          {props?.censusDetail?.numberCensus || '-'}
        </Text>
        {props.isAllowedToOrganizeCensus && (
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
              <MenuOption onSelect={() => props.onPopupEdit()}>
                <PopupEditDelete iconName="create" text="Edit" />
              </MenuOption>
              <MenuOption onSelect={() => props.onPopupDelete()}>
                <PopupEditDelete iconName="delete" text="Hapus" />
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconBuilding width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.block?.division?.organization?.name || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconBuilding width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.block?.division?.name || '-'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconCalendar />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Tahun Tanam
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.yearOfCensus || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconGeo />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Blok (Ha)
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.block?.blockArea || '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconDotsVert />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Jumlah Pokok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.totalTree || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconDotsVert />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Pokok Diperiksa
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.totalTreeChecked != undefined ? props?.censusDetail?.totalTreeChecked : '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconFruits />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Jumlah Janjang
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.totalFruit || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconFruits />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Rata-rata Janjang
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.averageFruit || '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconSquare />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Janjang Per Blok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.totalFruitOfBlock != undefined ? props?.censusDetail?.totalFruitOfBlock : '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconFruits />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              BJR
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.bjr != undefined ? props?.censusDetail?.bjr : '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconPOS />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Tonase Per Blok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.totalTonnage != undefined ? `${props?.censusDetail?.totalTonnage} Kilogram` : '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconPOS />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Ton/Ha
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props?.censusDetail?.tonnagePerHectare != undefined ? props?.censusDetail?.tonnagePerHectare : '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CensusDetailInfo

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
    marginStart: 10,
  },
  smallIconView: {
    backgroundColor: theme.colors.smallIconViewColor,
    padding: 4,
    borderRadius: 5,
  },
})
