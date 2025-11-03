import { Text } from '@app/presentations/_shared-components'
import { theme } from '@app/presentations/utils/styles'
import React from 'react'
import { StyleSheet, View } from 'react-native'

interface ICensusMonthCardProps {
  censusMonth: {
    labelMonth: string
    month: number
    percentage: string | number
    scatter: string | number
    janjangPerMonth: string | number
    yield?: string | number
    bjr?: string | number
  }
}

const CensusMonthCard: React.FC<ICensusMonthCardProps> = props => {
  return (
    <View style={styles.card}>

      <Text color={theme.colors.accent} type='semibold' size={14}>{props?.censusMonth?.labelMonth || '-'}</Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'flex-start',
          alignItems: 'center',
        }}>
        <View style={{ marginTop: 8, flex: 1 }}>
          <Text size={12}>Persentase %</Text>
          <Text size={12} type="thin">
            {props?.censusMonth?.percentage}
          </Text>
        </View>
        <View style={{ marginTop: 8, flex: 1 }}>
          <Text size={12}>BJR</Text>
          <Text size={12} type="thin">
            {props?.censusMonth?.bjr || '-'}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'flex-start',
          alignItems: 'center',
        }}>
        <View style={{ marginTop: 8, flex: 1 }}>
          <Text size={12}>Total Tonase</Text>
          <Text size={12} type="thin">
            {props?.censusMonth?.scatter}
          </Text>
        </View>

        <View style={{ marginTop: 8, flex: 1 }}>
          <Text size={12}>Janjang Per Bulan</Text>
          <Text size={12} type="thin">
            {props?.censusMonth?.janjangPerMonth}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'flex-start',
          alignItems: 'center',
        }}>
        <View style={{ marginTop: 8, flex: 1 }}>
          <Text size={12}>Yield</Text>
          <Text size={12} type="thin">
            {props?.censusMonth?.yield || '-'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default CensusMonthCard

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
})
