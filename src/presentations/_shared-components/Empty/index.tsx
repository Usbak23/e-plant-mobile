import React from 'react'
import {StyleSheet, View, Image} from 'react-native'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import EmptyImage from '@assets/images/empty.svg'

import Text from '@components/Text'

const EmptyList = () => {
  return (
    <View style={styles.center}>
      <EmptyImage style={styles.emptyImage} />
      <Text size={15} style={styles.center} type="bold">
        Tidak ada data yang di tampilkan!
      </Text>
      <Text size={11} style={{textAlign: 'center', marginTop: 8}}>
        Anda tidak memiliki data pada halaman ini.
      </Text>
      <Text size={11} style={{textAlign: 'center'}}>
        Buat data baru!
      </Text>
    </View>
  )
}

export default EmptyList

const styles = StyleSheet.create({
  center: {alignSelf: 'center', marginTop: 32},
  emptyImage: {width: wp(60), height: wp(50), marginTop: 32, resizeMode: 'contain', alignSelf: 'center'},
})
