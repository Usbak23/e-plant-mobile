import React from 'react'
import {StyleSheet, View} from 'react-native'
import IconOrganizarion from '@assets/icons/ic_small_organization.svg'
import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconDivision from '@assets/icons/menus/master-data-menus/ic_division.svg'
import {Text} from '@app/presentations/_shared-components'
import {theme} from '@app/presentations/utils/styles'

const ICON_SIZE = 17
const ListRequestDetailInfo = ({data}: any) => {
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconOrganizarion width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <View style={[styles.leftSpacer, {flex: 1}]}>
            <Text style={styles.itemTitle} size={11}>
              Organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {data?.organization?.label || '-'}
            </Text>
          </View>
        </View>
        <View style={[styles.itemWrapper]}>
          <View style={styles.smallIconView}>
            <IconDivision width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <View style={[styles.leftSpacer, {flex: 1}]}>
            <Text style={styles.itemTitle} size={11}>
              Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {data?.division?.label || '-'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconCalendar width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <View style={[styles.leftSpacer, {flex: 1}]}>
            <Text style={styles.itemTitle} size={11}>
              Bulan
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {data?.month?.label || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconCalendar width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <View style={[styles.leftSpacer, {flex: 1}]}>
            <Text style={styles.itemTitle} size={11}>
              Tahun
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {data?.year || '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ListRequestDetailInfo
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
