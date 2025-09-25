import React, {useState} from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {Button, Header, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'
import {styles} from './styles'
import * as schema from '@utils/validation/rkh-harvest-add-employee-validation'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useNavigation, useRoute} from '@react-navigation/native'
import {useItemOptions} from '@app/domain/states/item/hooks'
import {categoryItems} from '../../../master/item-form'

const RKHTakeCareFormAddItem = () => {
  const route: any = useRoute()
  const params = route?.params
  const navigation = useNavigation()
  const resolver = useYupValidationResolver(schema.rkhTakeCareItemValidationSchema)
  const [typeItem, setTypeItem] = useState('Kendaraan')
  const items = useItemOptions(typeItem, params.organizationId)
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
      typeItem: 'Kendaraan',
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
      <ScrollView contentContainerStyle={[styles.scrollView, styles.body]} showsVerticalScrollIndicator={false}>
        <Text type="semibold" size={13} style={{marginBottom: 10}}>
          Tambah Alat, Perlengkapan, Transportasi
        </Text>
        <SelectInput
          control={control}
          items={categoryItems}
          label="Kategori Item"
          placeholder="Kendaraan"
          name="typeItem"
          errorText={errors?.typeItem?.message}
          onChange={v => {
            setTypeItem(v)
          }}
          isRequired
        />
        <SelectInput
          isRequired
          items={items}
          disabledClickable
          disabled={typeItem.length === 0}
          control={control}
          label="Item"
          placeholder="Pilih Item"
          name="id"
          errorText={errors?.id?.message}
          onChange={v => {
            const item = items.find(r => r.value == v)
            if (item) {
              setValue('name', item.label)
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
          control={control}
          label="Biaya Per Item"
          placeholder="Contoh: Rp150.000"
          name="cost"
          errorText={errors?.cost?.message}
          isRequired
        />

        <Button style={{marginBottom: 26}} onPress={handleSubmit(onSubmit)}>
          <Text color="white">Tambah Alat</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RKHTakeCareFormAddItem
