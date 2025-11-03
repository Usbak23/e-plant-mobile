import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import Text from '../Text'
import AntDesign from 'react-native-vector-icons/AntDesign'

const RequestTextWaiting = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <AntDesign color={theme.colors.yellowDark} name="minuscircle" size={17} />
        <Text maxLines={2} size={11} style={{marginStart: 8}} color={theme.colors.yellowDark} type="bold">
          Menunggu Persetujuan
        </Text>
      </View>
    </View>
  )
}

export default RequestTextWaiting

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 16,
    margin: 2,
    backgroundColor: theme.colors.accentTransparent,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
