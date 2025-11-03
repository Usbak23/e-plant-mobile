import React, {useEffect} from 'react'
import {Button, Header, Text, TextInput} from '@app/presentations/_shared-components'
import {SafeAreaView, ScrollView, View} from 'react-native'
import {styles, stepIndicatorStyles} from './styles'
import StepIndicator from 'react-native-step-indicator'
import {stepLabels} from './constants'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import RKHHarvestFormFirstStep from './steps/first-step'
import RKHHarvestFormSecondStep from './steps/second-step'
import {useNavigation, useRoute} from '@react-navigation/native'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as schema from '@utils/validation/rkh-harvest-add-employee-validation'
import {useForm, useFieldArray} from 'react-hook-form'
import {IRKHHarvestActivity, IRKHHarvestFormData} from '@app/models/eplant/RKHHarvest'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import moment from 'moment'

const RKHHarvestForm = () => {
  const resolver = useYupValidationResolver(schema.rkhHarvestFormValidationSchema)
  const dispatch = useDispatch()
  const route: any = useRoute()
  const org = route?.params?.rkh?.division?.organization
  const item = route.params?.item
  const offlineForm = route.params?.offlineForm
  const isEditDraft = Boolean(route.params?.isOffline)
  const isEdit = Boolean(route.params?.isEdit)
  const rkh = route.params?.rkh
  const navigation = useNavigation()
  const [currentPage, setCurrentPage] = React.useState<number>(0)

  const {formRKHHarvestStatus} = useSelector((state: RootStateType) => state.rkhHarvest)

  const constructDefaultWorker = () => {
    if (!isEditDraft && item.rkhList?.rkhActivities && Array.isArray(item.rkhList.rkhActivities)) {
      return item.rkhList.rkhActivities.map((worker: IRKHHarvestActivity) => {
        return {
          _id: worker?.role?.id || '',
          typeEmployeeId: worker?.typeEmployee?.id || '',
          qty: worker?.qty || 0,
          cost: worker?.cost || 0,
          name: worker?.role?.name || 0,
          // 353
          roleCategory: [],
          typeEmployee: worker?.typeEmployee?.name || '',
          typeEmployeeName: worker?.typeEmployee?.name || '',
        }
      })
    } else if (isEditDraft && offlineForm?.worker && Array.isArray(offlineForm.worker)) {
      return offlineForm.worker.map((worker: any) => {
        return {
          _id: worker?.id || '',
          typeEmployeeId: worker?.typeEmployeeId || '',
          qty: worker?.qty || 0,
          cost: worker?.cost || 0,
          name: worker?.name || '',
          //353
          roleCategory: [],
          typeEmployee: worker?.typeEmployeeName || '',
          typeEmployeeName: worker?.typeEmployeeName || '',
        }
      })
    }
    return []
  }

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    clearErrors,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      rkhId: rkh?.id,
      taxationId: isEditDraft ? offlineForm.taxationId : item?.id,
      worker: isEdit ? constructDefaultWorker() : [],
    },
  })

  const {fields, append, remove} = useFieldArray({
    control: control,
    //@ts-ignore
    name: 'worker',
  })

  const workerWatcher = watch('worker', [])

  const onAppend = (item: any) => append(item)
  const onRemove = (item: any) => remove(item)

  const constructForm = (form: IRKHHarvestFormData) => {
    const workers = form.worker
    if (workers && Array.isArray(workers)) {
      workers.forEach(w => {
        //@ts-ignore
        Object.assign(w, {id: w._id})
      })
    }
    return form
  }

  const onSubmit = (form: IRKHHarvestFormData) => {
    const requestBody = constructForm(form)
    if (isEdit && !isEditDraft) {
      const payload = {worker: requestBody.worker}
      dispatch(
        actions.editRKHHarvest.request({
          loading: true,
          data: {
            id: item.rkhList.id,
            data: payload,
          },
        }),
      )
      return
    }
    dispatch(actions.createRKHHarvest.request({loading: true, data: form}))
  }

  const onAddEmployeeResult = (employee: {
    id: string
    cost: number
    qty: number
    name: string
    //353
    roleCategory: string[]
    typeEmployeeId: string
    typeEmployeeName: string
  }) => {
    const currentExistWorker = fields.find((worker: any) =>
      isEditDraft ? worker?._id == employee?.id : worker?.id == employee?.id,
    )
    if (currentExistWorker) {
      Object.assign(employee, {_id: employee.id})
      onRemove(currentExistWorker)
      onAppend(employee)
      clearErrors('worker')

      return
    }
    Object.assign(employee, {_id: employee.id})
    onAppend(employee)
    clearErrors('worker')
  }

  useEffect(() => {
    const error = formRKHHarvestStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formRKHHarvestStatus?.error])

  useEffect(() => {
    const data = formRKHHarvestStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Perubahan disimpan')
      navigation.goBack()
    }
  }, [formRKHHarvestStatus?.data])

  useEffect(() => {
    //@ts-ignore
    if (route.params?.employee) {
      //@ts-ignore
      const employee = route.params?.employee
      onAddEmployeeResult(employee)
    }
    //@ts-ignore
  }, [route.params?.employee])

  const scenes = [
    <RKHHarvestFormFirstStep item={item} onNext={() => setCurrentPage(1)} />,
    <RKHHarvestFormSecondStep
      params={{organization: org}}
      onAppend={(employee: any) => onAppend(employee)}
      onRemove={onRemove}
      onAddEmployeeResult={employee => onAddEmployeeResult(employee)}
      onPrevious={() => setCurrentPage(0)}
      workerWatcher={workerWatcher}
      fields={fields}
      errors={errors}
      handleSubmit={handleSubmit(onSubmit)}
    />,
  ]

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah RKH Panen' : 'Lengkapi RKH Panen'} />
      {/* <StepIndicator
        labels={stepLabels}
        stepCount={2}
        customStyles={stepIndicatorStyles}
        currentPosition={currentPage}
      /> */}
      <ScrollView contentContainerStyle={[styles.scrollView, styles.body]} showsVerticalScrollIndicator={false}>
        {/* {scenes[currentPage]} */}
        <View>
          <TextInput
            disabled
            disabledText={item?.block?.division?.organization?.name || '-'}
            control={{}}
            label="Organisasi"
            placeholder="Contoh: PT. Aksara Integrasi Sejahtera"
            name="organization"
            isRequired
          />
          <TextInput
            disabled
            disabledText={item?.block?.division?.name || '-'}
            control={{}}
            label="Divisi"
            placeholder="Contoh: Divisi Alpha"
            name="division"
            isRequired
          />
          <TextInput
            disabled
            disabledText={item?.block?.code || '-'}
            control={{}}
            label="Blok"
            placeholder="Contoh: Blok C1"
            name="block"
            isRequired
          />
          <TextInput
            disabled
            disabledText={item?.block?.blockArea != undefined ? item.block.blockArea.toString() : '-'}
            control={{}}
            label="Luas Blok (Ha)"
            placeholder="Contoh: 10"
            name="blockArea"
            isRequired
          />

          <TextInput
            disabled
            disabledText={item?.totalHectares != undefined ? item.totalHectares.toString() : '-'}
            control={{}}
            label="Total Ha"
            placeholder="Contoh: 10"
            name="totalHectare"
            isRequired
          />

          <TextInput
            disabled
            disabledText={item?.akp?.harvestDate ? moment(item.akp.harvestDate).format('D MMMM YYYY') : '-'}
            control={{}}
            label="Tanggal Panen"
            placeholder="Contoh: 2021-10-31"
            name="harvestDate"
            isRequired
          />

          <TextInput
            disabled
            disabledText={item?.harvestChapel != undefined ? item.harvestChapel.toString() : '-'}
            control={{}}
            label="Kapel Panen"
            placeholder="Contoh: 2"
            name="harvestChapel"
            isRequired
          />

          <TextInput
            disabled
            disabledText={item?.kilogram != undefined ? item.kilogram.toString() : '-'}
            control={{}}
            label="Kilogram [Janjang x BJR]"
            placeholder="Contoh: 12"
            name="kilogram"
            isRequired
          />

          <TextInput
            disabled
            disabledText={item?.numberOfEmployees != undefined ? item.numberOfEmployees.toString() : '-'}
            control={{}}
            label="Jumlah Karyawan"
            placeholder="Contoh: 100"
            name="numberOfEmployees"
            isRequired
          />

          <TextInput
            disabled
            disabledText={item?.ripeFruit != undefined ? item.ripeFruit.toString() : '-'}
            control={{}}
            label="Total Janjang"
            placeholder="Contoh: 100"
            name="totalFruit"
            isRequired
          />

          <TextInput
            disabled
            disabledText={
              item?.block?.harvestForeman
                ? `${item.block.harvestForeman.nip} - ${item.block.harvestForeman.name} - ${item.block.harvestForeman.role.name}`
                : '-'
            }
            control={{}}
            label="Mandor Panen"
            placeholder="Contoh: 123 - John - Mandor"
            name="harvestForeman"
            isRequired
          />

          <Button style={{marginVertical: 16}} onPress={() => {}}>
            <Text color="white">Simpan</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RKHHarvestForm
