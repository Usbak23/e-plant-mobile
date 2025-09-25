import React from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {Button, Header, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'
import {styles} from './styles'
import * as schema from '@utils/validation/rkh-harvest-add-employee-validation'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useNavigation, useRoute} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {useRoles} from '@app/domain/states/role/hooks'
import {useUsersCostByRoleId} from '@app/domain/states/user/hooks'
import {useWatch} from 'react-hook-form'

const RKHHarvestFormAddEmployee = () => {
  const route: any = useRoute()
  const headtitle = route.params?.title || 'Lengkapi RKH Panen'
  const isRawat = route.params?.title ? true : false
  const orgId = route?.params?.organizationId
  const previousPage = route.params?.previousPage
  const navigation = useNavigation()
  const resolver = useYupValidationResolver(schema.rkhHarvestEmployeeValidationSchema)
  const roles = useRoles(orgId, isRawat ? 'Rawat' : 'Panen')

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
      typeEmployeeId: '',
      name: '',
      qty: '',
      cost: '',
      // 353
      roleCategory: [],
    },
  })

  const roleWatcher = useWatch({control: control, name: 'id', defaultValue: ''})
  const typeEmployees = useUsersCostByRoleId(roleWatcher)

  const constructTypeEmployees = () => {
    const types = typeEmployees.map(employee => ({id: employee.typeEmployee.id, name: employee.typeEmployee.name}))
    const key = 'id'
    const arrayUniqueByKey = [...new Map(types.map(item => [item[key], item])).values()]
    return arrayUniqueByKey.map(type => ({label: type.name, value: type.id}))
  }

  const onSubmit = (form: any) => {
    //@ts-ignore
    route?.params?.onSubmit(form)
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title={headtitle} />
      <ScrollView contentContainerStyle={[styles.scrollView, styles.body]} showsVerticalScrollIndicator={false}>
        <Text type="semibold" size={13} style={{marginBottom: 10}}>
          Tambah Tenaga Kerja
        </Text>
        <SelectInput
          isRequired
          items={roles}
          control={control}
          label="Tenaga Kerja"
          placeholder="Pilih Tenaga Kerja"
          name="id"
          errorText={errors?.id?.message}
          onChange={v => {
            const role = roles.find(r => r.value == v)
            if (role) {
              setValue('name', role.label)
              setValue('roleCategory', role.roleCategory)
              setValue('typeEmployeeId', '')
            }
          }}
        />

        <SelectInput
          isRequired
          items={constructTypeEmployees()}
          control={control}
          label="Tipe Karyawan"
          placeholder="Pilih Tipe Karyawan"
          name="typeEmployeeId"
          errorText={errors?.typeEmployeeId?.message}
          onChange={v => {
            const item = constructTypeEmployees().find(r => r.value == v)
            setValue('typeEmployeeId', v)
            setValue('typeEmployeeName', item?.label)
          }}
        />
        <Button
          style={{marginBottom: 26}}
          onPress={() => {
            if (getValues('id') && getValues('typeEmployeeId')) {
              //@ts-ignore
              navigation.navigate(Routes.RKH_LIST_EMPLOYEE, {
                title: 'Lengkapi RKH Panen',
                roleId: getValues('id') || '',
                typeEmployee: getValues('typeEmployeeId') || '',
              })
            }
          }}>
          <Text color="white">Lihat Biaya Karyawan</Text>
        </Button>
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
          label="Biaya Per HK"
          placeholder="Contoh: Rp150.000"
          name="cost"
          errorText={errors?.cost?.message}
          isRequired
        />
        <Button style={{marginBottom: 26}} onPress={handleSubmit(onSubmit)}>
          <Text color="white">Tambah Tenaga Kerja</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RKHHarvestFormAddEmployee
