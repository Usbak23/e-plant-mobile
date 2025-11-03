import {useCurrentUserInfo} from '@app/domain/states/user/hooks'
import React, {useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import * as yup from 'yup'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useOrganizationOptions} from '@app/domain/states/organization/hooks'
import {useDivisionsByOrganization} from '@app/domain/states/division/hooks'
import {Button, DatePicker, Header, SelectInput, Text} from '@app/presentations/_shared-components'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {theme} from '@app/presentations/utils/styles'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import moment from 'moment'
import Routes from '@app/presentations/navigation/Routes'
import {useNavigation} from '@react-navigation/native'

let validationSchema = yup.object().shape({
  organizationId: yup.string().required('Pilih organisasi terlebih dahulu'),
  divisionId: yup.string().required('Pilih divisi terlebih dahulu'),
  date: yup.string().required('Pilih tanggal panen terlebih dahulu'),
})

const TaxationFilter = () => {
  const navigation: any = useNavigation()
  const currentUser = useCurrentUserInfo()
  const resolver = useYupValidationResolver(validationSchema)
  const [organization, setOrganization] = useState('')
  const organizations = useOrganizationOptions()
  const divisions = useDivisionsByOrganization(organization)

  const {
    handleSubmit,
    control,
    setValue,
    formState: {errors},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      organizationId: '',
      divisionId: '',
      date: '',
    },
  })

  const submitForm = (data: any) => {
    const org = organizations.find(o => o?.value == data.organizationId)
    const div = divisions.find(d => d?.value == data.divisionId)
    const obj = {
      organization: org,
      division: div,
      date: data.date,
    }
    // @ts-ignore
    navigation.navigate(Routes.TAXATION_LIST, {...obj})
  }

  const HeaderView = () => <Header title="Taksasi" />

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderView />
      <ScrollView
        contentContainerStyle={{paddingBottom: 56}}
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <SelectInput
          items={organizations}
          control={control}
          label="Organisasi"
          placeholder="Pilih Organisasi"
          name="organizationId"
          key="organization"
          errorText={errors?.organizationId?.message}
          onChange={v => {
            setOrganization(v)
          }}
          isRequired
        />
        <SelectInput
          items={divisions}
          control={control}
          label="Divisi"
          placeholder="Pilih Divisi"
          name="divisionId"
          key="division"
          errorText={errors?.divisionId?.message}
          isRequired
        />

        <DatePicker
          name="date"
          control={control}
          label="Tanggal Panen"
          placeholder="Pilih tanggal"
          errorText={errors?.date?.message}
          isRequired={true}
          onChangeText={value => {
            setValue('date', value, {
              shouldValidate: true,
            })
          }}
        />

        <Button style={styles.submitButton} onPress={handleSubmit(submitForm)}>
          <Text type="semibold" style={styles.submitButtonText}>
            Pilih Taksasi
          </Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TaxationFilter

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: theme.colors.black,
    marginTop: 23,
  },
  submitButtonText: {
    fontSize: fs(13),
    color: theme.colors.white,
    fontWeight: 'normal',
  },
})
