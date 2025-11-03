import React from 'react'
import {View, StyleSheet} from 'react-native'

import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {theme} from '@styles'
import Text from '@components/Text'

export default function SpashScreen() {
  return (
    <View style={styles.container}>
      <Text>Splash</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: wp(50),
    height: wp(50),
  },
})
