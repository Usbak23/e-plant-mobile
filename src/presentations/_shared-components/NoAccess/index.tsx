import React from 'react'
import {StyleSheet, View, Image} from 'react-native'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import EmptyImage from '@assets/images/empty.svg'

import Text from '@components/Text'

const NoAccessView = () => {
  return (
    <View style={styles.center}>
      <EmptyImage style={styles.emptyImage} />
      <Text size={15} style={styles.center} type="bold">
        Halaman ini tidak dapat ditampilkan
      </Text>
      <Text size={11} style={{textAlign: 'center', marginTop: 8}}>
        Anda tidak memiliki akses untuk melihat halaman ini.
      </Text>
    </View>
  )
}

export default NoAccessView

const styles = StyleSheet.create({
  center: {alignSelf: 'center', marginTop: 32},
  emptyImage: {width: wp(60), height: wp(50), marginTop: 32, resizeMode: 'contain', alignSelf: 'center'},
})
