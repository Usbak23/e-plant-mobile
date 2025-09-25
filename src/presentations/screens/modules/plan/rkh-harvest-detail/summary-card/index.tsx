import numberWithDot from '@app/presentations/utils/numberWithDot'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {StyleSheet, View} from 'react-native'

interface Props {
  costPerHkPlan: number
  totalHkPlan: number
  costRealization?: number
  totalHkRealization?: number
}

const SummaryCardRKHHarvest: React.FC<Props> = props => {
  return (
    <View style={styles.card}>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <Text size={11} color={theme.colors.grey}>
            Biaya / HK Rencana
          </Text>
          <Text>{props.costPerHkPlan != undefined ? `Rp.${numberWithDot(props.costPerHkPlan)}` : '-'}</Text>
          <Text size={11} color={theme.colors.grey}>
            Total HK Rencana
          </Text>
          <Text>{props.totalHkPlan != undefined ? `${props.totalHkPlan}` : '-'}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={11} color={theme.colors.grey}>
            Total Biaya Realisasi
          </Text>
          <Text>-</Text>
          <Text size={11} color={theme.colors.grey}>
            Total HK Realisasi
          </Text>
          <Text>-</Text>
        </View>
      </View>
    </View>
  )
}

export default SummaryCardRKHHarvest

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F6F6F6',
    padding: 16,
    borderRadius: 10,
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
})
