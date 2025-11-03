import React, {useState} from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {Button, Header, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {styles} from './styles'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useNavigation, useRoute} from '@react-navigation/native'
import {useRawMaterialOptions} from '@app/domain/states/raw-material/hooks'
import {useSelector} from 'react-redux'
import {RootStateType} from '@app/domain/states/store'
import {IRawMaterialRow} from '@app/models/eplant/RawMaterial'
import * as yup from 'yup'
import {showErrorToast} from '@app/presentations/_shared-components/Toast'
import Routes from '@app/presentations/navigation/Routes'

const validationSchema = yup.object().shape({
  materialId: yup.string().required('Material Wajib diisi'),
  qty: yup
    .number()
    .required('Jumlah Material wajib diisi')
    .min(1, 'Minimal Jumlah Material adalah satu (1)')
    .typeError('Jumlah Material tidak valid'),
})

const BKMTakeCareFormAddMaterial = () => {
  const route: any = useRoute()
  const params = route?.params
  const navigation: any = useNavigation()
  const resolver = useYupValidationResolver(validationSchema)
  const materials = useRawMaterialOptions(params?.bkmData?.organization?.id)
  const rawMaterialAll = useSelector((state: RootStateType) => state.rawMaterial?.rawMaterialAll?.data || [])
  const isEdit = Boolean(params?.material?.materialId)
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
      blockId: params?.blockId,
      materialId: params?.material?.materialId || '',
      name: params?.material?.name,
      qty: params?.material?.qty?.toString(),
    },
  })

  const onSubmit = (form: {materialId: string; name: string; qty: number; cost: number}) => {
    const found = params?.bkmMaterials
      ?.filter((e: any) => e.materialId !== params?.material?.materialId)
      .find((item: any) => item.materialId === form.materialId)
    if (found) {
      showErrorToast(found?.name + ' sudah ada di Block ini')
      return
    }
    params.onSubmit(form)
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah Material' : 'Tambah Material'} />
      <ScrollView contentContainerStyle={[styles.scrollView, styles.body]} showsVerticalScrollIndicator={false}>
        <SelectInput
          isRequired
          items={materials}
          control={control}
          label="Material"
          placeholder="Pilih Material"
          noItemsText={'Tidak ada material di organisasi ' + params?.bkmData?.organization?.name}
          name="materialId"
          errorText={errors?.materialId?.message}
          disabled={isEdit}
          disabledText={params?.material?.name}
          onChange={v => {
            const item = rawMaterialAll.find((e: IRawMaterialRow) => e.id === v)
            if (item) {
              setValue('name', item.name)
            }
          }}
        />

        <TextInput
          isNumber
          control={control}
          label="Jumlah Material/Satuan"
          placeholder="Contoh: 12"
          name="qty"
          errorText={errors?.qty?.message}
          isRequired
        />

        <Button style={{marginBottom: 26}} onPress={handleSubmit(onSubmit)}>
          <Text color="white">{isEdit ? 'Ubah Material' : 'Tambah Material'}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BKMTakeCareFormAddMaterial
