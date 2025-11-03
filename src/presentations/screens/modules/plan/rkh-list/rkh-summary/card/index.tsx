import React from 'react'
import {StyleSheet, View} from 'react-native'

import {theme} from '@app/presentations/utils/styles'
import {Text} from '@components/index'
import LinearGradient from 'react-native-linear-gradient'

interface Props {
  title: string
  color: string
  target: string
  achievement: string
  achieved: string
}

export default function AchivementCard(props: Props) {
  const start = {x: 0.6, y: 1}
  const end = {x: 3, y: 1}
  const locations = [0, 0.5]
  return (
    <LinearGradient
      start={start}
      end={end}
      locations={locations}
      colors={[props.color, 'rgba(255, 255, 255, 0.3)']}
      style={{flex: 1, padding: 15, borderRadius: 10, marginHorizontal: 8}}>
      <View>
        <Text color={theme.colors.white} size={12}>
          {props.title}
        </Text>
        <Text maxLines={1} color={theme.colors.white} size={15} type="bold">
          {props.achievement}
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flex: 1, marginRight: 6}}>
          <Text color={theme.colors.white} size={10}>
            Target
          </Text>
          <Text maxLines={2} color={theme.colors.white} size={11} type="semibold" style={{marginTop: 4}}>
            {props.target}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.white} size={10}>
            Tercapai
          </Text>
          <Text maxLines={2} color={theme.colors.white} size={11} type="semibold" style={{marginTop: 4}}>
            {props.achieved}
          </Text>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({})
