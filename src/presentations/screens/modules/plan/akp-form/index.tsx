import React, {useEffect, useState} from 'react'
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'

import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useNavigation, useRoute} from '@react-navigation/native'

import {showErrorToast, showSuccessToast} from '@components/Toast'
import {Button, Text, Header, SelectInput, TextInput, ModalInfo} from '@components/index'
import {actions, RootStateType} from '@domain/states/store'

import {useDispatch, useSelector} from 'react-redux'
import {AkpLine, IAKPFormData} from '@models/eplant/AKP'

import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import {useBlocksByDivisionStd} from '@app/domain/states/block/hooks'
import {theme} from '@app/presentations/utils/styles'
import ModalForm from '@app/presentations/_shared-components/ModalForm'
import LineCard from './line-card'
import moment from 'moment'
import {useMinimumAKP} from '@app/domain/states/master/hooks'
import {useCurrentUserInfo} from '@app/domain/states/user/hooks'

let validationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib diisi!'),
  divisionId: yup.string().required('Divisi wajib diisi!'),
  blockId: yup.string().required('Blok wajib diisi!'),
  harvestDate: yup.string().required('Tanggal Panen wajib diisi!'),
})

export default function AKPForm() {
  const minimumAKP = useMinimumAKP()
  const resolver = useYupValidationResolver(validationSchema)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route: any = useRoute()
  const item = route.params?.item
  const isEdit = Boolean(item?.id || item?.tempId)
  const module = route.params?.module
  const isRelated = Boolean(module?.id)
  const user = useCurrentUserInfo()

  const {formAKPStatus, akpDetail} = useSelector((state: RootStateType) => state.akp)
  const blockAll = useSelector((state: RootStateType) => state.block.blockAll?.data || [])

  const [block, setBlock] = useState(item?.block?.id || '')
  const selectedBlock = blockAll.find(e => e.id === block)

  const blocks = useBlocksByDivisionStd(route?.params?.parent?.DIVISION?.value)

  const [lines, setLines] = useState(item?.akpLines || [])
  const [lineModal, setLineModal] = useState(false)
  const [lineForm, setLineForm] = useState({numbersOfLines: '', totalTree: '', totalBunches: '', isEdit: false})
  const [modalInfo, setModalInfo] = useState({
    isDanger: true,
    isOpen: false,
    title: '',
    message: '',
  })

  const {
    handleSubmit,
    control,
    formState: {errors, isValid, isDirty},
    setValue,
    reset,
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      ...item,
      id: item?.id,
      // organizationId: item?.block?.division?.organization?.id,
      // divisionId: item?.block?.division?.id,
      // harvestDate: moment(item?.harvestDate).format('YYYY-MM-DD'),
      organizationId: route?.params?.parent?.ORGANIZATION?.value,
      divisionId: route?.params?.parent?.DIVISION?.value,
      blockId: item?.block?.id,
      harvestDate: route?.params?.parent?.DATE || '',
      akpLines: item?.akpLines,
    },
  })

  const totalTreeBlock = selectedBlock?.totalTree
  const totalLine = selectedBlock?.numberOfLine
  const blockArea = selectedBlock?.blockArea || '-'
  const minimumTotalTree = Math.ceil((totalTreeBlock || 1) * (minimumAKP ? minimumAKP?.min / 100 : 0.1))
  const totalTrees = lines.reduce((acc: number, curr: AkpLine) => acc + parseInt(curr.totalTree), 0)

  useEffect(() => {
    const error = formAKPStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formAKPStatus?.error])

  useEffect(() => {
    const data = formAKPStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast(`${isEdit ? 'Berhasil diperbarui' : 'Berhasil dibuat'}`)
      navigation.goBack()
    }
  }, [formAKPStatus?.data])

  useEffect(() => {
    if (isEdit && akpDetail?.data?.id === item.id && !!akpDetail?.data?.numberAkp) {
      reset({
        id: akpDetail?.data?.id,
        organizationId: akpDetail?.data?.block?.division?.organization?.id,
        divisionId: akpDetail?.data?.block?.division?.id,
        blockId: akpDetail?.data?.block?.id,
        harvestDate: moment(akpDetail?.data?.harvestDate).format('YYYY-MM-DD'),
        akpLines: akpDetail?.data?.akpLines,
      })
      setLines(akpDetail?.data?.akpLines || [])
    }
  }, [akpDetail?.data])

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.getAKPDetail.request({loading: true, data: item.id}))
    }
    dispatch(actions.clearFormAKPStatus())
    dispatch(actions.getOrganizationAll.request({loading: true}))
    dispatch(actions.getAllDivision.request({loading: true}))
    dispatch(actions.getAllBlock.request({loading: true}))
  }, [])

  const showErrorAlert = (title: string, message: string) =>
    setModalInfo({
      isDanger: true,
      isOpen: true,
      title,
      message,
    })

  const onSubmit = (data: IAKPFormData) => {
    if (lines.length == 0) {
      showErrorAlert('Gagal Menambah AKP!', 'Tambah baris atau pokok untuk melanjutkan!')
      return
    }

    const isNotStandard = isNaN(totalTrees) || totalTrees < minimumTotalTree
    Object.assign(data, {
      isStandard: !isNotStandard,
      user: {
        name: user?.name,
        nip: user?.nip,
        role: {
          name: user?.role?.name,
        },
      },
    })

    Object.assign(data, {
      akpLines: lines.map((e: AkpLine) => ({
        ...e,
        totalTree: parseInt(e.totalTree),
        totalBunches: parseInt(e.totalBunches),
      })),
      block: selectedBlock,
    })

    let treeTotalInArr: number = 0
    data.akpLines.forEach(e => {
      treeTotalInArr += parseInt(e.totalTree)
    })

    if (totalTreeBlock) {
      if (treeTotalInArr > totalTreeBlock) {
        showErrorAlert('Gagal Menambah AKP!', 'Total pokok yang dimasukkan melebihi jumlah maksimum yang diperbolehkan')
        return
      }
    }

    if (data?.block?.fileGeoJson) {
      delete data?.block?.fileGeoJson
    }
    if (data?.block?.geoJson) {
      delete data?.block?.geoJson
    }

    if (data?.block?.harvestForeman) {
      delete data?.block?.harvestForeman
    }

    if (data?.block?.careForeman) {
      delete data?.block?.careForeman
    }

    if (data?.block?.harvestClerk) {
      delete data?.block?.harvestClerk
    }

    if (isEdit) {
      dispatch(actions.editAKP.request({loading: true, data}))
      return
    }
    dispatch(actions.createAKP.request({loading: true, data}))
  }

  const addLine = () => {
    if (!selectedBlock) {
      showErrorAlert('Gagal Menambah Baris!', 'Pilih Blok terlebih dahulu')
      return
    }

    if (lineForm?.numbersOfLines > totalLine) {
      showErrorAlert(
        'Gagal Menambah Baris!',
        `Baris ${lineForm.numbersOfLines} melebihi jumlah baris yang diperbolehkan`,
      )
      return
    }
    if (!lineForm.isEdit) {
      const found = lines.find((e: AkpLine) => e.numbersOfLines == lineForm.numbersOfLines)
      if (found) {
        showErrorAlert('Gagal Menambah Baris!', `Baris ${lineForm.numbersOfLines} Sudah Ada`)
        return
      }
      const newLine = [...lines, lineForm]
      setLines(newLine)
    }

    if (lineForm.isEdit) {
      const newLine = lines.map((e: AkpLine) =>
        e.numbersOfLines === lineForm.numbersOfLines ? {...e, ...lineForm} : e,
      )
      setLines(newLine)
    }
    setLineForm({numbersOfLines: '', totalTree: '', totalBunches: '', isEdit: false})
    setLineModal(false)
  }

  const deleteLine = (line: AkpLine) => {
    const newLine = lines.filter((e: AkpLine) => e.numbersOfLines !== line.numbersOfLines)
    setLines(newLine)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={isEdit ? 'Ubah AKP' : 'Tambah AKP'} />
      <View style={[styles.container, styles.contentContainer]}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <TextInput
            disabled={true}
            disabledText={route?.params?.parent?.ORGANIZATION?.label || '-'}
            control={control}
            label="Organisasi"
            placeholder="Pilih Organisasi"
            name="organizationId"
            key="organizationId"
            errorText={errors?.organizationId?.message}
            isRequired
          />
          <TextInput
            disabledText={route?.params?.parent?.DIVISION?.label || '-'}
            disabled={true}
            control={control}
            label="Kode Divisi"
            placeholder="Pilih Divisi"
            name="divisionId"
            key="divisionId"
            errorText={errors?.divisionId?.message}
            isRequired
          />

          <TextInput
            disabledText={route?.params?.parent?.DATE || '-'}
            disabled={true}
            control={control}
            label="Tanggal Panen"
            placeholder="Isi tanggal panen"
            name="harvestDate"
            key="harvestDate"
            errorText={errors?.harvestDate?.message}
            isRequired
          />

          <SelectInput
            disabledText={item?.block?.code}
            items={blocks}
            control={control}
            label="Kode Blok"
            placeholder="Pilih Blok"
            name="blockId"
            key="blockId"
            onChange={v => {
              setBlock(v)
              setLines([])
            }}
            errorText={errors?.blockId?.message}
            // disabled={Boolean(division.length === 0 || item?.id)}
            disabled={Boolean(item?.id)}
            disabledClickable={!isEdit}
            isRequired
          />

          <TextInput
            disabledText={blockArea?.toString()}
            disabled
            isRequired
            control={control}
            label="Luas Area"
            placeholder="Pilih Luas Area"
            name="blockArea"
            errorText={''}
          />

          <TextInput
            disabledText={totalTreeBlock?.toString()}
            disabled
            isRequired
            control={control}
            label="Total Pokok"
            placeholder="Pilih Blok"
            name="totalTree"
            errorText={''}
          />

          <TextInput
            disabledText={totalLine ? totalLine.toString() : ''}
            disabled
            isRequired
            control={control}
            label="Jumlah Baris"
            placeholder="Jumlah baris"
            name="totalLine"
            errorText={''}
          />

          {/* <DatePicker
            name="harvestDate"
            control={control}
            label="Tanggal Panen"
            placeholder="Pilih tanggal"
            errorText={errors?.harvestDate?.message}
            isRequired={true}
            onChangeText={value => {
              setValue('harvestDate', value, {
                shouldValidate: true,
              })
            }}
          /> */}
          <View style={styles.wrapButton}>
            <View>
              <Text size={10} color={theme.colors.primary}>
                Minimal Pokok
              </Text>
              <Text size={13} type="semibold" color={theme.colors.primary}>
                {selectedBlock ? minimumTotalTree : '-'}
              </Text>
            </View>
            <View>
              <Text size={10} color={theme.colors.primary}>
                Total Pokok
              </Text>
              <Text size={13} type="semibold" color={theme.colors.primary}>
                {totalTrees}
              </Text>
            </View>
            <Button
              style={styles.addBlockButton}
              onPress={() => {
                if (!selectedBlock) {
                  showErrorAlert('Peringatan!', 'Pilih Blok terlebih dahulu')
                  return
                }
                setLineForm({numbersOfLines: '', totalTree: '', totalBunches: '', isEdit: false})
                setLineModal(true)
              }}>
              <Text size={10} style={styles.addBlockButtonText}>
                Tambah Baris
              </Text>
            </Button>
          </View>
          {lines.map((line: AkpLine) => (
            <LineCard
              key={line.numbersOfLines}
              item={line}
              deleteLine={deleteLine}
              onEdit={() => {
                setLineForm({...line, isEdit: true})
                setLineModal(true)
              }}
            />
          ))}
          <ModalForm
            title={lineForm.isEdit ? 'Ubah Baris' : 'Tambah Baris'}
            isOpen={lineModal}
            onTouchOutside={() => setLineModal(false)}
            onClose={() => setLineModal(false)}>
            <TextInput
              value={lineForm.numbersOfLines}
              control={control}
              disabled={lineForm.isEdit}
              disabledText={lineForm.numbersOfLines}
              label="No. Baris"
              placeholder="Contoh : Baris 1"
              name=""
              onChangeText={numbersOfLines => setLineForm({...lineForm, numbersOfLines})}
              isRequired
              isNumber
            />
            <TextInput
              value={lineForm.totalTree}
              control={control}
              label="Total Pokok"
              placeholder="Contoh : Baris 100"
              name=""
              onChangeText={totalTree => setLineForm({...lineForm, totalTree})}
              isRequired
              isNumber
            />
            <TextInput
              value={lineForm.totalBunches}
              control={control}
              placeholder="0"
              label="Total Tandan"
              name=""
              onChangeText={totalBunches => setLineForm({...lineForm, totalBunches})}
              isRequired
              isNumber
            />
            <Button
              onPress={addLine}
              disabled={Boolean(
                lineForm?.numbersOfLines.length === 0 ||
                  lineForm?.totalBunches.length === 0 ||
                  lineForm?.totalTree.length === 0,
              )}>
              <Text color="white">{lineForm.isEdit ? 'Ubah Baris' : 'Tambah Baris'}</Text>
            </Button>
          </ModalForm>
        </ScrollView>
        <View style={{position: 'absolute', bottom: 6, flex: 1, width: '100%', alignSelf: 'center'}}>
          <Button disabled={Boolean(formAKPStatus?.loading || !isValid)} onPress={handleSubmit(onSubmit)}>
            <Text color="white">{formAKPStatus?.loading ? 'Loading...' : isEdit ? 'Ubah AKP' : 'Tambah AKP'}</Text>
          </Button>
        </View>
        <ModalInfo
          title={modalInfo.title}
          description={modalInfo.isDanger ? modalInfo.message : undefined}
          isDanger={modalInfo.isDanger}
          isOpen={modalInfo.isOpen}
          onTouchOutside={() => setModalInfo({...modalInfo, isOpen: false})}
          onPositiveButtonTap={() => setModalInfo({...modalInfo, isOpen: false})}
        />
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingHorizontal: 18,
  },
  scrollView: {
    paddingBottom: 100,
  },
  addBlockButton: {
    backgroundColor: theme.colors.black,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addBlockButtonText: {
    color: theme.colors.white,
  },
  wrapButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
})
