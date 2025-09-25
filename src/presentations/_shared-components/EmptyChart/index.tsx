import React from 'react'
import {StyleSheet, View, Image} from 'react-native'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import EmptyImage from '@assets/images/empty.svg'

import Text from '@components/Text'

const EmptyChart = () => {
  return (
    <View style={styles.center}>
      <EmptyImage style={styles.emptyImage} />
      <Text size={15} style={styles.center} type="bold">
        Tidak ada chart yang ditampilkan
      </Text>
      <Text size={11} style={{textAlign: 'center', marginTop: 8}}>
        Pastikan anda memilih organisasi dan divisi terlebih dahulu.
      </Text>
      <Text size={11} style={{textAlign: 'center'}}>
        Gunakan tombol di pojok kanan atas untuk memulai
      </Text>
    </View>
  )
}

export default EmptyChart

const styles = StyleSheet.create({
  center: {alignSelf: 'center', marginTop: 32},
  emptyImage: {width: wp(60), height: wp(50), marginTop: 32, resizeMode: 'contain', alignSelf: 'center'},
})
