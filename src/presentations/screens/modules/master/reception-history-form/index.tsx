import {Button, DatePicker, Header, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/core'
import React, {useEffect} from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {styles} from './styles'
import {useForm} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as schema from '@utils/validation/reception-history-validation'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'
import {actions, RootStateType} from '@domain/states/store'
import {useDispatch, useSelector} from 'react-redux'
import {IRawReceptionHistoryFormData} from '@app/models/eplant/RawMaterial'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {dateFormatter} from '@app/presentations/utils/dateFormatter'

const ReceptionHistoryForm = () => {
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const item = route.params?.item
  const isEdit = Boolean(route.params?.isEdit)
  const rawMaterial = route.params?.rawMaterial
  const rawMaterialDetail = useSelector((state: RootStateType) => state.rawMaterial.rawMaterialDetail)

  const resolver = useYupValidationResolver(schema.receptionHistoryValidationSchema)
  const {formReceptionHistoryStatus} = useSelector((state: RootStateType) => state.rawMaterial)

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
      id: item?.id,
      qtyAccepted: isEdit ? item?.qtyAccepted.toString() : item?.qty?.toString(),
      dateAccepted: isEdit ? dateFormatter(item?.dateAccepted) : '',
    },
  })

  const onSubmit = (req: IRawReceptionHistoryFormData) => {
    dispatch(actions.editReceptionHistory.request({loading: true, data: req}))
  }

  const parseToMinimumDate = () => {
    const datePurchased = dateFormatter(item.date)
    if (datePurchased) {
      return new Date(datePurchased)
    }
    return undefined
  }

  useEffect(() => {
    dispatch(actions.getRawMaterialDetail.request({loading: true, data: rawMaterial?.id}))
  }, [])

  useEffect(() => {
    const error = formReceptionHistoryStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formReceptionHistoryStatus?.error])

  useEffect(() => {
    const data = formReceptionHistoryStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast(` ${isEdit ? 'Successfully edited' : 'Successfully added'}`)
      navigation.goBack()
    }
  }, [formReceptionHistoryStatus?.data])

  const HeaderView = () => <Header title={isEdit ? 'Ubah Riwayat Penerimaan' : 'Tambah Riwayat Penerimaan'} />
  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
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

        <TextInput
          disabled
          disabledText={item?.purchaseOrder}
          control={control}
          label="No. Purchase Order"
          placeholder="Contoh: PE-0001"
          name="purchaseOrder"
          isRequired
        />

        <TextInput
          disabled
          disabledText={item?.qty}
          control={control}
          label="Jumlah Pembelian"
          placeholder="Contoh: 1000"
          name="qtyBuy"
          isRequired
        />

        <SelectInput
          disabled={true}
          disabledText={rawMaterialDetail?.data?.uom?.name}
          isRequired
          items={[]}
          control={control}
          label="Satuan"
          placeholder="Pilih Satuan"
          name="piece"
          key="piece"
        />

        <TextInput
          control={control}
          label="Jumlah Diterima"
          placeholder="Contoh: 100"
          name="qtyAccepted"
          errorText={errors?.qtyAccepted?.message}
          isRequired
        />

        <DatePicker
          maximumDate={new Date()}
          minimumDate={parseToMinimumDate()}
          name="date"
          control={control}
          label="Tanggal Penerimaan"
          placeholder="Pilih tanggal"
          errorText={errors?.dateAccepted?.message}
          isRequired={true}
          value={getValues('dateAccepted') || ''}
          onChangeText={value => {
            setValue('dateAccepted', value, {
              shouldValidate: true,
            })
          }}
        />
        <Button style={{marginBottom: 26}} onPress={handleSubmit(onSubmit)}>
          <Text color="white">{isEdit ? 'Ubah Riwayat Penerimaan' : 'Tambah Riwayat Penerimaan'}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ReceptionHistoryForm
