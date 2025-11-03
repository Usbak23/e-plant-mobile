import React, {useCallback, useEffect, useState} from 'react'
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import {Header, Text} from '@app/presentations/_shared-components'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {useRoute} from '@react-navigation/native'
import {showErrorToast} from '@app/presentations/_shared-components/Toast'
import {Table, Row} from 'react-native-table-component'
import {IRKBMaterialMaterial} from '@app/models/eplant/RKBMaterialTable'

let debounceSearch: NodeJS.Timeout

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const tHeader = ['Nama Material', 'Jumlah Material\nRencana', 'Jumlah Material\nRealisasi']

const SeeMaterialRKBTakeCare = () => {
  const dispatch = useDispatch()
  const routes: any = useRoute()
  const params: any = routes?.params

  const [dimensions, setDimensions] = useState({window, screen})
  const [query, setQuery] = useState({
    search: '',
    subActivityId: params?.subActivityId || '',
    blockId: params?.blockId || '',
    month: params?.month || '',
    year: params?.year || '',
  })
  const rkbMaterial = useSelector((state: RootStateType) => state.dashboardAndChart?.rkbMaterial)

  const constructTableRow = () => {
    const temps: any = []
    const datas = rkbMaterial?.data?.data?.response?.material || []
    datas?.forEach((element: IRKBMaterialMaterial) => {
      const t = []
      t.push(element.materialName || '-')
      t.push(element.qtyPlanning || '-')
      t.push(element.qtyRealization || '-')
      temps.push(t)
    })
    return temps
  }

  const getData = useCallback(data => {
    dispatch(actions.getRKBMaterialTable.request({loading: true, data: {...data}}))
  }, [])

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window, screen}) => {
      setDimensions({window, screen})
    })
    return () => subscription?.remove()
  })

  useEffect(() => {
    const obj = {
      subActivityId: params?.subActivityId || '',
      blockId: params?.blockId || '',
      month: params?.month || '',
      year: params?.year || '',
    }
    getData(obj)
  }, [])

  useEffect(() => {
    if (rkbMaterial?.error?.code == 400) {
      showErrorToast(rkbMaterial?.error?.message || 'Kesalahan saat meminta data ke server')
    }
  }, [rkbMaterial?.error])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Lap. Material RKB Rawat" />
      <ScrollView style={{padding: 16}}>
        <Text type="semibold">{`${rkbMaterial?.data?.data?.response?.subActivity?.name || ''} - ${
          rkbMaterial?.data?.data?.response?.block?.code || ''
        }`}</Text>

        <View style={{marginTop: 16}}>
          <Table borderStyle={{borderWidth: 1, borderColor: theme.colors.grey}}>
            <Row data={tHeader} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
          </Table>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            {constructTableRow().map((d: any, i: number) => (
              <Row key={i} data={d} textStyle={styles.tableRow} />
            ))}
          </Table>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SeeMaterialRKBTakeCare

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  webView: {
    resizeMode: 'cover',
    flex: 1,
  },
  filterInput: {
    marginVertical: -16,
  },
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
  },
  tableHeader: {
    // height: 40,
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
  searhInput: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    color: theme.colors.textThinBlack,
    height: 40,
    width: '100%',
    flex: 1,
    paddingLeft: 35,
  },
  icon: {
    position: 'absolute',
    left: 11,
    top: 14,
  },
  button: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    height: 40,
    width: 40,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapSearch: {flex: 1, flexDirection: 'row'},
  regularInput: {
    marginTop: 8,
    color: theme.colors.textThinBlack,
    borderColor: theme.colors.defaultBorderColor,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 16,
    fontStyle: 'italic',
    fontSize: 13,
    alignSelf: 'stretch',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
  },
})
