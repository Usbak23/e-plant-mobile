import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {StyleSheet, View} from 'react-native'

interface Props {
  totalMaterialPlan: any
  totalMaterialRealization: any
}

const SummaryCardRKHTakeCare: React.FC<Props> = props => {
  return (
    <View style={styles.card}>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <Text size={11} color={theme.colors.grey}>
            Total Material Rencana
          </Text>
          <Text>{props.totalMaterialPlan || '-'}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={11} color={theme.colors.grey}>
            Total Material Realisasi
          </Text>
          <Text>{props.totalMaterialRealization || '-'}</Text>
        </View>
      </View>
    </View>
  )
}

export default SummaryCardRKHTakeCare

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
