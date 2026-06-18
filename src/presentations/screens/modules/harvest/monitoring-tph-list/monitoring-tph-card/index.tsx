import React from 'react'
import {Image, StyleSheet, View} from 'react-native'
import {Text} from '@app/presentations/_shared-components'
import {theme} from '@app/presentations/utils/styles'

const getDateColor = (dateStr: string): string | undefined => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return undefined
  if (diffDays === 1) return '#abd9fa'
  if (diffDays === 2) return '#f9f09f'
  if (diffDays === 3) return '#fabcc3'
  return '#d9d9d9'
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

interface Props {
  item: any
}

const MonitoringTphCard = ({item}: Props) => {
  const bgColor = getDateColor(item.date)
  return (
    <View style={[styles.card, bgColor ? {backgroundColor: bgColor} : {}]}>
      <View style={styles.header}>
        <Text size={13} color={theme.colors.accent} type="semibold">
          {formatDate(item.date || '')}
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginTop: 8}}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>Blok</Text>
          <Text color={theme.colors.textThinBlack} size={12}>{item.blockCode || '-'}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>TPH</Text>
          <Text color={theme.colors.textThinBlack} size={12}>{item.tphName || item.tphCode || '-'}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 8}}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>Sisa Janjang</Text>
          <Text color={theme.colors.textThinBlack} size={12} type="semibold">{item.sisaJanjang ?? 0}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>Foto TPH</Text>
          {item.photo ? (
            <Image source={{uri: item.photo}} style={styles.thumbnail} />
          ) : (
            <Text color="#999" size={11}>-</Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default MonitoringTphCard

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 18,
    marginVertical: 7.5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbnail: {width: 40, height: 40, borderRadius: 6, marginTop: 4},
})
