import {theme} from '@app/presentations/utils/styles'
import {Text} from '@components/index'
import React from 'react'
import {Image, StyleSheet, View} from 'react-native'
import {MenuTrigger, Menu, MenuOptions, MenuOption} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import PopupEditDelete from '@components/PopupEditDelete'
import {useNavigation, useRoute} from '@react-navigation/core'
import Routes from '@navigation/Routes'

import {showErrorToast} from '@app/presentations/_shared-components/Toast'
import {useSelector} from 'react-redux'
import {RootState} from '@app/domain/states/reducers'
import {IRKHTakeCareDetail, IRKHTakeCareRow} from '@app/models/eplant/RKHTakeCare'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import {useRKHTakeCareAll, useRKHTakeCareAllOnSameMonthAndYear} from '@app/domain/states/rkh-take-care/hooks'
import moment from 'moment'

interface Props {
  item: IRKHTakeCareRow
  onPopupDelete: (item: IRKHTakeCareRow) => void
  rkh: any
  isAllowedToOrganizeRKH?: boolean
}

const RKHTakeCareDetailInfo = ({item, onPopupDelete, rkh, isAllowedToOrganizeRKH}: Props) => {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  // const rkhTakeCareAll = useRKHTakeCareAll(rkh?.dateRkh)

  const rkhTakeCareOnSameMonth = useRKHTakeCareAllOnSameMonthAndYear(
    route?.params.month,
    route?.params.year,
    route?.params.divisionId,
  )

  const handleDelete = () => {
    if (!item?.isTemp && !isConnected) {
      showErrorToast('Anda tidak dapat menghapus data dalam mode offline')
      return
    }
    onPopupDelete(item)
  }

  const shouldGoBack = () => {
    navigation.goBack()
  }

  const docs = useRKHTakeCareAll(rkh?.dateRkh, rkh?.divcision?.id)

  const handelEdit = () => {
    if (!item?.isTemp && !isConnected) {
      showErrorToast('Anda tidak dapat merubah data dalam mode offline')
      return
    }
    navigation.navigate(Routes.RKH_TAKE_CARE_FORM, {...route.params, item, rkh, onShouldGoBack: shouldGoBack, docs})
  }

  const totalHectare = item?.planHectareArea != undefined ? item.planHectareArea : 0

  const INFO = [
    ['Organisasi', item?.block?.division?.organization?.name],
    ['Divisi', item?.block?.division?.name],
    ['Blok', item?.block?.code],
    ['Luas Blok', item?.block?.blockArea],
    ['Realisasi Ha s.d Hari ini', item?.realizationToThisDay || 0], //TODO: Make sure
    ['Ha Esok Hari', numberWithDot(item.hectaresTomorrow)],
    ['Total Ha', numberWithDot(totalHectare)], //TODO: change key
    ['Tahun Tanam', item?.block?.plantingYear?.join(', ')],
    // [
    //   'Mandor Rawat',
    //   item?.block?.careForeman
    //     ? `${item.block.careForeman.name || ''} - ${item.block.careForeman.nip || ''} - ${
    //         item.block.careForeman.role?.name || ''
    //       }`
    //     : '-' || '-',
    // ],
    ['Total HK Rencana', numberWithDot(item?.totalPlanHk)],
    ['Total HK Realisasi', numberWithDot(item?.totalActualHk)],
  ]

  return (
    <View style={styles.root}>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text type="bold" color={theme.colors.accent} size={14}>
          {item?.subActivity?.name || '-'}
        </Text>

        {isAllowedToOrganizeRKH && Boolean(item?.status == 'open') && (
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
              {!item?.isTemp && (
                <MenuOption onSelect={handelEdit}>
                  <PopupEditDelete iconName="create" text="Edit" />
                </MenuOption>
              )}

              <MenuOption onSelect={handleDelete}>
                <PopupEditDelete iconName="delete" text="Hapus" />
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>

      <View style={styles.container}>
        {INFO.map(([label, value]) => (
          <LabeValue label={label} value={value} />
        ))}
      </View>
    </View>
  )
}

const LabeValue = ({label, value}: any) => (
  <View style={{flexDirection: 'row', marginBottom: 5}}>
    <Text color={theme.colors.label} size={12} style={{flex: 0.4}}>
      {label}
    </Text>
    <Text color={theme.colors.black} size={12} type="semibold" style={{flex: 0.5}}>
      : {value == undefined || value == null ? '-' : value}
    </Text>
  </View>
)

export default RKHTakeCareDetailInfo

const styles = StyleSheet.create({
  root: {
    margin: 16,
    padding: 18,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
  container: {},
})
