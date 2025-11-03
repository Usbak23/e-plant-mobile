import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import Text from '../Text'
import AntDesign from 'react-native-vector-icons/AntDesign'

const RequestTextAccepted = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <AntDesign color={theme.colors.tealDark} name="checkcircle" size={17} />
        <Text maxLines={2} size={11} style={{marginStart: 8}} color={theme.colors.tealDark} type="bold">
          Disetujui
        </Text>
      </View>
    </View>
  )
}

export default RequestTextAccepted

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 16,
    margin: 2,
    backgroundColor: theme.colors.tealSemiTransparent,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
