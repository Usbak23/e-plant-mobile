import {IRealizationFertilizationRow} from '@app/models/eplant/RealizationFertilization'
import {theme} from '@app/presentations/utils/styles'
import {Header, Text} from '@app/presentations/_shared-components'
import {useRoute} from '@react-navigation/native'
import moment from 'moment'
import React from 'react'
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native'

const RealizationFertilizationDetail = () => {
  const route: any = useRoute()
  const item: IRealizationFertilizationRow = route?.params?.item

  const labels = [
    {
      label: 'Tahun Tanam',
      value: item?.block?.plantingYear?.join(', ') || '-',
    },
    {
      label: 'Ha',
      value: item?.block?.blockArea || '-',
    },
    {
      label: 'Pokok',
      value: item?.block?.totalTree || '-',
    },
    {
      label: 'SPH',
      value: isNaN(item?.block?.totalTree / item?.block?.blockArea)
        ? '-'
        : parseFloat(item?.block?.totalTree / item?.block?.blockArea).toFixed(2),
    },
    {
      label: 'Varietas',
      value: item?.block?.varieties?.join(', ') || '-',
    },
    {
      label: 'Rotasi',
      value: item?.rotation || '-',
    },
    {
      label: 'Tanggal Aplikasi',
      value: moment(item?.date).format('DD MMMM YYYY') || '-',
    },
    {
      label: 'Rencana Kg/Pokok',
      value: parseFloat(item?.planKgPerPokok).toFixed(2) || '-',
    },
    {
      label: 'Realisasi Kg/Pokok',
      value: item?.realizationKgPerPokok || '-',
    },
    {
      label: 'Rencana Tonase',
      value: item?.planTonnage || '-',
    },
    {
      label: 'Realisasi Tonase',
      value: item?.realizationTonnage != undefined ? item?.realizationTonnage.toFixed(2) : '-',
    },
  ]

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Realisasi Pemupukan" />
      <ScrollView contentContainerStyle={{paddingBottom: 56}} style={styles.scrollView}>
        <Text color={theme.colors.accent} type="semibold" size={14}>
          {item?.block?.code || '-'}
        </Text>
        <View style={{flex: 1, marginTop: 16}}>
          {labels.map((label, index) => (
            <View style={{flexDirection: 'row', marginVertical: 4}}>
              <View style={{flex: 1, marginRight: 4}}>
                <Text color={theme.colors.darkGray}>{label?.label}:</Text>
              </View>

              <View style={{flex: 1, marginStart: 8}}>
                <Text>{label?.value || '-'}</Text>
              </View>
            </View>
          ))}

          <View style={{flexDirection: 'row', marginVertical: 4, alignItems: 'center'}}>
            <View style={{flex: 1, marginRight: 4}}>
              <Text color={theme.colors.darkGray}>Status:</Text>
            </View>

            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
                marginStart: 8,
              }}>
              <Text
                style={{
                  borderRadius: 8,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  backgroundColor:
                    item?.realizationTonnage - item?.planTonnage == 0 ? theme.colors.lightGreen : theme.colors.redDark,
                }}>
                {parseFloat(item?.realizationTonnage - item?.planTonnage || '0').toFixed(2) || '0'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RealizationFertilizationDetail

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    padding: 16,
  },
})
