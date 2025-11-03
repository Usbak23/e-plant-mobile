import React, {useState, useEffect} from 'react'
import {Header} from '@app/presentations/_shared-components'
import {SafeAreaView, ScrollView} from 'react-native'
import {styles, stepIndicatorStyles} from './styles'
import StepIndicator from 'react-native-step-indicator'
import {stepLabels} from './constants'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import FormFirstStep from './steps/first-step'
import FormFourthStep from './steps/fourth-step'
import {useNavigation, useRoute} from '@react-navigation/native'
import {useBlockOptions, useSingleBlockById} from '@app/domain/states/block/hooks'
import {useDispatch, useSelector} from 'react-redux'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {actions, RootStateType} from '@domain/states/store'
import {useForm, useWatch} from 'react-hook-form'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import * as schema from '@utils/validation/rkh-take-care-validation'
import {useNormaSubActivities} from '@app/domain/states/raw-material/hooks'
import {INormSubActivity} from '@app/models/eplant/NormSubactivity'
import {IRKHTakeCareRow} from '@app/models/eplant/RKHTakeCare'
import {useRKHTakeCareAll, useRKHTakeCareOnLatestPeriod} from '@app/domain/states/rkh-take-care/hooks'
import moment from 'moment'

const RKHTakeCareForm = () => {
  const isConnected = useSelector((state: RootStateType) => state?.network.isConnected)
  const navigation = useNavigation()
  const route: any = useRoute()
  // const __docs = route.params?.docs
  const __organizationId = route.params?.organizationId
  const __year = parseInt(route.params?.year)
  const item: any = route.params?.item
  const rkh: any = route.params?.rkh
  const isEdit = Boolean(item?.id)
  const isTemp = Boolean(item?.isTemp)

  const __docs = useRKHTakeCareAll(rkh?.dateRkh, rkh?.division?.id)

  const dispatch = useDispatch()
  const resolverFirstPage = useYupValidationResolver(schema.validationSchemaFirstPage)

  const {formRKHTakeCareStatus, rkhTakeCareDetail, rkhTakeCareListTemp} = useSelector(
    (state: RootStateType) => state?.rkhTakeCare,
  )
  const [currentPage, setCurrentPage] = React.useState<number>(0)

  const blocks = useBlockOptions(route.params.divisionId || '')
  const subActivities2 = useNormaSubActivities(__organizationId, __year, 'rawat')
  const [selectedBlock, setSelectedBlock] = useState(item?.block?.id || '')

  const [selectedSubActivity, setSelectedSubActivity] = useState(item?.subActivity?.id || '')
  const subActivityData = useSelector((state: RootStateType) => state.rawMaterial?.normaSubactivities?.data || []).find(
    (subAct: INormSubActivity) =>
      subAct?.subActivity?.id == selectedSubActivity &&
      subAct?.subActivity != null &&
      subAct?.subActivity?.category?.toLowerCase() == 'rawat' &&
      subAct?.norm?.year == __year &&
      subAct?.norm?.organization?.id == __organizationId,
  )

  const subActivityAll = useSelector((state: RootStateType) => state?.subActivity?.subActivityAll?.data || [])
  const singleBlock = useSingleBlockById(selectedBlock)

  const rkhPeriods = useRKHTakeCareOnLatestPeriod(route?.params?.divisionId)

  const constructDefaultMaterials = () => {
    if (isEdit && item?.rkhActivities?.material?.materials && Array.isArray(item.rkhActivities.material.materials)) {
      const mapped = item.rkhActivities.material.materials.map((i: any) => {
        return {
          _id: i.rawMaterial?.id,
          cost: i.cost,
          qty: i.qty,
          name: i.rawMaterial?.name || i.name || '-',
          roleCategory: [],
        }
      })
      return mapped
    } else if (!isEdit && isTemp && item?.material && Array.isArray(item.material)) {
      const mapped = item.material.map((i: any) => {
        return {
          _id: i.rawMaterial?.id || i.id || '',
          cost: i.cost,
          qty: i.qty,
          name: i.rawMaterial?.name || i.name || '-',
          roleCategory: [],
        }
      })
      return mapped
    }
    return []
  }

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    reset,
    setError,
    formState: {errors, isValid},
  } = useForm({
    resolver: resolverFirstPage,
    mode: 'onChange',
    defaultValues: {
      ...item,
      id: item?.id,
      tempId: item?.tempId,
      rkhId: rkh?.id,
      subActivityId: item?.subActivity?.id || '',
      blockId: item?.block?.id || '',
      realizationToThisDay: item?.realizationToThisDay || '0',
      blockArea: item?.block?.blockArea,
      hectaresTomorrow: item?.hectaresTomorrow != null ? item?.hectaresTomorrow.toString() : '',
      material: constructDefaultMaterials(),
      totalPlanHectare: item?.totalPlanHectare != null ? item?.totalPlanHectare.toString() : '',
      hkPerHa: item?.hkPerHa != null ? item?.hkPerHa.toString() : '',
      totalPlanHk: item?.totalPlanHk != null ? item?.totalPlanHk.toString() : '',
    },
  })

  //Cek kumulatif untuk penambahan data di tanggal yang dilompati.
  //Jika data ditambahkan, tangal2 setelahnya terakumulasi (bertambah), jika penambahan kumulatifnya...
  //...melebihi luas blok. Maka tidak valid.
  const checkCumulativeAffected = (data: any) => {
    if (selectedBlock != '' && selectedSubActivity != '') {
      let real = 0
      let toReturn = true
      rkhPeriods.reverse().every((r: any, index: number) => {
        if (
          r.block?.id == selectedBlock &&
          // r.totalPlanHectare >= singleBlock?.blockArea &&
          Boolean(moment(r.rkh?.dateRkh).isSameOrAfter(moment(rkh?.dateRkh))) &&
          r.subActivity?.id == selectedSubActivity
        ) {
          const shouldProhibited =
            parseFloat(r.totalPlanHectare) + parseFloat(data.hectaresTomorrow) > singleBlock?.blockArea
          if (shouldProhibited) {
            toReturn = false
            return false
          }
          return true
        }
        return true
      })
      return toReturn
    }
    return false
  }

  //Cek apakah boleh menambahkan draft baru di tanggal tertentu.
  //Aturan ini hanya TRUE jika draft ditambah di periode yang sedang dibuka saja.
  const isAllowedToCreateDraftOnThatDateAndBlock = () => {
    if (selectedBlock != '' && selectedSubActivity != '') {
      let real = 0
      let toReturn = true
      rkhPeriods.reverse().every((r: any, index: number) => {
        if (
          r.block?.id == selectedBlock &&
          r.totalPlanHectare >= singleBlock?.blockArea &&
          Boolean(moment(r.rkh?.dateRkh).isSameOrAfter(moment(rkh?.dateRkh))) &&
          r.subActivity?.id == selectedSubActivity
        ) {
          real = r.totalPlanHectare
          toReturn = false
          return false
        }
        return true
      })

      return toReturn
    }
    return false
  }

  const calculateRealization = () => {
    if (selectedBlock != '' && selectedSubActivity != '') {
      let realization = 0
      let foundOther = false

      rkhPeriods.reverse().every((r: any, index: number) => {
        if (r.block?.id == selectedBlock && r.subActivity?.id == selectedSubActivity) {
          if (moment(r.rkh?.dateRkh).isBefore(moment(rkh?.dateRkh))) {
            realization = r.totalPlanHectare
            return false
          }

          if (foundOther && r.totalPlanHectare >= singleBlock?.blockArea) {
            return false
          }
          if (r.totalPlanHectare >= singleBlock?.blockArea && r?.rkh?.id != rkh?.id) {
            if (realization != 0) {
              return false
            }

            realization = r.totalPlanHectare || 0
            foundOther = true
            return false
          } else {
            if (r?.rkh?.id != rkh?.id) {
              realization = realization > r.totalPlanHectare ? realization : r.totalPlanHectare
            }
          }
        }
        return true
      })

      if (realization >= parseFloat(singleBlock?.blockArea)) {
        realization = 0
      }
      setValue('realizationToThisDay', realization)
      return realization
    }
    setValue('realizationToThisDay', 0)
    return 0
  }

  const hectaresTomorrowWatcher = useWatch({
    control: control,
    name: 'hectaresTomorrow',
    defaultValue: control._defaultValues.hectaresTomorrow || '',
  })

  const hkPerHaWatcher = useWatch({
    control: control,
    name: 'hkPerHa',
    defaultValue: control._defaultValues.hkPerHa || '',
  })

  const valueOfTotalPlanHk = () => {
    const totalPlanHk = hkPerHaWatcher * hectaresTomorrowWatcher
    if (isNaN(totalPlanHk) || !isFinite(totalPlanHk)) {
      setValue('totalPlanHk', '')
    } else {
      setValue('totalPlanHk', totalPlanHk)
    }
    return isNaN(totalPlanHk) || !isFinite(totalPlanHk) ? '-' : totalPlanHk.toString()
  }

  const constructRequestBody = () => {
    const materials = getValues('material')
    if (materials && Array.isArray(materials)) {
      materials.forEach(w => {
        //@ts-ignore
        Object.assign(w, {id: w._id})
      })
    }

    const simplifiedBlock = {...singleBlock}
    delete simplifiedBlock?.geoJson
    delete simplifiedBlock?.fileGeoJson
    delete simplifiedBlock?.harvestForeman?.imageProfile
    delete simplifiedBlock?.careForeman?.imageProfile
    delete simplifiedBlock?.harvestClerk?.imageProfile

    const body = {
      id: getValues('id'),
      tempId: getValues('tempId'),
      blockId: getValues('blockId'),
      rkhId: rkh?.id,
      rkh: {...rkh},
      category: 'Rawat',
      realizationToThisDay: parseFloat(getValues('realizationToThisDay')),
      subActivityId: getValues('subActivityId'),
      hectaresTomorrow: parseFloat(getValues('hectaresTomorrow')),
      totalPlanHectare: parseFloat(getValues('totalPlanHectare')),
      hkPerHa: parseFloat(getValues('hkPerHa')),
      totalPlanHk: parseFloat(getValues('totalPlanHk')),

      //inconsitency of key
      planHectareArea: parseFloat(getValues('totalPlanHectare')),
      totalHkPlan: parseFloat(getValues('totalPlanHk')),

      //
      material: materials,
      block: simplifiedBlock,
      subActivity: subActivityAll.find(e => e.id === selectedSubActivity),
    }
    return body
  }

  useEffect(() => {
    if (!isEdit) {
      calculateRealization()
    }
  }, [selectedBlock])

  useEffect(() => {
    // setValue('', singleBlock?.blockArea, {shouldValidate: true}) //WTF IS THIS
    if (!isEdit) {
      calculateRealization()
    }
  }, [singleBlock])

  useEffect(() => {
    if (!isEdit) {
      setValue('hkPerHa', subActivityData?.qty, {shouldValidate: true})
      calculateRealization()
    }
  }, [subActivityData])

  useEffect(() => {
    if (isEdit) {
      // dispatch(actions.getRKHTakeCareDetail.request({loading: true, data: item?.id}))
    }
    dispatch(actions.getAllBlock.request({loading: true}))
    dispatch(actions.getRawMaterialAll.request({loading: true}))
    dispatch(actions.clearFormRKHTakeCareStatus())
  }, [])

  useEffect(() => {
    const error = formRKHTakeCareStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formRKHTakeCareStatus?.error])

  useEffect(() => {
    const data = formRKHTakeCareStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Perubahan disimpan')
      if (route.params?.onShouldGoBack) {
        route.params?.onShouldGoBack()
      }
      navigation.goBack()
      dispatch(actions.clearFormRKHTakeCareStatus())
    }
  }, [formRKHTakeCareStatus?.data])

  const isAlreadyExists = (data: any) => {
    const existingData = __docs.find((e: IRKHTakeCareRow) => {
      return e?.rkh?.id == data?.rkhId && e?.subActivity?.id == data?.subActivityId && e?.block?.id == data?.blockId
    })
    if (existingData) {
      return true
    }
    return false
  }

  const isAlreadyExistsForEdit = (data: any) => {
    const existingData = __docs.find((e: IRKHTakeCareRow) => {
      return (
        e?.rkh?.id == data?.rkhId &&
        e?.subActivity?.id == data?.subActivityId &&
        e?.block?.id == data?.blockId &&
        e?.id != data?.id
      )
    })
    if (existingData) {
      return true
    }
    return false
  }

  const isNewPeriod = (data: any) => {
    //check if the data is empty for current block and subActivity
    const current = rkhPeriods.find((r: any) => {
      const sameBlockId = r.block?.id == data?.blockId
      const sameSubActivityId = r.subActivity?.id == data?.subActivityId
      return sameBlockId && sameSubActivityId
    })

    if (!current) {
      return false
    }

    const res = rkhPeriods.find((r: any) => {
      const sameBlockId = r.block?.id == data?.blockId
      const sameSubActivityId = r.subActivity?.id == data?.subActivityId
      const dateIsBefore = moment(r?.rkh?.dateRkh).isBefore(moment(data?.rkh?.dateRkh))
      const totalHaIsSameOrGreaterThanArea = r.totalPlanHectare >= data?.block?.blockArea
      return sameBlockId && sameSubActivityId && dateIsBefore && totalHaIsSameOrGreaterThanArea
    })

    //but it will be allowed if have online data that new period
    if (res) {
      //check if have data online that in this periode. if true, return false
      const online = rkhPeriods.find((r: any) => {
        const sameBlockId = r.block?.id == data?.blockId
        const sameSubActivityId = r.subActivity?.id == data?.subActivityId
        const dateIsAfter = moment(r?.rkh?.dateRkh).isAfter(moment(res?.rkh?.dateRkh))
        // const totalHaIsSameOrGreaterThanArea = r.totalPlanHectare >= data?.block?.blockArea
        const isOnlineData = r?.id != undefined
        return sameBlockId && sameSubActivityId && dateIsAfter && isOnlineData
      })

      if (online) {
        return false
      }
    }
    return res != undefined
  }

  const submit = () => {
    const data = constructRequestBody()

    if (data.totalPlanHectare > singleBlock?.blockArea) {
      showErrorToast('Jumlah total ha melebihi luas area')
      return
    }

    if (isEdit) {
      if (isAlreadyExistsForEdit(data)) {
        showErrorToast('Data dengan blok dan sub aktivitas yang anda pilih sudah ada.')
        return
      }

      if (!isConnected) {
        showErrorToast('Anda tidak boleh mengedit dalam keadaan offline')
        return
      } else {
        if (rkhTakeCareListTemp && rkhTakeCareListTemp?.length > 0) {
          showErrorToast('Masih terdapat data offline yang belum disinkronisasi. Sinkronisasi terlebih dahulu')
          return
        }
        dispatch(actions.editRKHTakeCare.request({loading: true, data}))
      }

      return
    }

    const isEditingDraft = item?.tempId != undefined && item?.id == undefined
    if (isEditingDraft) {
      if (isAlreadyExists(data) && !data?.id && item?.tempId != data?.tempId) {
        showErrorToast('Data sudah ada')
        return
      }
    } else {
      if (isAlreadyExists(data)) {
        showErrorToast('Data sudah ada')
        return
      }
    }

    if (!isAllowedToCreateDraftOnThatDateAndBlock()) {
      showErrorToast('tidak bisa buat draft karena tanggal di peiode yang dibuka sudah sama dengan luas blok')
      return
    }

    if (!checkCumulativeAffected(data)) {
      showErrorToast('Penambahan data menyebabkan kumulatif melebihi luas blok')
      return
    }

    //if it started a new period. Should prohibited.
    if (isNewPeriod(data) && !isConnected) {
      showErrorToast('Anda tidak dapat menambah periode baru jika masih terdapat data offline')
      return
    }

    dispatch(actions.createRKHTakeCare.request({loading: true, data}))
  }

  const onNextPage = () => {
    const blockArea = singleBlock?.blockArea || 0

    if (getValues('hectaresTomorrow') > blockArea && currentPage === 0) {
      return setError(
        'hectaresTomorrow',
        {
          type: 'string',
          message: 'Total Ha tidak boleh lebih dari Luas Blok',
        },
        {
          shouldFocus: true,
        },
      )
    }

    handleSubmit(() => setCurrentPage(currentPage + 1))()
  }

  const onPrevious = () => {
    setCurrentPage(currentPage - 1)
  }

  const scenes = [
    <FormFirstStep
      realizationOfThisDay={calculateRealization()}
      docs={__docs}
      item={item}
      setValue={setValue}
      control={control}
      rkh={rkh}
      setSelectedBlock={setSelectedBlock}
      block={singleBlock}
      subactivity={selectedSubActivity}
      setSelectedSubActivity={setSelectedSubActivity}
      getValues={getValues}
      blocks={blocks}
      errors={errors}
      isValid={isValid}
      subActivities={subActivities2}
      subActivityData={subActivityData}
      isEdit={isEdit}
      onNext={onNextPage}
      valueOfTotalPlanHk={valueOfTotalPlanHk()}
    />,
    <FormFourthStep params={route.params} watch={watch} control={control} onNext={submit} onPrevious={onPrevious} />,
  ]

  return (
    <SafeAreaView style={styles.root}>
      <Header title={`${isEdit ? 'Ubah' : 'Tambah'} RKH Rawat`} />

      <StepIndicator
        labels={stepLabels}
        stepCount={2}
        customStyles={stepIndicatorStyles}
        currentPosition={currentPage}
      />
      <ScrollView
        contentContainerStyle={[styles.scrollView, styles.body]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {scenes[currentPage]}
      </ScrollView>
    </SafeAreaView>
  )
}

export default RKHTakeCareForm
