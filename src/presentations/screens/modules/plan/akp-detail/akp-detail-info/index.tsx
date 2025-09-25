import {theme} from '@app/presentations/utils/styles'
import {Text} from '@components/index'
import React from 'react'
import {Image, StyleSheet, View} from 'react-native'
import {MenuTrigger, Menu, MenuOptions, MenuOption} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import PopupEditDelete from '@components/PopupEditDelete'
import {useNavigation} from '@react-navigation/core'
import Routes from '@navigation/Routes'

import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconBuilding from '@assets/icons/ic_small_building.svg'
import IconPercent from '@assets/icons/ic_small_percent.svg'
import IconDotVertical from '@assets/icons/ic_small_dots_vertical.svg'
import IconDotHorizontal from '@assets/icons/ic_small_dots_horizontal.svg'
import IconPeople from '@assets/icons/ic_small_people.svg'
import moment from 'moment'
import {showErrorToast} from '@app/presentations/_shared-components/Toast'
import {useSelector} from 'react-redux'
import {RootState} from '@app/domain/states/reducers'

const AKPDetailInfo = ({item, onPopupDelete, isAllowedToOrganizeAKP, ORGANIZATION, DIVISION, DATE}: any) => {
  const navigation: any = useNavigation()
  const isConnected = useSelector((state: RootState) => state.network.isConnected)

  const handleDelete = () => {
    if (!item?.isTemp && !isConnected) {
      showErrorToast('Anda tidak dapat menghapus data dalam mode offline')
      return
    }
    onPopupDelete(item)
  }

  const handelEdit = () => {
    if (!item?.isTemp && !isConnected) {
      showErrorToast('Anda tidak dapat merubah data dalam mode offline')
      return
    }
    const obj = {
      parent: {
        ORGANIZATION: {...ORGANIZATION},
        DIVISION: {...DIVISION},
        DATE,
      },
    }
    navigation.navigate(Routes.AKP_FORM, {item, ...obj})
  }

  const total = item?.akpLines.reduce(
    (prev: any, curr: any) => ({
      bunches: parseInt(curr.totalBunches) + prev.bunches,
      tree: parseInt(curr.totalTree) + prev.tree,
    }),
    {
      bunches: 0,
      tree: 0,
    },
  )

  const akpPercent = (100 * total.bunches) / total.tree

  return (
    <View style={styles.root}>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text type="bold" color={theme.colors.textThinBlack} size={14}>
          {item?.numberAkp || `${item?.block?.code} - ${moment(item?.harvestDate).format('DDMMYY')}` || '-'}
        </Text>
        {isAllowedToOrganizeAKP && (
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
              <MenuOption onSelect={handelEdit}>
                <PopupEditDelete iconName="create" text="Edit" />
              </MenuOption>
              <MenuOption onSelect={handleDelete}>
                <PopupEditDelete iconName="delete" text="Hapus" />
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>

      <View style={styles.container}>
        <View style={[styles.itemWrapper, {marginEnd: 16}]}>
          <View style={styles.smallIconView}>
            <IconCalendar width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Tanggal Panen
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {moment(item?.harvestDate).format('DD MMMM YYYY') || '-'}
            </Text>
          </View>
        </View>
        <View style={[styles.itemWrapper, styles.leftSpacer]}>
          <View style={styles.smallIconView}>
            <IconBuilding width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.block?.division?.organization?.name || '-'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={[styles.itemWrapper, {marginEnd: 16}]}>
          <View style={styles.smallIconView}>
            <IconBuilding width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.block?.division?.name || '-'}
            </Text>
          </View>
        </View>
        <View style={[styles.itemWrapper, styles.leftSpacer]}>
          <View style={styles.smallIconView}>
            <IconPercent width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Luas Area (Ha)
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.block?.blockArea || '-'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={[styles.itemWrapper, {marginEnd: 16}]}>
          <View style={styles.smallIconView}>
            <IconDotHorizontal width={14} height={14} />
          </View>
          <View style={[styles.leftSpacer]}>
            <Text style={styles.itemTitle} size={11}>
              Total Tandan (Survey)
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.totalBunches || total.bunches || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconDotVertical width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Total Pokok (Survey)
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.totalTree || total.tree || '-'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={[styles.itemWrapper]}>
          <View style={styles.smallIconView}>
            <IconPercent width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              %AKP
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.akpPercent ? item?.akpPercent?.toFixed(2) + '%' : akpPercent?.toFixed(2) + '%' || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconPeople width={14} height={14} />
          </View>
          <View style={[styles.leftSpacer, styles.leftSpacer]}>
            <Text style={styles.itemTitle} size={11}>
              Pembuat AKP
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {item?.user?.name || ''} - {item?.user?.nip || ''} - {item?.user?.role?.name || ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default AKPDetailInfo

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
    marginEnd: 4,
  },
  smallIconView: {
    backgroundColor: theme.colors.smallIconViewColor,
    padding: 4,
    borderRadius: 5,
  },
})
