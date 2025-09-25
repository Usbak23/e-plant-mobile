import React, { useCallback, useEffect, useState } from 'react'
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { theme } from '@app/presentations/utils/styles'
import { Header, Text } from '@app/presentations/_shared-components'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { useRoute } from '@react-navigation/native'
import { showErrorToast } from '@app/presentations/_shared-components/Toast'
import { Table, Row } from 'react-native-table-component'
import { IBPKMaterial } from '@app/models/eplant/BPK'

const tHeader = ['Nama Material', 'Satuan', 'Jumlah', 'Dosis']
const widthArr = [150, 120, 100, 100]

const SeeMaterialBPK = () => {
  const dispatch = useDispatch()
  const routes: any = useRoute()
  const params: any = routes?.params

  const bpkMaterialReport = useSelector((state: RootStateType) => state.dashboardAndChart?.bpkMaterial)

  const constructTableRow = () => {
    const temps: any = []
    const datas = bpkMaterialReport?.data?.response?.docs || []
    datas?.forEach((element: IBPKMaterial) => {
      const t = []
      t.push(element.rawMaterialName || '-')
      t.push(element.satuanName || '-')
      t.push(element.qty != undefined ? parseFloat(element.qty.toString()).toFixed(2) : '0')
      t.push(element.dosis != undefined ? parseFloat(element.dosis.toString()).toFixed(2) : '0')
      temps.push(t)
    })
    return temps
  }

  const getData = useCallback(data => {
    dispatch(actions.getBPKMaterialReport.request({ loading: true, data: { ...data } }))
  }, [])


  useEffect(() => {
    const obj = {
      subActivityId: params?.subActivityId || '',
      organizationId: params?.organizationId || '',
      divisionId: params?.divisionId || '',
      year: params?.year || '',
      month: params?.month || '',
    }
    getData(obj)
  }, [])

  useEffect(() => {
    if (bpkMaterialReport?.error?.code == 400) {
      showErrorToast(bpkMaterialReport?.error?.message || 'Kesalahan saat meminta data ke server')
    }
  }, [bpkMaterialReport?.error])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Material BPK" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 56 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ margin: 16 }}>
        {constructTableRow().length > 0 ? (
          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.grey }}>
              <Row data={tHeader} widthArr={widthArr} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
            </Table>
            <ScrollView>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                {constructTableRow().map((d: any, i: number) => (
                  <Row widthArr={widthArr} key={i} data={d} textStyle={styles.tableRow} />
                ))}
              </Table>
            </ScrollView>
          </View>
        ) : (
          <Text>Tidak ada material</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default SeeMaterialBPK

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  tableHeader: {
    backgroundColor: theme.colors.lightGrey,
  },
  tableHeaderText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    padding: 10,
    alignSelf: 'center',
  },
  tableRow: {
    padding: 3,
    alignSelf: 'center',
  },
})
