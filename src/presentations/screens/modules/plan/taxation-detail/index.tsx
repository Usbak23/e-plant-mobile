import {actions, RootStateType} from '@app/domain/states/store'
import {dateFormatter} from '@app/presentations/utils/dateFormatter'
import {theme} from '@app/presentations/utils/styles'
import {Header, Text} from '@app/presentations/_shared-components'
import {showErrorToast} from '@app/presentations/_shared-components/Toast'
import {useRoute} from '@react-navigation/native'
import moment from 'moment'
import React, {useEffect} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

interface ITaxationDetailProps {}

const InformationView: React.FC<{title: string; data?: string}> = props => (
  <View style={styles.infoView}>
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>{props.title}</Text>
    </View>
    <View style={styles.dataView}>
      <Text> : </Text>
      <Text>{props.data || '-'}</Text>
    </View>
  </View>
)

const TaxationDetail: React.FC<ITaxationDetailProps> = props => {
  const dispatch = useDispatch()
  const routes: any = useRoute()
  const item = routes.params?.item
  const constructUserInfo = () => {
    if (item?.taxation) {
      const nip = item?.taxation?.user?.nip
      const name = item?.taxation?.user?.name
      const roleName = item?.taxation?.user?.role?.name
      return `${nip} - ${name} - ${roleName}`
    }
    return '-'
  }

  // const hax = useSelector((state: RootStateType) => state.taxation?.taxationHaRealizationDetail)
  // useEffect(() => {
  //   if (item?.id && item?.taxation != null && item?.taxation?.date) {
  //     dispatch(
  //       actions.getHaRealizationTaxationDetail.request({
  //         loading: true,
  //         data: {date: moment(item?.taxation?.date).format('YYYY-MM-DD'), akpId: item?.id},
  //       }),
  //     )
  //   }
  // }, [item?.id, item?.date])

  // useEffect(() => {
  //   const error = hax?.error
  //   if (error) {
  //     showErrorToast('Gagal mendapatkan data ha realisasi. Pastikan internet anda memadai dan coba lagi')
  //   }
  // }, [hax?.error])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Taksasi" />
      <ScrollView style={styles.scroll}>
        <Text style={{marginBottom: 16}} color={theme.colors.accent} type="semibold">
          {item?.taxation ? item?.taxation?.numberTaxation : item?.numberAkp.toString()}
        </Text>
        <InformationView
          title="Tanggal Panen"
          // data={item?.taxation ? dateFormatter(item?.taxation?.createdAt) : dateFormatter(item?.harvestDate)}
          data={dateFormatter(item?.harvestDate)}
        />
        <InformationView title="Organisasi" data={item?.block?.division?.organization?.name || '-'} />
        <InformationView title="Divisi" data={item?.block?.division?.name} />
        <InformationView
          title="% AKP"
          data={item?.taxation?.akpPercent ? `${item?.taxation?.akpPercent.toFixed(2)}%` : '-'}
        />
        <InformationView title="SPH" data={item?.sph ? `${item?.sph.toFixed(2)}` : '-'} />

        <InformationView title="Pembuat Transaksi" data={constructUserInfo()} />
        <InformationView title="Kilogram" data={item?.taxation ? item?.taxation?.kilogram.toFixed(2) : '-'} />
        <InformationView title="Kapel Panen" data={item?.taxation ? item?.taxation?.harvestChapel?.toString() : '-'} />
        <InformationView
          title="Ha Hari Ini"
          data={item?.taxation ? item?.taxation?.hectareRestOfToday?.toFixed(2) : '-'}
        />
        <InformationView
          title="Ha Esok Hari"
          data={item?.taxation ? item?.taxation?.hectareRestOfTommorow?.toFixed(2) : '-'}
        />

        <InformationView
          title="Realisasi Ha"
          data={item?.taxation?.haRealization != undefined ? `${item?.taxation?.haRealization}` : '-'}
        />

        {/* <InformationView
          title="Realisasi Ha"
          data={hax?.data != undefined && item?.taxation != null ? `${hax?.data?.haRealization}` : '-'}
        /> */}

        <InformationView title="Total Ha" data={item?.taxation ? item?.taxation?.totalHectares.toFixed(2) : '-'} />
        <InformationView title="Janjang Masak" data={item?.taxation ? item?.taxation?.ripeFruit.toFixed(2) : '-'} />
        <InformationView title="BJR" data={item?.taxation ? item?.taxation?.bjr.toString() : '-'} />
        <InformationView title="Jumlah HK" data={item?.taxation ? item?.taxation?.numberOfEmployees.toString() : '-'} />
        <InformationView title="Kilogram/HK" data={item?.taxation ? item?.taxation?.kilogramPerHk.toFixed(2) : '-'} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default TaxationDetail

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    padding: 26,
  },
  infoView: {
    marginVertical: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dataView: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  infoText: {
    color: theme.colors.grey,
  },
  infoContainer: {
    flex: 1,
    flexGrow: 0.5,
  },
})
