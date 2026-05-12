import {theme} from '@app/presentations/utils/styles'
import {Text} from '@components/index'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconBuilding from '@assets/icons/ic_small_building.svg'
import IconPeople from '@assets/icons/ic_small_people.svg'
import IconGroupWork from '@assets/icons/ic_group_work.svg'
import moment from 'moment'

const ICON_SIZE = 17
const AKPDetailInfo = ({bpbksData}: any) => {
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconCalendar width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <View style={[styles.leftSpacer, {flex: 1}]}>
            <Text style={styles.itemTitle} size={11}>
              Tanggal PMB
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {moment(bpbksData?.date).format('DD MMMM YYYY') || '-'}
            </Text>
          </View>
        </View>
        <View style={[styles.itemWrapper]}>
          <View style={styles.smallIconView}>
            <IconBuilding width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <View style={[styles.leftSpacer, {flex: 1}]}>
            <Text style={styles.itemTitle} size={11}>
              Organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {bpbksData?.organization?.label || '-'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconBuilding width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <View style={[styles.leftSpacer, {flex: 1}]}>
            <Text style={styles.itemTitle} size={11}>
              Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {bpbksData?.division?.name || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconPeople width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <View style={[styles.leftSpacer, {flex: 1}]}>
            <Text style={styles.itemTitle} size={11}>
              Mandor
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {bpbksData?.foreman?.name || ''} - {bpbksData?.foreman?.nip || ''} - {bpbksData?.foreman?.role?.name}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconGroupWork width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <View style={[styles.leftSpacer, {flex: 1}]}>
            <Text style={styles.itemTitle} size={11}>
              Jumlah Janjang
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {bpbksData?.totalLength || '0'}
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
  container: {
    marginVertical: 8,
    flexDirection: 'row',
    // marginHorizontal: -6,
  },
  itemWrapper: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 8,
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
  smallIconView: {
    backgroundColor: theme.colors.smallIconViewColor,
    padding: 4,
    borderRadius: 5,
  },
})
