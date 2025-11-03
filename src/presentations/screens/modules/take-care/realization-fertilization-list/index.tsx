import {theme} from '@app/presentations/utils/styles'
import {
  Header,
  Loader,
  ModalAsk,
  ModalGeneral,
  SelectInput,
  SortPopup,
  Text,
} from '@app/presentations/_shared-components'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import React, {useCallback, useEffect, useState} from 'react'
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Routes from '@app/presentations/navigation/Routes'
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import RealizationFertilizationDetailInfo from './realization-fertilization-info'
import * as yup from 'yup'
import {useWatch} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import EmptyList from '@app/presentations/_shared-components/Empty'
import RealizationFertilizationCard from './realization-fertilization-card'
import {IRSRealizationFertilization} from '@app/domain/states/realization-fertilization/reducer'
import {actions, RootStateType} from '@app/domain/states/store'
import {useRawMaterialOptions} from '@app/domain/states/raw-material/hooks'
import {useSubActivityOptions} from '@app/domain/states/subactivity/hooks'
import {IEffectPayload} from '@app/domain/states/types'
import {
  IRealizationFertilizationRKTMaterial,
  IRealizationFertilizationRow,
} from '@app/models/eplant/RealizationFertilization'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'

import {RealizationFertiliationSortOptions} from './sort-menus'
import {useIsAllowedToOrganizeFertilizationRealization} from '@app/domain/states/user/hooks'
let debounceSearch: NodeJS.Timeout

const validationSchema = yup.object().shape({
  subActivityId: yup.string().required('Sub Aktivitas wajib dipilih'),
  materialId: yup.string().required('Material wajib dipilih'),
})

const RealizationFertilizationList = () => {
  const limit = 10
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const navigation: any = useNavigation()
  const routes: any = useRoute()
  const organization = routes.params?.organization
  const division = routes.params?.division
  const month = routes.params?.month
  const year = routes.params?.year
  const isAllowedToOrganize = useIsAllowedToOrganizeFertilizationRealization()

  const subActivities = useSubActivityOptions('rawat')

  const {realizationFertilzationList, formDeleteRealizationFertilization}: IRSRealizationFertilization = useSelector(
    (state: RootStateType) => state?.realizationFertilizationReducer || {},
  )
  const {data: lists, loading}: IEffectPayload = realizationFertilzationList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const isHaveRKT = Object.keys(realizationFertilzationList?.data?.rkt?.rktActivities || {}).length > 0
  const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  const materialsPupuk = getUniqueListBy(
    realizationFertilzationList?.data?.rkt?.rktActivities?.material
      ?.filter((m: IRealizationFertilizationRKTMaterial) => {
        return m?.rawMaterial?.type === 'Pupuk'
      })
      .map((m: IRealizationFertilizationRKTMaterial) => ({
        value: m?.rawMaterial?.id,
        label: m?.rawMaterial?.name,
      })) || [],
    'value',
  )

  const [query, setQuery] = useState({
    sort: '',
    search: '',
    year: year,
    month: month.value || '',
    divisionId: division?.value || '',
    materialId: '',
    subActivityId: '',
  })

  const resolver = useYupValidationResolver(validationSchema)

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      subActivityId: '',
      materialId: '',
    },
  })

  const [selectedItem, setSelectedItem] = useState<IRealizationFertilizationRow | undefined>()
  const [isModalVarietasOpen, setModalVarietasOpen] = useState<IRealizationFertilizationRow | undefined>()

  const subActivityWatcher = useWatch({
    control: control,
    name: 'subActivityId',
    defaultValue: control._defaultValues.subActivityId || '',
  })

  const materialIdWatcher = useWatch({
    control: control,
    name: 'materialId',
    defaultValue: control._defaultValues.materialId || '',
  })

  const handleSearch = (q: string) => {
    setQuery({...query, search: q})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, search: q, page: 1, limit})
    }, 400)
  }

  const handleSort = (v: string) => {
    const newState = {...query, sort: v}
    setQuery(newState)
    getData({...newState, page: 1, limit})
  }

  const handleDelete = () => {
    if (selectedItem) {
      dispatch(actions.deleteRealizationFertilization.request({loading: true, data: selectedItem?.id}))
    }
    setSelectedItem(undefined)
  }

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      <SortPopup onSelect={handleSort} options={RealizationFertiliationSortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const MenuButton = () => (
    <Menu>
      <MenuTrigger>
        <View style={{padding: 10}}>
          <AntDesign name="filter" size={14} color={theme.colors.textThinBlack} />
        </View>
      </MenuTrigger>
      {cardOptions()}
    </Menu>
  )

  const onVarietyTap = (i: IRealizationFertilizationRow) => {
    setModalVarietasOpen(i)
  }

  const renderItem = ({item, index}: any) => {
    return (
      <RealizationFertilizationCard
        item={item}
        key={index}
        onVarietasTap={() => {
          onVarietyTap(item)
        }}
        onTap={() => {
          navigation.navigate(Routes.REALIZATION_FERTILIZATION_DETAIL, {
            parent: {organization, division, month, year},
            item,
          })
        }}
        onPopupDelete={() => {
          setSelectedItem(item)
        }}
        onPopupEdit={() => {
          navigation.navigate(Routes.REALIZATION_FERTILIZATION_FORM, {
            isEdit: true,
            item: {...item},
            parent: {organization, division, month, year: year},
            rkt: isHaveRKT ? realizationFertilzationList?.data?.rkt : undefined,
            selectedSubActivity: {
              id: getValues('subActivityId'),
              name: subActivities.find(s => s.value == getValues('subActivityId'))?.label,
            },
            selectedMaterial: {
              id: getValues('materialId'),
              name: materialsPupuk.find(s => s.value == getValues('materialId'))?.label,
            },
          })
        }}
      />
    )
  }

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }

    getData({...query, page: nextPage, limit})
  }

  const getData = useCallback(data => {
    dispatch(
      actions.getRealizationFertilizationList.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const refreshData = useCallback(() => {
    if (subActivityWatcher != '') {
      getData({...query, page: 1, limit})
    }
  }, [query])

  useEffect(() => {
    if (subActivityWatcher != '') {
      setQuery({...query, materialId: materialIdWatcher, subActivityId: subActivityWatcher})
      getData({...query, materialId: materialIdWatcher, subActivityId: subActivityWatcher, limit, page: 1})
    }
  }, [materialIdWatcher, subActivityWatcher, isFocused])

  useEffect(() => {
    dispatch(actions.getSubActivityAll.request({loading: true}))
    dispatch(actions.getRawMaterialAll.request({loading: true}))
  }, [])

  useEffect(() => {
    const error = formDeleteRealizationFertilization?.error
    if (error) {
      showErrorToast(error?.message || 'Gagal menghapus permintaan')
    }
    setSelectedItem(undefined)
  }, [formDeleteRealizationFertilization?.error])

  useEffect(() => {
    setSelectedItem(undefined)
    const data = formDeleteRealizationFertilization?.data?.data
    if (data?.code == 200) {
      refreshData()
      showSuccessToast('Permintaan berhasil dihapus')
    }
  }, [formDeleteRealizationFertilization?.data])

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={handleDelete}
      isDanger
      isOpen={selectedItem != undefined}
      onTouchOutside={() => setSelectedItem(undefined)}
      title={'Anda yakin ingin menghapus data?'}
      description={'Menghapus data di dalamnya membuat data tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Realisasi Pemupukan" />
      <ModalGeneral
        title={'Varietas'}
        description={isModalVarietasOpen?.block?.varieties ? isModalVarietasOpen?.block?.varieties?.join(', ') : '-'}
        isOpen={isModalVarietasOpen != undefined}
        onTouchOutside={() => setModalVarietasOpen(undefined)}
      />
      <View style={[styles.container]}>
        <View style={styles.wrapSearch}>
          <TextInput
            placeholderTextColor={theme.colors.darkGray}
            value={query.search}
            onChangeText={handleSearch}
            placeholder="Masukkan kata kunci"
            style={[styles.searhInput]}
          />
          <View style={styles.icon}>
            <AntDesign name="search1" size={14} color={theme.colors.textThinBlack} />
          </View>
        </View>

        <TouchableOpacity onPress={() => {}} style={styles.button}>
          <MenuButton />
        </TouchableOpacity>
        {isAllowedToOrganize && (
          <TouchableOpacity
            onPress={() => {
              if (loading) {
                showInfoToast('Sedang memuat data...')
                return
              }

              if (subActivityWatcher == '' || materialIdWatcher == '') {
                showErrorToast('Pilih sub aktivitas dan material terlebih dahulu')
                return
              }
              navigation.navigate(Routes.REALIZATION_FERTILIZATION_FORM, {
                parent: {organization, division, month, year: year},
                rkt: isHaveRKT ? realizationFertilzationList?.data?.rkt : undefined,
                selectedSubActivity: {
                  id: getValues('subActivityId'),
                  name: subActivities.find(s => s.value == getValues('subActivityId'))?.label,
                },
                selectedMaterial: {
                  id: getValues('materialId'),
                  name: materialsPupuk.find(s => s.value == getValues('materialId'))?.label,
                },
              })
            }}
            style={styles.button}>
            <AntDesign name="plus" size={14} color={theme.colors.textThinBlack} />
          </TouchableOpacity>
        )}
      </View>

      <View style={{flex: 1, paddingHorizontal: 16}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1, paddingRight: 4}}>
            <SelectInput
              containerStyle={{overflow: 'hidden'}}
              hideLabel={true}
              isRequired
              errorText={errors?.subActivityId?.message}
              control={control}
              name={'subActivityId'}
              placeholder="Pilih sub aktivitas"
              items={subActivities}
              onChange={v => {
                setValue('materialId', '')
              }}
            />
          </View>

          <View style={{flex: 1, paddingLeft: 4}}>
            <SelectInput
              hideLabel={true}
              isRequired
              errorText={errors?.materialId?.message}
              control={control}
              name={'materialId'}
              placeholder="Pilih material"
              items={materialsPupuk}
            />
          </View>
        </View>

        <FlatList
          ListHeaderComponent={
            <View>
              {!isHaveRKT && (
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: 8}}>
                  <Text type="semibold" color={theme.colors.redDark} size={11.5}>
                    Data yang anda pilih tidak memiliki RKT
                  </Text>
                </View>
              )}

              <RealizationFertilizationDetailInfo data={{organization, division, month, year: year}} />
            </View>
          }
          data={subActivityWatcher != '' && materialIdWatcher != '' ? docs : []}
          renderItem={renderItem}
          ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
          refreshControl={
            page === 1 ? (
              <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={refreshData} />
            ) : undefined
          }
          onEndReachedThreshold={0.5}
          onEndReached={getNextPage}
          ListEmptyComponent={EmptyList}
        />
      </View>

      <ModalDelete />
    </SafeAreaView>
  )
}

export default RealizationFertilizationList

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: 16,
  },
  filter: {
    marginVertical: 8,
  },
  container: {
    padding: 8,
    marginHorizontal: 10,

    flexDirection: 'row',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.6)',
  },
  footerButton: {
    marginHorizontal: 8,
  },
})
