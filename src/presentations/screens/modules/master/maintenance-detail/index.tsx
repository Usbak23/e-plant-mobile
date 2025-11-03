import {actions, RootStateType} from '@app/domain/states/store'
import {IItemRow} from '@app/models/eplant/Item'
import {IMaintenance, IMaintenanceMaterial} from '@app/models/eplant/Maintenance'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import {theme} from '@app/presentations/utils/styles'
import {Header, Text} from '@app/presentations/_shared-components'
import {showErrorToast} from '@app/presentations/_shared-components/Toast'
import {useRoute} from '@react-navigation/native'
import moment from 'moment'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native'
import {Table, Row, TableWrapper} from 'react-native-table-component'
import {useDispatch, useSelector} from 'react-redux'

const widthArr = [150, 150, 150, 150]
const tHeader = ['Nama\nMaterial', 'Kuantitas', 'Biaya Per\nSatuan', 'Total Biaya']
const MaintenanceDetail = () => {
  const dispatch = useDispatch()
  const route: any = useRoute()
  const item: IItemRow | undefined = route.params?.item
  const maintenance: IMaintenance | undefined = route.params?.maintenance

  const {maintenanceDetail} = useSelector((state: RootStateType) => state?.maintenanceReducer)

  const LABELS = [
    {
      label: 'Item Kategori',
      value: item?.itemMaster?.categoryItem?.name,
    },
    {
      label: 'Master Item',
      value: item?.itemMaster?.name,
    },
    {
      label: 'Organisasi',
      value: item?.organization?.name,
    },
    {
      label: 'Model',
      value: item?.model,
    },
    {
      label: 'Tahun Pembelian',
      value: item?.yearOfPurchase,
    },
    {
      label: 'Penanggung Jawab',
      value: item?.personResponsible?.name + ' - ' + item?.personResponsible?.nip,
    },
    {
      label: 'Tanggal',
      value: moment(maintenance?.date).format('DD MMMM YYYY'),
    },
    {
      label: 'Waktu',
      value: maintenance?.time,
    },
    {
      label: 'Kode Kegiatan',
      value: maintenance?.subActivity?.accountNumber,
    },
    {
      label: 'Nama Kegiatan',
      value: maintenance?.subActivity?.name,
    },
    {
      label: 'Keterangan',
      value: maintenance?.description,
    },
    {
      label: 'Karyawan',
      value: maintenance?.user?.name,
    },
  ]

  // useEffect(() => {
  //   const data = maintenanceDetail?.data
  //   if (data?.materials) {
  //     setMaterials(data?.materials || [])

  //   }
  // }, [maintenanceDetail?.data])

  useEffect(() => {
    dispatch(actions.getMaintenanceDetail.request({loading: true, data: maintenance?.id}))
  }, [])

  useEffect(() => {
    const error = maintenanceDetail?.error
    if (error) {
      showErrorToast('Tidak dapat mengambil detail maintenance. Periksa internet anda')
    }
  }, [maintenanceDetail?.error])

  const TABLE_DATA =
    maintenanceDetail?.data?.materials?.map((m: IMaintenanceMaterial) => [
      m?.material?.name || '-',
      m?.qty.toString(),
      `Rp${numberWithDot((m?.price || 0).toFixed(2))}`,
      `Rp${numberWithDot((m?.totalPrice || 0).toFixed(2))}`,
    ]) || []


  const LabelValue = (item: {label: string; value?: string | number}) => (
    <View style={styles.row}>
      <View style={{flex: 1, flexGrow: 1}}>
        <Text color={theme.colors.grey}>{item?.label || '-'}</Text>
      </View>
      <View style={{flex: 1, marginStart: 8, flexGrow: 2.5}}>
        <Text>: {item?.value != undefined ? item?.value : '-'}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Maintenance" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <Text style={{marginBottom: 16}} type="semibold" color={theme.colors.yellowDark}>
          {item?.name || '-'} - {item?.serialNumber || '-'}
        </Text>
        {LABELS.map((l, i) => (
          <LabelValue key={i} label={l.label} value={l.value} />
        ))}

        {Boolean(Array.isArray(maintenanceDetail?.data?.materials) && maintenanceDetail?.data?.materials?.length > 0) && (
          <>
            <Text style={{marginVertical: 16}} type="semibold">
              Rincian Biaya Material
            </Text>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={styles.tableViewContainer}>
                <View>
                  <Table borderStyle={{}}>
                    <Row
                      widthArr={widthArr}
                      data={tHeader}
                      style={styles.tableHeader}
                      textStyle={styles.tableHeaderText}
                    />
                  </Table>
                  <ScrollView>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                      {TABLE_DATA?.map((rowData, index) => {
                        return (
                          <Row
                            key={index}
                            data={rowData}
                            widthArr={widthArr}
                            style={{backgroundColor: theme.colors.pureWhite}}
                            textStyle={styles.tableRow}
                          />
                        )
                      })}

                      <TableWrapper>
                        <Row
                          key={TABLE_DATA?.length}
                          data={[
                            'Total Biaya',
                            `Rp${numberWithDot(
                              (
                                maintenanceDetail?.data?.materials?.reduce((acc, cur) => acc + cur?.totalPrice || 0, 0) || 0
                              ).toFixed(2),
                            )}`,
                          ]}
                          widthArr={[450, 150]}
                          style={{backgroundColor: theme.colors.lightGrey}}
                          textStyle={styles.tableRow}
                        />
                      </TableWrapper>
                    </Table>
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default MaintenanceDetail

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 4,
  },
  tableViewContainer: {
    marginTop: 16,
    marginBottom: 1,
  },
  tableHeader: {
    height: 40,
    backgroundColor: theme.colors.lightGrey,
  },
  tableHeaderText: {
    fontWeight: '700',
    padding: 10,
    alignSelf: 'center',
  },
  tableRow: {
    padding: 8,
    alignSelf: 'center',
  },
})
