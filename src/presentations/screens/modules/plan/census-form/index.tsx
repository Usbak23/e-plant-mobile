import { Header, Loader, ModalAsk, Text } from '@app/presentations/_shared-components'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import StepIndicator from 'react-native-step-indicator'
import { styles, firstIndicatorStyles } from './style'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useFieldArray, useForm } from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as schema from '@utils/validation/census-validation'
import { ICensusFormData, ICensusRow, ICensusEditFormData, ICaturwulanCensus, ICaturwulan } from '@models/eplant/Census'
import { caturwulans, stepLabels, stepLabelsV2 } from './constant'
import { actions, RootStateType } from '@domain/states/store'
import { useDispatch, useSelector } from 'react-redux'
import { useBlocksByDivisionStd, useSingleBlockById } from '@app/domain/states/block/hooks'
import { useRangeYear } from '@app/domain/states/master/hooks'
import FirstPage from './steps/first-step'
import SecondPage from './steps/second-step'
import ThirdPage from './steps/third-step'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useNavigation, useRoute } from '@react-navigation/core'
import SecondPageV2 from './steps/second-step-v2'

const CensusForm = () => {
  const navigation = useNavigation()
  const route: any = useRoute()
  const PARENT: any = route?.params?.parent
  const item: ICensusRow | null | undefined = route.params?.item
  const isEdit = Boolean(item?.id)
  const dispatch = useDispatch()
  const resolverFirstPage = useYupValidationResolver(schema.censusValidationSchemaFirstPage)
  const resolverSecondPageV2 = useYupValidationResolver(schema.censusValidationSchemaSecondPageV2)
  const rangeYear = useRangeYear()

  const loadingOrganization = useSelector((state: RootStateType) => state?.organization?.organizationAll?.loading)
  const loadingDivision = useSelector((state: RootStateType) => state?.division?.divisionAll?.loading)
  const loadingBlock = useSelector((state: RootStateType) => state?.block?.blockAll?.loading)
  const { formCensusStatus, censusDetail } = useSelector((state: RootStateType) => state?.census)

  const [currentPage, setCurrentPage] = React.useState<number>(0)
  const [selectedBlock, setSelectedBlock] = useState(item?.block?.id || '')
  const [isAskChange, setAskChange] = useState<{ isOpen: boolean, callback?: Function }>({ isOpen: false, callback: () => { } })

  const blocks = useBlocksByDivisionStd(PARENT?.DIVISION?.value || '')
  const singleBlock = useSingleBlockById(selectedBlock)

  const shouldAskDataChange = (callback?: Function) => {
    setAskChange({
      isOpen: true,
      callback
    })
  }

  const {
    handleSubmit: handleSubmitFirstPage,
    control: controlFirstPage,
    getValues: getValuesFirstPage,
    setValue: setValueFirstPage,
    setError: setErrorFirstPage,
    formState: { errors: errorsFirstPage, isValid: isValidFirstPage, isDirty: isDirtyFirstPage },
  } = useForm({
    resolver: resolverFirstPage,
    mode: 'onChange',
    defaultValues: {
      organization: PARENT?.ORGANIZATION?.value || '',
      divisionId: PARENT?.DIVISION?.value || '',
      blockId: item?.block?.id ? item?.block?.id : '',
      yearOfCensus: PARENT?.YEAR || '',
      totalTree: item?.totalTree ? item?.totalTree.toString() : '',
      //phase3
      quarter: item?.quarter ? item.quarter.toString() : '',
    },
  })



  const {
    handleSubmit: handleSubmitSecondPageV2,
    control: controlSecondPageV2,
    getValues: getValuesSecondPageV2,
    setError: setErrorSecondPageV2,
    setValue: setValueSecondPageV2,
    reset: resetSecondPageV2,
    formState: { errors: errorsSecondPageV2, isValid: isValidSecondPageV2, isDirty: isDirtySecondPageV2 },
  } = useForm({
    resolver: resolverSecondPageV2,
    mode: 'onChange',
    defaultValues: {
      totalTreeChecked: item?.totalTreeChecked ? item?.totalTreeChecked.toString() : '',
      totalFruit: item?.totalFruit ? item.totalFruit.toString() : '',
      averageFruit: item?.averageFruit ? item.averageFruit.toString() : '',
      totalFruitOfBlock: item?.totalFruitOfBlock ? item?.totalFruitOfBlock.toString() : '',
      bjr: item?.bjr ? item?.bjr.toString() : '',
      totalTonnage: item?.totalTonnage ? item?.totalTonnage.toString() : '',
      tonnagePerHectare: item?.tonnagePerHectare ? item?.tonnagePerHectare.toString() : '',
      censusMonths: [],
    },
  })



  const {
    fields: censusMonthsFieldsV2,
    append: censusMonthsAppendsV2,
    remove: censusMonthsRemoveV2,
    replace: censusMonthsReplaceV2,
  } = useFieldArray({
    control: controlSecondPageV2,
    //@ts-ignore
    name: 'censusMonths',
  })

  const handleQuarterSelectInputV2 = (q: string, oldCensusMonths?: any) => {
    setValueFirstPage('quarter', q, { shouldValidate: true })

    let MONTHS_IN_QUARTER = []
    if (getValuesSecondPageV2('censusMonths').length == 0 && !oldCensusMonths) {
      MONTHS_IN_QUARTER = ICaturwulanCensus.filter((data: ICaturwulan) => data.caturwulan.toString() == q).map(
        (data: ICaturwulan, index: number) => {
          return {
            labelMonth: data.labelMonth,
            percentage: '',
            month: data.month,
            bjr: '',
            yield: '',
            scatter: '',
            janjangPerMonth: '',
          }
        },
      )
    } else {
      MONTHS_IN_QUARTER = ICaturwulanCensus.filter((data: ICaturwulan) => data.caturwulan.toString() == q).map(
        (data: ICaturwulan, index: number) => {
          const oldValue =
            isEdit && oldCensusMonths ? oldCensusMonths[index] : getValuesSecondPageV2('censusMonths')[index]
          return {
            labelMonth: data.labelMonth,
            percentage: oldValue?.percentage == undefined ? '' : oldValue.percentage.toString(),
            month: data.month,
            bjr: oldValue?.bjr == undefined ? '' : oldValue.bjr.toString(),
            yield: oldValue?.yield == undefined ? '' : oldValue.yield.toString(),
            scatter: oldValue?.scatter == undefined ? '' : oldValue.scatter,
            janjangPerMonth: oldValue?.janjangPerMonth == undefined ? '' : oldValue.janjangPerMonth,
          }
        },
      )
    }

    censusMonthsReplaceV2(MONTHS_IN_QUARTER)
  }

  const constructBjrAndTonasePerBlokAndYieldPerBlok = () => {
    let akumulasiTonaseSetiapBulan = 0
    let akumulasiJanjangSetiapBulan = 0
    let akumulasiYieldSetiapBulan = 0
    getValuesSecondPageV2('censusMonths') && Array.isArray(getValuesSecondPageV2('censusMonths')) && getValuesSecondPageV2('censusMonths').forEach((census: any) => {
      akumulasiTonaseSetiapBulan += parseFloat(census.scatter || '0')
      akumulasiJanjangSetiapBulan += parseFloat(census.janjangPerMonth || '0')
      akumulasiYieldSetiapBulan += parseFloat(census.yield || '0')
    })
    const bjr = akumulasiTonaseSetiapBulan / akumulasiJanjangSetiapBulan
    return {
      bjr: !bjr || isNaN(bjr) || !isFinite(bjr) ? 0 : parseFloat(bjr.toFixed(2)),
      totalTonnage: !akumulasiTonaseSetiapBulan || isNaN(akumulasiTonaseSetiapBulan) || !isFinite(akumulasiTonaseSetiapBulan) ? 0 : parseFloat(akumulasiTonaseSetiapBulan.toFixed(2)),
      tonnagePerHectare: !akumulasiYieldSetiapBulan || isNaN(akumulasiYieldSetiapBulan) || !isFinite(akumulasiYieldSetiapBulan) ? 0 : parseFloat(akumulasiYieldSetiapBulan.toFixed(2)),
    }
  }

  const constructRequestBody = (): ICensusFormData => {
    const bjr_yield_tonase = constructBjrAndTonasePerBlokAndYieldPerBlok()
    const body: ICensusFormData = {
      blockId: getValuesFirstPage('blockId'),
      yearOfCensus: getValuesFirstPage('yearOfCensus'),
      quarter: getValuesFirstPage('quarter'),
      totalTree: getValuesFirstPage('totalTree'),
      totalTreeChecked: getValuesSecondPageV2('totalTreeChecked'),
      totalFruit: getValuesSecondPageV2('totalFruit'),
      averageFruit: getValuesSecondPageV2('averageFruit'),
      totalFruitOfBlock: getValuesSecondPageV2('totalFruitOfBlock'),
      bjr: bjr_yield_tonase.bjr,
      totalTonnage: bjr_yield_tonase.totalTonnage,
      tonnagePerHectare: bjr_yield_tonase.tonnagePerHectare,
      censusMonth: getValuesSecondPageV2('censusMonths'),
    }
    return body
  }

  const validateFirstStep = (firstStepForm: any) => {
    if (firstStepForm.yearOfCensus) {
      const yearAsInt = parseInt(firstStepForm.yearOfCensus)
      if (!isNaN(yearAsInt) && rangeYear && yearAsInt >= rangeYear.start && yearAsInt <= rangeYear.end) {
        setCurrentPage(1)
      } else {
        setErrorFirstPage(
          'yearOfCensus',
          {
            type: 'string',
            message: 'Tahun sensus melebih batas ketentuan',
          },
          {
            shouldFocus: true,
          },
        )
      }
    }
  }

  const validateSecondStepV2 = (secondStepForm: any) => {
    if (secondStepForm.totalTreeChecked > singleBlock!.totalTree) {
      const err = {
        type: 'string',
        message: 'Jumlah Pokok Diperiksa melebihi jumlah total pokok yang ada di blok',
      }
      setErrorSecondPageV2('totalTreeChecked', err, {
        shouldFocus: true,
      })
      return
    }

    //if all goes well
    //then submit
    submit()
  }

  const submit = () => {
    const requestBody = constructRequestBody()

    if (isEdit) {
      const editForm: ICensusEditFormData = {
        id: item?.id || '',
        formData: requestBody,
      }
      dispatch(actions.editCensus.request({ loading: true, data: editForm }))
      return
    }

    dispatch(actions.createCensus.request({ loading: true, data: requestBody }))
  }


  useEffect(() => {
    dispatch(actions.getOrganizationAll.request({ loading: true }))
    dispatch(actions.getAllDivision.request({ loading: true }))
    dispatch(actions.getAllBlock.request({ loading: true }))
    dispatch(actions.getRangeYear.request({ loading: true }))
    if (isEdit) {
      dispatch(actions.getCensusDetail.request({ loading: true, data: item?.id }))
    }
  }, [])

  useEffect(() => {
    const censuses = censusDetail?.data?.censusMonths || []
    const quarter = censusDetail?.data?.quarter || ''
    if (censuses && quarter && isEdit) {
      handleQuarterSelectInputV2(quarter.toString(), censuses)
    }
  }, [censusDetail?.data])

  useEffect(() => {
    setValueFirstPage('totalTree', singleBlock?.totalTree, { shouldValidate: true })
  }, [singleBlock, errorsFirstPage?.totalTree])

  useEffect(() => {
    const error = formCensusStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formCensusStatus?.error])

  useEffect(() => {
    const data = formCensusStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast(isEdit ? 'Berhasil diperbarui' : 'Berhasil disimpan')
      navigation.goBack()
    }
  }, [formCensusStatus?.data])

  const scenes = [
    <FirstPage
      isEdit={isEdit}
      parentData={PARENT}
      controlFirstPage={controlFirstPage}
      blocks={blocks}
      singleBlock={singleBlock}
      errorsFirstPage={errorsFirstPage}
      setSelectedBlock={setSelectedBlock}
      resetSecondPage={resetSecondPageV2}
      handleSubmitFirstPage={handleSubmitFirstPage}
      validateFirstStep={validateFirstStep}
      //new
      quarters={caturwulans}
      handleQuarterSelectInput={handleQuarterSelectInputV2}
      handleDataChange={shouldAskDataChange}
      getValuesFirstPage={getValuesFirstPage}
    />,
    <SecondPageV2
      controlSecondPage={controlSecondPageV2}
      errorsSecondPage={errorsSecondPageV2}
      handleSubmitSecondPage={handleSubmitSecondPageV2}
      getValuesFirstPage={getValuesFirstPage}
      getValuesSecondPage={getValuesSecondPageV2}
      validateSecondStep={validateSecondStepV2}
      resetSecondPage={resetSecondPageV2}
      goToFirstStep={() => {
        setCurrentPage(0)
      }}
      setValuesSecondPage={setValueSecondPageV2}
      censusMonthsFields={censusMonthsFieldsV2}
      singleBlock={singleBlock} />

  ]


  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah Sensus' : 'Tambah Sensus'} />
      <Loader loading={Boolean(loadingOrganization || loadingBlock || loadingDivision || formCensusStatus?.loading)} />

      <StepIndicator
        labels={stepLabelsV2}
        stepCount={2}
        customStyles={firstIndicatorStyles}
        currentPosition={currentPage}
      />

      <ScrollView contentContainerStyle={[styles.scrollView, styles.body]} showsVerticalScrollIndicator={false}>
        {scenes[currentPage]}
      </ScrollView>

    </SafeAreaView>
  )
}

export default CensusForm
