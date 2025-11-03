import {theme} from '@app/presentations/utils/styles'
import {Text} from '@components/index'
import React from 'react'
import {StyleSheet, View} from 'react-native'

import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconBuilding from '@assets/icons/ic_small_building.svg'

interface Props {
  organization: string
  division: string
  year: string
}

const CensusListHeader = (props: Props) => {
  return (
    <View style={styles.root}>
      <View style={{flexDirection: 'row'}}>
        <View style={[styles.itemWrapper, {marginEnd: 16}]}>
          <View style={styles.smallIconView}>
            <IconBuilding width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.organization || '-'}
            </Text>
          </View>
        </View>
        <View style={[styles.itemWrapper, {marginEnd: 16}]}>
          <View style={styles.smallIconView}>
            <IconBuilding width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.division || '-'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={[styles.itemWrapper]}>
          <View style={styles.smallIconView}>
            <IconCalendar width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Tahun
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.year || '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CensusListHeader

const styles = StyleSheet.create({
  root: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
  container: {
    marginTop: 8,
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
