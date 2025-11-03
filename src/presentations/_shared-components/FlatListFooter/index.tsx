import React from 'react'
import {View, ActivityIndicator, StyleSheet} from 'react-native'
import {IProps} from '@app/presentations/types'
import {theme} from '@styles'

interface IPFlatListFooter extends IProps {
  loading: boolean
}

const FlatListFooter = (props: IPFlatListFooter) => {
  const {loading} = props
  return (
    <View style={styles.footer}>
      <ActivityIndicator size="large" color={theme.colors.primary} animating={loading} />
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
})

export default FlatListFooter
