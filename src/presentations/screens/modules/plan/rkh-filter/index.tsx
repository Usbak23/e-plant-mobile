import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {theme} from '@app/presentations/utils/styles'
import {Header, SelectInput, Text} from '@app/presentations/_shared-components'
import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {Keyboard, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '@components/Button'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import {actions} from '@domain/states/store'
import * as yup from 'yup'
import {useNavigation} from '@react-navigation/native'
import {useOrganizationOptions} from '@app/domain/states/organization/hooks'
import {useDispatch} from 'react-redux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {useDivisionsByOrganization} from '@app/domain/states/division/hooks'
import {useRangeYears, useRangeMonths} from '@app/domain/states/master/hooks'
import Routes from '@app/presentations/navigation/Routes'
import {useCurrentUserInfo} from '@app/domain/states/user/hooks'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'

let validationSchema = yup.object().shape({
  organizationId: yup.string().required('Pilih organisasi terlebih dahulu'),
  divisionId: yup.string().required('Pilih divisi terlebih dahulu'),
  year: yup.string().required('Pilih tahun terlebih dahulu'),
  month: yup.string().required('Pilih bulan terlebih dahulu'),
})

const RKHFilter = () => {
  const currentUser = useCurrentUserInfo()

  const isAllowedToSeeRKH = () => {
    if (currentUser?.role?.roleModules && Array.isArray(currentUser.role.roleModules)) {
      // return currentUser.role.roleModules.some(role => role.slug == ROLE_ACCESS_SLUG.LIHAT_RKH)
      return true
    }
    return true
  }
  const resolver = useYupValidationResolver(validationSchema)
  const navigation: any = useNavigation()
  const dispatch = useDispatch()

  const [organization, setOrganization] = useState('')
  const organizations = useOrganizationOptions()
  const divisions = useDivisionsByOrganization(organization)
  const years = useRangeYears()
  const months = useRangeMonths()

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      organizationId: '',
      divisionId: '',
      year: new Date().getFullYear().toString(),
      month: '',
    },
  })

  const submitForm = (data: any) => {
    //@ts-ignore
    navigation.navigate(Routes.RKH_LIST, data)
  }

  useEffect(() => {
    if (isAllowedToSeeRKH()) {
      dispatch(actions.getRKHHarvestAll.request({loading: true}))
      dispatch(actions.getRKHTakeCareAll.request({loading: true}))
      dispatch(actions.getRKHAll.request({loading: true}))
      dispatch(actions.getNormaSubactivity.request({loading: true, data: {category: 'Rawat'}}))
    }
    dispatch(actions.getOrganizationAll.request({loading: true}))
    dispatch(actions.getAllDivision.request({loading: true}))
    dispatch(actions.getRangeYear.request({loading: true}))
  }, [])

  const HeaderView = () => <Header title="Rencana Kerja Harian" />
  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ScrollView
        contentContainerStyle={{paddingBottom: 16}}
        onScrollBeginDrag={Keyboard.dismiss}
        keyboardShouldPersistTaps="handled"
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
        <SelectInput
          items={years}
          control={control}
          label="Tahun"
          placeholder="Pilih Tahun"
          name="year"
          key="year"
          errorText={errors?.year?.message}
          isRequired
        />
        <SelectInput
          items={months}
          control={control}
          label="Bulan"
          placeholder="Pilih Bulan"
          name="month"
          key="month"
          errorText={errors?.month?.message}
          isRequired
        />

        <Button style={styles.submitButton} onPress={handleSubmit(submitForm)}>
          <Text type="semibold" style={styles.submitButtonText}>
            Pilih RKH
          </Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RKHFilter

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
