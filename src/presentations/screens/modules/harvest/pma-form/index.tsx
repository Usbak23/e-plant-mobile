import React, { useEffect, useState } from 'react'
import { Dimensions, SafeAreaView, ScrollView, View } from 'react-native'
import styles from '@app/presentations/screens/modules/harvest/pma-form/styles'
import { Button, Header, SelectInput, Text, TextInput } from '@app/presentations/_shared-components'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as schema from '@utils/validation/pma-form-validation'
import { useForm } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useUsersByDivision, useUsersByDivisionFull, useUsersByOrganizationFull } from '@app/domain/states/user/hooks'
import { useBlocksByDivisionStd, useBlocksWithPlantingYearByDivisionStd, usePlantingYearsByBlockId } from '@app/domain/states/block/hooks'
import { IPMAEmployee, IPMAEmployeeFormData, IPMAEmployeeMerged, IPMAFormEmployeeUpdate } from '@app/models/eplant/PMA'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import IOption from '@app/models/commons/IOption'
import { IUserRow } from '@app/models/eplant/User'
import BlockFormView from './block-form'

interface IBlockEmployee {
  __id?: string
  blockId?: string
  plantingYear?: string
  ancak?: string
  notHarvestFruit?: string
  sunFruit?: string
  looseOnPlateAndPikul?: string
  looseOnTph?: string
  brokenMidrib?: string
  onPlateMidrib?: string
  isEditable?: boolean
  checkedTree?: number | string
  remainingFruitTree?: number | string
  brondolanEachTree?: number | string
}

const defaultBlock = {
  blockId: '',
  plantingYear: '',
  ancak: '',
  notHarvestFruit: '',
  sunFruit: '',
  looseOnPlateAndPikul: '',
  looseOnTph: '',
  brokenMidrib: '',
  onPlateMidrib: '',
  checkedTree: '',
  remainingFruitTree: '',
  brondolanEachTree: '',
  isEditable: true,
}

const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const PMAForm = () => {
  const [dimensions, setDimensions] = useState({ window, screen })
  const isConnected = useSelector((state: RootStateType) => state.network.isConnected)
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const pmaFilterData = route.params?.pmaFilterData
  const pma = route?.params?.pma
  const item = route?.params?.item
  const isEdit = Boolean(item)

  const resolver = useYupValidationResolver(schema.pmaParentValidationSchema)

  const formPmaStatus = useSelector((state: RootStateType) => state.pma?.formPMAStatus)
  const formSingleEmployeeStatus = useSelector((state: RootStateType) => state.pma?.formEmployeeStatus)

  const blocks = useBlocksWithPlantingYearByDivisionStd(pmaFilterData?.division?.id || '')
  const users = useUsersByDivisionFull(pmaFilterData?.division?.id || '')
  const [selectedUserId, setSelectedUserId] = useState('')


  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      datePma: pmaFilterData?.datePMA || '',
      divisionId: pmaFilterData?.division?.id || '',
      foremanId: pmaFilterData?.foreman?.id || '',
      userId: isEdit ? item?.user?.id : '',
      employee: isEdit
        ? [
          {
            blockId: item?.block?.id,
            plantingYear: item?.plantingYear != undefined ? item.plantingYear.toString() : '',
            ancak: item?.ancak != undefined ? item.ancak.toString() : '',
            notHarvestFruit: item?.notHarvestFruit != undefined ? item.notHarvestFruit.toString() : '',
            sunFruit: item?.sunFruit != undefined ? item.sunFruit.toString() : '',
            looseOnPlateAndPikul: item?.looseOnPlateAndPikul != undefined ? item.looseOnPlateAndPikul.toString() : '',
            looseOnTph: item?.looseOnTph != undefined ? item.looseOnTph.toString() : '',
            brokenMidrib: item?.brokenMidrib != undefined ? item.brokenMidrib.toString() : '',
            onPlateMidrib: item?.onPlateMidrib != undefined ? item.onPlateMidrib.toString() : '',
            isEditable: true,
            checkedTree: item?.checkedTree != undefined ? item?.checkedTree?.toString() : '0',
            remainingFruitTree: item?.remainingFuitTree != undefined ? item?.remainingFruitTree?.toString() : '0',
            brondolanEachTree: item?.brondolanEachTree != undefined ? item?.brondolanEachTree?.toString() : '0',
          },
        ]
        : [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    //@ts-ignore
    name: 'employee',
  })

  const constructBlockForm = (v: string) => {
    setValue('employee', [], { shouldValidate: true })
    if (v == '') {
      if (isEdit) {
        const curr = {
          blockId: item?.block?.id || '',
          plantingYear: item?.plantingYear?.toString() || '',
          ancak: item?.ancak?.toString() || '',
          notHarvestFruit: item?.notHarvestFruit?.toString() || '',
          sunFruit: item?.sunFruit?.toString() || '',
          looseOnPlateAndPikul: item?.looseOnPlateAndPikul?.toString() || '',
          looseOnTph: item?.looseOnTph?.toString() || '',
          brokenMidrib: item?.brokenMidrib?.toString() || '',
          onPlateMidrib: item?.onPlateMidrib?.toString() || '',
          checkedTree: item?.checkedTree != undefined ? item?.checkedTree?.toString() : '0',
          remainingFruitTree: item?.remainingFruitTree != undefined ? item?.remainingFruitTree?.toString() : '0',
          brondolanEachTree: item?.brondolanEachTree != undefined ? item?.brondolanEachTree?.toString() : '0',
          isEditable: true,
        }
        append(curr)
        return
      }
      append(defaultBlock)
      return
    }

    if (pma?.employee) {
      const forms: IBlockEmployee[] = []
      pma?.employee
        ?.filter((e: IPMAEmployeeFormData) => e.user?.id == v)
        ?.forEach((m: IPMAEmployeeMerged) => {
          const obj: IBlockEmployee = {
            __id: m.id,
            blockId: m.block?.id || '',
            plantingYear: m?.plantingYear != undefined ? m.plantingYear.toString() : '',
            ancak: m?.ancak != undefined ? m.ancak.toString() : '',
            notHarvestFruit: m?.notHarvestFruit != undefined ? m.notHarvestFruit.toString() : '',
            sunFruit: m?.sunFruit != undefined ? m.sunFruit.toString() : '',
            looseOnPlateAndPikul: m?.looseOnPlateAndPikul != undefined ? m.looseOnPlateAndPikul.toString() : '',
            looseOnTph: m?.looseOnTph != undefined ? m.looseOnTph.toString() : '',
            brokenMidrib: m?.brokenMidrib != undefined ? m.brokenMidrib.toString() : '',
            onPlateMidrib: m?.onPlateMidrib != undefined ? m.onPlateMidrib.toString() : '',
            checkedTree: m?.checkedTree != undefined ? m?.checkedTree?.toString() : '0',
            remainingFruitTree: m?.remainingFruitTree != undefined ? m?.remainingFruitTree?.toString() : '0',
            brondolanEachTree: m?.brondolanEachTree != undefined ? m?.brondolanEachTree?.toString() : '0',
            isEditable: false,
          }
          forms.push(obj)
        })

      for (let i = 0; i < forms.length; i++) {
        append(forms[i])
      }
      append([defaultBlock])
      return
    }
    append(defaultBlock)
  }

  const isDuplicateBlock = (oldPayload = [], newPayload = []) => {

    for (let i = 0; i < newPayload.length; i++) {
      const findOldPayloadSameBlockAndPlantingYear = oldPayload.find((old: any) => {
        //@ts-ignore
        return old?.blockId == newPayload[i]?.blockId && old?.plantingYear == newPayload[i]?.plantingYear
      })

      if (findOldPayloadSameBlockAndPlantingYear) {
        return true
      }
    }

    return false
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen })
    })

    //@ts-ignore
    return () => subscription?.remove()
  })

  const onSubmit = (form: any) => {
    if (isEdit) {
      if (item?.isDraft) {
        form.tempId = pma?.tempId
        form.isDraft = true
        form.employee?.forEach((e: IPMAEmployeeFormData) => {
          e.userId = form.userId
          e.employeeTempId = item?.employeeTempId
          e.block = {
            id: e.blockId,
            code: blocks.find((b: IOption) => b.value == e.blockId)?.label || '-',
          }

          const selectedUser = users.find((u: IUserRow) => u.id == e.userId)
          e.user = {
            id: e.userId,
            name: selectedUser?.name || '-',
            nip: selectedUser?.nip || '-',
            role: {
              id: selectedUser?.role?.id || '-',
              name: selectedUser?.role?.name || '-',
            },
          }
        })

        const isAlreadyExists = pma?.employee?.find((p: any, i: number) => {
          return (
            p?.block?.id == form?.employee[0]?.blockId &&
            p?.user?.id == form?.userId &&
            p?.plantingYear == form?.employee[0]?.plantingYear &&
            // form?.employee[0]?.blockId != item?.block?.id &&
            (item?.employeeTempId ? (item?.employeeTempId != p?.employeeTempId && item?.employeeTempId != p?.id) : (item?.id != p?.id))

          )
        })

        if (isAlreadyExists) {
          showErrorToast('Data sudah pernah ada, Silakan edit data terkait di list.')
          return
        }
        dispatch(actions.editPMA.request({ loading: true, data: form }))
        return
      }

      const payload = form.employee[0]
      payload.id = item.id
      payload.userId = form.userId

      dispatch(actions.editSinglePMAEmployee.request({ loading: true, data: payload }))
      return
    }



    form.employee.forEach((e: IPMAEmployeeFormData) => {
      e.userId = form.userId
      e.block = {
        id: e.blockId,
        code: blocks.find((b: IOption) => b.value == e.blockId)?.label || '-',
      }

      const selectedUser = users.find((u: IUserRow) => u.id == e.userId)
      e.user = {
        id: e.userId,
        name: selectedUser?.name || '-',
        nip: selectedUser?.nip || '-',
        role: {
          id: selectedUser?.role?.id || '-',
          name: selectedUser?.role?.name || '-',
        },
      }
    })

    form.division = {
      id: form.divisionId,
      name: pmaFilterData?.division?.name || '-',
      organization: {
        id: pmaFilterData?.organization?.value || '-',
        name: pmaFilterData?.organization?.label || '-',
      },
    }

    form.foremanPma = {
      id: pmaFilterData?.foreman?.id || '-',
      name: pmaFilterData?.foreman?.name || '-',
      nip: pmaFilterData?.foreman?.nip || '-',
    }


    const oldPayload = form?.employee?.filter((p: any) => p?.isEditable === false) || []
    const newPayload = form?.employee?.filter((p: any) => p?.isEditable !== false) || []

    if (isDuplicateBlock(oldPayload, newPayload)) {
      showErrorToast('Terdapat blok dengan tahun tanam yang sama. Harap periksa kembali')
      return
    }

    if (!isConnected) {
      const temps = []
      for (let i = 0; i < form.employee.length; i++) {
        const isExists = pma?.employee?.find((e: any) => {
          return e?.block?.id == form?.employee[i]?.blockId &&
            e?.plantingYear == form?.employee[i]?.plantingYear &&
            e?.user?.id == form?.userId
        })
        if (!isExists) {
          temps.push(form.employee[i])
        }
      }

      form.employee = temps
      dispatch(actions.createPMA.request({ loading: true, data: form }))
      return
    }
    const temps = []
    for (let i = 0; i < form.employee.length; i++) {
      const isExists = pma?.employee?.find((e: any) => {
        return e?.block?.id == form?.employee[i]?.blockId &&
          e?.plantingYear == form?.employee[i]?.plantingYear &&
          e?.user?.id == form?.userId
      })
      if (!isExists) {
        temps.push(form.employee[i])
      }
    }
    form.employee = temps
    dispatch(actions.createPMA.request({ loading: true, data: form }))
  }

  useEffect(() => {
    const error = formPmaStatus?.error
    if (error) {
      if (!isConnected) {
        showErrorToast('Anda sedang offline')
      } else {
        showErrorToast(error.message)
      }
    }
  }, [formPmaStatus?.error])

  useEffect(() => {
    const data = formPmaStatus?.data
    if (data?.status == 'success') {
      showSuccessToast('Berhasil disimpan')
      setTimeout(() => {
        navigation.goBack()
      }, 1000)
    }
  }, [formPmaStatus?.data])

  useEffect(() => {
    const error = formSingleEmployeeStatus?.error
    if (error) {
      if (!isConnected) {
        showErrorToast('Anda sedang offline')
      } else {
        showErrorToast(error.message)
      }
    }
  }, [formSingleEmployeeStatus?.error])

  useEffect(() => {
    const data = formSingleEmployeeStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Berhasil diperbarui')
      setTimeout(() => {
        navigation.goBack()
      }, 600)
    }
  }, [formSingleEmployeeStatus?.data])

  useEffect(() => {
    const data = formPmaStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Berhasil disimpan')
      setTimeout(() => {
        navigation.goBack()
      }, 1000)
    }
  }, [formPmaStatus?.data?.data])

  useEffect(() => {
    constructBlockForm(selectedUserId)
  }, [selectedUserId])

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Edit PMA' : 'Tambah PMA'} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={{ flex: 1, margin: 8 }}>
            <TextInput
              maxLines={1}
              disabled={true}
              disabledText={pmaFilterData?.datePMA || '-'}
              control={control}
              label="Tanggal PMA"
              placeholder="Contoh: 2021-01-20"
              name="datePma"
              errorText={errors?.datePma?.message}
              isRequired
            />
            <TextInput
              maxLines={1}
              isRequired
              disabled={true}
              disabledText={pmaFilterData?.division?.name || '-'}
              control={control}
              label="Divisi"
              placeholder="Pilih Divisi"
              name="divisionId"
              errorText={errors?.divisionId?.message}
            />
          </View>
          <View style={{ flex: 1, margin: 8 }}>
            <TextInput
              maxLines={1}
              disabled={true}
              disabledText={pmaFilterData?.organization?.label || ''}
              control={control}
              label="Organisasi"
              placeholder="Contoh: 2021-01-20"
              name="organizationId"
              errorText={errors?.datePma?.message}
              isRequired
            />
            <TextInput
              maxLines={1}
              disabled={true}
              disabledText={pmaFilterData?.foreman?.name || '-'}
              isRequired
              control={control}
              label="Mandor"
              placeholder="Pilih Mandor"
              name="foremanId"
              errorText={errors?.foremanId?.message}
            />
          </View>
        </View>


        <View style={{ marginHorizontal: 4 }}>
          <SelectInput
            labelMaxLine={1}
            disabled={isEdit}
            disabledText={`${item?.user?.name || ''} - ${item?.user?.nip || ''}`}
            isRequired
            items={users.map(u => ({ label: `${u.name} - ${u.nip}`, value: u.id }))}
            control={control}
            label="Nama Karyawan"
            placeholder="Contoh: Dedi"
            name="userId"
            errorText={errors?.userId?.message}
            onChange={v => setSelectedUserId(v)}
          />
        </View>

        {fields.map((block: any, index: number) => (
          <BlockFormView
            isPortrait={dimensions.window.height > dimensions.window.width}
            // key={index}
            key={block?.id}
            idx={index}
            control={control}
            errors={errors}
            block={block}
            blocks={blocks}
            isEdit={isEdit}
            fields={fields}
            remove={remove}
            getValues={getValues}
            setValue={setValue}
          />
        ))}

        {isEdit ? null : (
          <Button style={{ alignSelf: 'flex-start', marginBottom: 16, height: 40 }} onPress={() => append(defaultBlock)}>
            <Text style={{ fontSize: 12 }} color="white">
              Tambah Blok
            </Text>
          </Button>
        )}

        <Button onPress={handleSubmit(onSubmit)}>
          <Text color="white">Simpan PMA</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PMAForm
