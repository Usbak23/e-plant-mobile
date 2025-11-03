import React, {useState} from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {Button, Header, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {styles} from './styles'
import * as schema from '@utils/validation/rkh-harvest-add-employee-validation'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useNavigation, useRoute} from '@react-navigation/native'
import {useRawMaterialOptions} from '@app/domain/states/raw-material/hooks'
import {useSelector} from 'react-redux'
import {RootStateType} from '@app/domain/states/store'
import {IRawMaterialRow} from '@app/models/eplant/RawMaterial'
import numberWithDot from '@app/presentations/utils/numberWithDot'

const RKHTakeCareFormAddMaterial = () => {
  const route: any = useRoute()
  const params = route?.params
  const navigation = useNavigation()
  const resolver = useYupValidationResolver(schema.rkhTakeCareItemValidationSchema)
  const materials = useRawMaterialOptions(params?.organizationId)
  const rawMaterialAll = useSelector((state: RootStateType) => state.rawMaterial?.rawMaterialAll?.data || [])
  const [material, setMaterial] = useState('')
  const materialSelected = rawMaterialAll.find((e: IRawMaterialRow) => e.id === material)

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
      id: '',
      name: '',
      qty: '',
      cost: '',
    },
  })

  const onSubmit = (form: {id: string; name: string; qty: number; cost: number}) => {
    params.onSubmit(form)
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Tambah RKH Rawat" />
      <ScrollView
        contentContainerStyle={[styles.scrollView, styles.body]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text type="semibold" size={13} style={{marginBottom: 10}}>
          Tambah Material
        </Text>

        <SelectInput
          isRequired
          items={materials}
          control={control}
          label="Material"
          placeholder="Pilih Material"
          name="id"
          errorText={errors?.id?.message}
          onChange={v => {
            const item = rawMaterialAll.find((e: IRawMaterialRow) => e.id === v)
            setMaterial(v)
            if (item) {
              setValue('name', item.name)
              setValue('cost', item.unitPrice)
            }
          }}
        />

        <TextInput
          isNumber
          control={control}
          label="Kuantitas"
          placeholder="Contoh: 12"
          name="qty"
          errorText={errors?.qty?.message}
          isRequired
        />

        <TextInput
          isCurrency
          disabled
          disabledText={numberWithDot(materialSelected?.unitPrice || 0)}
          control={control}
          label="Biaya Per Item"
          placeholder="Contoh: Rp150.000"
          name="cost"
          errorText={errors?.cost?.message}
          isRequired
        />

        <Button style={{marginBottom: 26}} onPress={handleSubmit(onSubmit)}>
          <Text color="white">Tambah Material</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RKHTakeCareFormAddMaterial
