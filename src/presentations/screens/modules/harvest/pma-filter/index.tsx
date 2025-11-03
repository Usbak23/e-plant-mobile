import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {SafeAreaView, ScrollView} from 'react-native'
import styles from '@app/presentations/screens/modules/harvest/pma-filter/styles'
import {Button, DatePicker, Header, SelectInput, Text} from '@app/presentations/_shared-components'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as schema from '@utils/validation/pma-filter-validation'
import {useOrganizationAll} from '@app/domain/states/organization/hooks'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {useDivisionsByOrganizationFull} from '@app/domain/states/division/hooks'
import {useForemanFullByDivision, useForemanHarvestFullByDivision} from '@app/domain/states/block/hooks'
import {useDispatch} from 'react-redux'
import {actions} from '@app/domain/states/store'
import {useUsersByDivisionFull} from '@app/domain/states/user/hooks'

const PMAFilter = () => {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const resolver = useYupValidationResolver(schema.pmaFilterValidationSchema)

  const [selectedOrganization, setSelectedOrganization] = useState<string | undefined>()
  const [selectedDivision, setSelectedDivision] = useState<string | undefined>()

  const organizationAll = useOrganizationAll()
  const divisions = useDivisionsByOrganizationFull(selectedOrganization)
  // const users = useUsersByOrganizationFull(selectedOrganization)
  // const users = useForemanFullByDivision(selectedDivision)

  //old
  // const users = useForemanHarvestFullByDivision(selectedDivision)
  const users = useUsersByDivisionFull(selectedDivision)

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
      organizationId: '',
      divisionId: '',
      foreman: '',
      datePMA: '',
    },
  })

  const onSubmit = () => {
    const organization = organizationAll.find(o => o.value == getValues('organizationId'))
    const division = divisions.find(d => d.id == getValues('divisionId'))
    const foreman = users.find(u => u.id == getValues('foreman'))
    const datePMA = getValues('datePMA')
    const params = {
      pmaFilterData: {
        organization,
        division,
        foreman,
        datePMA,
      },
    }

    navigation.navigate(Routes.PMA_LIST, {...params})
  }

  useEffect(() => {
    if (isFocused) {
      dispatch(actions.getAllForemanX.request({loading: true}))
    }
  }, [isFocused])
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Pemeriksaan Mutu Ancak" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <SelectInput
          isRequired
          items={organizationAll}
          control={control}
          label="Organisasi"
          placeholder="Pilih Organisasi"
          name="organizationId"
          errorText={errors?.organizationId?.message}
          onChange={v => {
            setSelectedOrganization(v)
            setValue('divisionId', '')
          }}
        />

        <SelectInput
          isRequired
          items={divisions.map(d => ({label: d.name, value: d.id}))}
          control={control}
          label="Divisi"
          placeholder="Pilih Divisi"
          name="divisionId"
          errorText={errors?.divisionId?.message}
          onChange={v => {
            setSelectedDivision(v)
            setValue('foreman', '')
          }}
        />

        <SelectInput
          isRequired
          items={users.map(u => ({label: `${u.name} - ${u.nip}`, value: u.id}))}
          control={control}
          label="Mandor"
          placeholder="Pilih Mandor"
          name="foreman"
          errorText={errors?.foreman?.message}
        />

        <DatePicker
          name="datePMA"
          control={control}
          label="Tanggal"
          placeholder="Pilih tanggal"
          errorText={errors?.datePMA?.message}
          isRequired={true}
          onChangeText={value => {
            setValue('datePMA', value, {
              shouldValidate: true,
            })
          }}
        />

        <Button onPress={handleSubmit(onSubmit)}>
          <Text color="white">Pilih PMA</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PMAFilter
