import {IRSRKH} from '@app/domain/states/rkh/reducer'
import {RootStateType} from '@app/domain/states/store'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import {useSelector} from 'react-redux'

import AchivementCard from './card'

export default function RKHSummary() {
  const colors = ['rgba(240, 177, 13, 0.8)', 'rgba(18, 176, 83, 0.8)']
  const rkhSummary = useSelector((state: RootStateType) => state?.rkh?.rkhSummary)
  const harvest = rkhSummary?.data?.harvest
  const takeCare = rkhSummary?.data?.takeCare

  return (
    <View style={styles.container}>
      <AchivementCard
        title="Pencapaian Panen"
        color={colors[0]}
        achievement={`${harvest?.harvestAchievement || '0'}%`}
        target={`${numberWithDot(harvest?.target || 0)} Kg`}
        achieved={`${numberWithDot(harvest?.achieved || 0)} Kg`}
      />
      <AchivementCard
        title="Pencapaian Rawat"
        color={colors[1]}
        achievement={`${takeCare?.takeCareAchievement || '0'}%`}
        target={`${numberWithDot(takeCare?.target || 0)} Ha`}
        achieved={`${numberWithDot(takeCare?.achieved || 0)} Ha`}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    marginHorizontal: -8,
  },
})
