import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import Text from '@components/Text'
import {theme} from '@app/presentations/utils/styles'
import Entypo from 'react-native-vector-icons/Entypo'
import {IRKHRow} from '@models/eplant/RKH'
import {MenuOptions, MenuOption} from 'react-native-popup-menu'
import PopupEditDelete from '@components/PopupEditDelete'
import {MenuTrigger, Menu} from 'react-native-popup-menu'
import Routes from '@app/presentations/navigation/Routes'
import {useNavigation, useRoute} from '@react-navigation/core'
import moment from 'moment'
import {showErrorToast} from '@components/Toast'
import {useSelector} from 'react-redux'
import {RootState} from '@app/domain/states/reducers'
import {useSummaryRKH} from '@app/domain/states/rkh/hooks'

interface Props {
  item: IRKHRow
  onDelete: (item: IRKHRow) => void
  isAllowedToOrganizeRKH?: boolean
}
export default function Card({item, onDelete, isAllowedToOrganizeRKH}: Props) {
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const isConnected = useSelector((state: RootState) => state.network.isConnected)

  const {totalPlanHk, totalActualHk} = useSummaryRKH(item?.division?.id, item?.dateRkh)

  const handleDelete = () => {
    if (!item?.isTemp && !isConnected) {
      showErrorToast('Anda tidak dapat menghapus data dalam mode offline')
      return
    }
    onDelete(item)
  }

  const handelEdit = () => {
    if (!item?.isTemp && !isConnected) {
      showErrorToast('Anda tidak dapat merubah data dalam mode offline')
      return
    }
    navigation.navigate(Routes.RKH_FORM, {item, ...route.params})
  }

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 10,
          borderRadius: 10,
        },
      }}>
      <MenuOption value={0} onSelect={handelEdit}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>

      <MenuOption value={1} onSelect={handleDelete}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.card, item?.isTemp && {backgroundColor: 'rgba(233, 86, 117, 0.15)', shadowColor: '#fff'}]}
      onPress={() =>
        navigation.navigate(Routes.RKH_LIST_TAB, {
          item,
          dateRkh: item?.dateRkh,
          ...route.params,
        })
      }>
      {item?.isTemp && (
        <Text color={'#E95675'} size={8} type="semibold">
          Anda dalam mode offline. RKH dijadikan sebagai draft.
        </Text>
      )}
      <View style={styles.header}>
        <Text color={theme.colors.accent} style={{marginTop: 10}} type="semibold">
          {/* {item?.numberRkh || `RKH - ${moment(item?.dateRkh).format('DDMMYY')}` || '-'} */}
          {`RKH - ${moment(item?.dateRkh).format('DDMMYY')}` || '-'}
        </Text>
        {isAllowedToOrganizeRKH && (
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
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Organisasi
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.division?.organization?.name || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Divisi
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.division?.name || '-'}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Tanggal
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {moment(item?.dateRkh).format('DD MMMM YYYY') || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Rencana
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.plan || '-'}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Total HK Rencana
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {/* {item?.totalHkPlan  || '-'} */}
            {item?.totalHkPlan || totalPlanHk || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Total HK Realisasi
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {/* {item?.totalHkRealization  || '-'} */}
            {totalActualHk || '-'}
          </Text>
        </View>
      </View>
      {/* <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Rencana Biaya
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.totalHkPlan || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Realisasi Biaya
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.totalHkRealization || '-'}
          </Text>
        </View>
      </View> */}
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
