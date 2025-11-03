import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Text} from '@app/presentations/_shared-components'

const PMAPreviewInfo = ({organization, division, foreman, datePMA}: any) => (
  <>
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text size={13} type="semibold">
          Tanggal:
        </Text>
        <View style={{flex: 1}}>
          <Text size={13} type="semibold" style={{marginLeft: 8}}>
            {datePMA || '-'}
          </Text>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text size={13} type="semibold">
          Organisasi:
        </Text>
        <View style={{flex: 1}}>
          <Text size={13} type="semibold" style={{marginLeft: 8}}>
            {organization?.label || '-'}
          </Text>
        </View>
      </View>
    </View>
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text size={13} type="semibold">
          Mandor:
        </Text>
        <View style={{flex: 1}}>
          <Text size={13} type="semibold" style={{marginLeft: 8}}>
            {`${foreman?.name || ''} - ${foreman?.nip || ''}`}
          </Text>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text size={13} type="semibold">
          Divisi:
        </Text>
        <View style={{flex: 1}}>
          <Text size={13} type="semibold" style={{marginLeft: 8}}>
            {division?.name || '-'}
          </Text>
        </View>
      </View>
    </View>
  </>
)

export default PMAPreviewInfo

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    justifyContent: 'center',
    flexDirection: 'row',
  },
})
