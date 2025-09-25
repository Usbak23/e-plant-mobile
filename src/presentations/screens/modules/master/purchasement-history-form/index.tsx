import {Button, DatePicker, Header, Loader, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/core'
import React, {useEffect} from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {styles} from './styles'
import {useForm} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as schema from '@utils/validation/purchasement-history-validation'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'
import {IRawPurchasementHistoryFormData} from '@app/models/eplant/RawMaterial'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {dateFormatter} from '@app/presentations/utils/dateFormatter'

const PurchasementHistoryForm = () => {
  const dispatch = useDispatch()
  const route: any = useRoute()
  const rawMaterial = route?.params?.rawMaterial
  const item = route?.params?.item
  const isEdit = Boolean(item?.id)
  const navigation: any = useNavigation()
  const resolver = useYupValidationResolver(schema.purchasementHistoryCreatelValidationSchema)
  const rawMaterialDetail = useSelector((state: RootStateType) => state.rawMaterial.rawMaterialDetail)

  const {formPurchasementHistoryStatus} = useSelector((state: RootStateType) => state.rawMaterial)

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
      rawMaterialId: rawMaterial?.id || '',
      id: item?.id,
      qty: item?.qty?.toString() || '',
      price: item?.price != undefined ? item.price.toString() : '',
      purchaseOrder: item?.purchaseOrder || '',
      date: item?.date ? dateFormatter(item?.date) : '',
    },
  })

  const onSubmit = (req: IRawPurchasementHistoryFormData) => {
    if (isEdit) {
      dispatch(actions.editPurchasementHistory.request({loading: true, data: req}))
      return
    }
    dispatch(actions.createPurchasementHistory.request({loading: true, data: req}))
  }

  useEffect(() => {
    const error = formPurchasementHistoryStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formPurchasementHistoryStatus?.error])

  useEffect(() => {
    const data = formPurchasementHistoryStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Success')
      navigation.goBack()
    }
  }, [formPurchasementHistoryStatus?.data])

  useEffect(() => {
    dispatch(actions.getRawMaterialDetail.request({loading: true, data: rawMaterial?.id}))
  }, [])

  const HeaderView = () => <Header title={isEdit ? 'Ubah Riwayat Pembelian' : 'Tambah Riwayat Pembelian'} />
  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <Loader loading={Boolean(formPurchasementHistoryStatus?.loading)} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <TextInput
          disabled
          disabledText={rawMaterialDetail?.data?.type || '-'}
          control={control}
          label="Kategori Material"
          placeholder="Kategori Material"
          name="type"
          isRequired
        />

        <TextInput
          disabled
          disabledText={rawMaterialDetail?.data?.name}
          control={control}
          label="Nama Material"
          placeholder="Contoh: Pupuk HCL"
          name="name"
          isRequired
        />

        <TextInput
          disabled
          disabledText={rawMaterialDetail?.data?.code}
          control={control}
          label="Kode Material"
          placeholder="Contoh: HCL016"
          name="code"
          isRequired
        />

        <SelectInput
          disabled={true}
          disabledText={rawMaterialDetail?.data?.organization?.name}
          isRequired
          items={[]}
          control={control}
          label="Nama Organisasi"
          placeholder="Pilih organisasi"
          name="organization"
          key="organization"
        />

        <TextInput
          disabled
          disabledText={rawMaterialDetail?.data?.location}
          control={control}
          label="Lokasi"
          placeholder="Contoh: Gudang PT.PAL"
          name="location"
          isRequired
        />

        <SelectInput
          disabled={true}
          disabledText={rawMaterialDetail?.data?.uom?.name}
          isRequired
          items={[]}
          control={control}
          label="Satuan"
          placeholder="Pilih satuan"
          name="piece"
          key="piece"
        />

        <TextInput
          isCurrency={true}
          control={control}
          label="Harga"
          placeholder="Rp.500.000"
          name="price"
          errorText={errors?.price?.message}
          isRequired
        />

        <TextInput
          isNumber
          control={control}
          label="Jumlah"
          placeholder="Contoh: 100"
          name="qty"
          errorText={errors?.qty?.message}
          isRequired
        />

        <TextInput
          control={control}
          label="No. Purchase Order"
          placeholder="Contoh: PE-012"
          name="purchaseOrder"
          errorText={errors?.purchaseOrder?.message}
          isRequired
        />

        <DatePicker
          maximumDate={new Date()}
          control={control}
          name="date"
          label="Tanggal Pembelian"
          placeholder="Pilih tanggal"
          value={getValues('date') || ''}
          errorText={errors?.date?.message}
          isRequired={true}
          onChangeText={value => {
            setValue('date', value, {
              shouldValidate: true,
            })
          }}
          // setDateValue={'2021-12-31'}
        />
        <Button style={{marginBottom: 26}} onPress={handleSubmit(onSubmit)}>
          <Text color="white">{isEdit ? 'Ubah Riwayat Pembelian' : 'Tambah Riwayat Pembelian'}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PurchasementHistoryForm
