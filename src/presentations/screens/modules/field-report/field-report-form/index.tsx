import {theme} from '@app/presentations/utils/styles'
import {Button, DatePicker, Header, Loader, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useDispatch, useSelector} from 'react-redux'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {useCurrentUserInfo} from '@app/domain/states/user/hooks'
import {useBlocksByDivisionStd} from '@app/domain/states/block/hooks'
import {SUB_ACTIVITY_CATEGORY} from '@app/models/eplant/SubActivity'
import {useSubActivityOptionsCode} from '@app/domain/states/subactivity/hooks'
import {useFieldArray} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FieldReportAttachment from './field-report-attachment'
import IconFile from '@assets/icons/ic_file.svg'
import { pick, keepLocalCopy } from '@react-native-documents/picker'
import FieldAttachment from './file-attachment'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {IRSFieldReport} from '@app/domain/states/field-report/reducers'
import {actions, RootStateType} from '@app/domain/states/store'
import {IFieldReportAttachmentDetail, IFieldReportDetail, IFieldReportForm} from '@app/models/eplant/FieldReport'
import FieldReportService from '@app/domain/services/eplant/FieldReportService'
import System from '@app/domain/services/System'
import {getToken} from '@app/domain/services/utils/Axios'
import RNFetchBlob from 'rn-fetch-blob'

const videoSchema = yup.object().shape({
  // link: yup.string().required('Link video harus diisi').typeError('Isi link video dengan benar'),
  link: yup.string().url('URL tidak valid').required('Link video harus diisi').typeError('Isi link video dengan benar'),
})

const fileSchema = yup.object().shape({
  file: yup
    .mixed()
    .required('File lampiran wajib diisi')
    .test('file', 'Belum ada file yang dipilih', v => {
      if (Object.keys(v).length == 0) {
        return false
      }
      return true
    })
    .test('fileSize', 'File terlalu besar', value => {
      if (value?.size && value.size > 2000000) {
        return false
      }
      return true
    }),
})

const validationSchema = yup.object().shape({
  subject: yup.string().required('Subjek wajib diisi').typeError('Isi subjek dengan benar'),
  description: yup.string().required('Deskripsi wajib diisi').typeError('Isi deskripsi dengan benar'),
  date: yup.string().required('Tanggal wajib diisi').typeError('Masukkan tanggal dengan benar'),
  subActivityCategory: yup.string().nullable().typeError('Masukkan kategori dengan benar'),
  subActivityId: yup.string().nullable().typeError('Masukkan sub-aktivitas dengan benar'),
  blockId: yup.string().nullable().typeError('Masukkan blok dengan benar'),
  videos: yup.array().of(videoSchema).typeError('Isi lampiran video dengan benar'),
  files: yup.array().of(fileSchema).typeError('Isi lampiran file dengan benar').max(5, 'Maksimum 5 lampiran'),
})

const FieldReportForm = () => {
  const user = useCurrentUserInfo()
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const item = route.params?.item
  const parent = route?.params?.parent

  const resolver = useYupValidationResolver(validationSchema)
  const {formFieldReportStatus, fieldReportDetail}: IRSFieldReport = useSelector(
    (state: RootStateType) => state?.fieldReportReducer,
  )

  const isEdit = Boolean(item?.id)

  const constructVideos = (vids: any = []) => {
    if (!isEdit) {
      return []
    }

    if (vids.length == 0) {
      return []
    }

    if (Array.isArray(vids)) {
      return vids.map((vid: string, i: number) => {
        return {
          id: i.toString(),
          link: vid,
        }
      })
    } else if (typeof vids === 'string') {
      return [
        {
          id: '0',
          link: vids,
        },
      ]
    }
    return []
  }

  const constructFiles = (fls: any = []) => {
    if (!isEdit) {
      return []
    }

    if (fls.length == 0) {
      return []
    }

    return fls.map((f: IFieldReportAttachmentDetail, i: number) => ({
      id: i.toString(),
      file: f,
    }))
  }

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      subject: isEdit ? item?.subject : '',
      date: isEdit ? item?.date : '',
      subActivityCategory: isEdit ? item?.subActivity?.category : '',
      subActivityId: isEdit ? item?.subActivity?.id : '',
      blockId: isEdit ? item?.block?.id : '',
      description: isEdit ? item?.description : '',
      category: isEdit ? item?.category : '',
      videos: [],
      files: constructFiles(),
    },
  })

  const {fields, append, remove} = useFieldArray({
    control,
    //@ts-ignore
    name: 'videos',
  })

  const {
    fields: fieldsFile,
    append: appendFile,
    remove: removeFile,
  } = useFieldArray({
    control,
    //@ts-ignore
    name: 'files',
  })

  const blocks = useBlocksByDivisionStd(parent?.division?.value)
  const [selectedSubActvityCategory, setSelectedSubActivityCategory] = useState('')
  const subActivities = useSubActivityOptionsCode(selectedSubActvityCategory)

  const chooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.csv,
        ],
        allowMultiSelection: false,
      })
      if (res[0]?.size >= 2000000) {
        showErrorToast('File terlalu besar')
        return
      }

      if (fieldsFile.length >= 5) {
        showErrorToast('Maksimum adalah 5 lampiran file')
        return
      }
      appendFile({file: res[0]})
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err
      }
    }
  }

  const onDeleteFile = (index: number) => {
    removeFile(index)
  }

  const onDeleteVideo = (index: number) => {
    remove(index)
  }

  const generateOpts = async (form: any) => {
    const token = await getToken()

    const fs: {path: string; field: string}[] =
      form.files
        .filter((t: any) => t?.id == undefined)
        .map((x: any) => {
          return {
            path: x.uri,
            field: 'files',
          }
        }) || []

    const opt: any = {
      url: isEdit
        ? System.instance.fieldReportService.getUpdateFieldReportUrl(item?.id || '')
        : System.instance.fieldReportService.getCreateFieldReportUrl(),
      method: isEdit ? 'PUT' : 'POST',
      files: fs,
      notification: {
        enabled: true,
        onProgressTitle: 'Mengunggah berita acara...',
        onErrorTitle: 'Gagal mengunggah berita acara',
        onErrorMessage: 'Berita acara gagal diunggah. Coba lagi dan pastikan internet anda memadai',
        onCompleteTitle: 'Berita acara berhasil diunggah',
        onCompleteMessage: 'Muat ulang halaman berita acara untuk melihat perubahan',
        enableRingtone: true,
        notificationChannel: 'arvis-eplantation-upload-service',
        autoClear: true,
      },
      parameters: {
        videos: [],
        subject: form.subject,
        date: form.date,
        description: form.description,
        divisionId: parent?.division?.value

      },
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: token,
      },
    }

    if (form.videos != '[]' && form.videos != '') {
      Object.assign(opt.parameters, {
        videos: form.videos,
      })
    }

    if (form.blockId) {
      Object.assign(opt.parameters, {
        blockId: form.blockId,
      })
    }

    if (form.category) {
      Object.assign(opt.parameters, {
        category: form.category,
      })
    }

    if (form.subActivityId) {
      Object.assign(opt.parameters, {
        subActivityId: form.subActivityId,
      })
    }

    return opt
  }

  const onSubmit = async (form: any) => {
    const videosTrimmed = form.videos.map((video: {link: string; id: string}) => {
      return video.link
    })
    const filesTrimmed = form.files.map((file: {file: any; id: string}) => {
      return file.file
    })

    // form.videos = videosTrimmed
    form.videos = JSON.stringify(videosTrimmed)
    form.files = filesTrimmed

    const options = await generateOpts(form)

    Upload.startUpload(options)
      .then(uploadId => {
        Upload.addListener('progress', uploadId, data => {
          // console.log(`Progress: ${data.progress}%`)
        })
        Upload.addListener('error', uploadId, data => {
          console.log(`Error: ${data}`)
        })
        Upload.addListener('cancelled', uploadId, data => {
          console.log('Cancelled!')
        })
        Upload.addListener('completed', uploadId, data => {
          // data includes responseCode: number and responseBody: Object
          console.log('completed:', JSON.stringify(data?.responseBody))
        })
      })
      .catch(err => {
        // console.log('Upload error!', err)
      })

    navigation.goBack()
    showInfoToast('Upload sedang dalam proses latar belakang. Lihat notifikasi untuk melihatnya')
  }

  useEffect(() => {
    const error = formFieldReportStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formFieldReportStatus?.error])

  useEffect(() => {
    const data = formFieldReportStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Perubahan disimpan')
      navigation.goBack()
    }
  }, [formFieldReportStatus?.data])

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.detailFieldReport.request({loading: true, data: item?.id}))
    }
  }, [])

  useEffect(() => {
    if (isEdit) {
      if (fieldReportDetail?.error) {
        showErrorToast(fieldReportDetail?.error?.message || 'Gagal saat memuat data')
        return
      }

      const detail = fieldReportDetail?.data
      if (detail) {
        const vids =
          detail?.videos == null || detail?.videos == '' || detail?.videos == '[]' ? [] : JSON.parse(detail?.videos)
        reset({
          subject: detail?.subject || '',
          date: detail?.date || '',
          subActivityCategory: detail?.subActivity?.category || '',
          subActivityId: detail?.subActivity?.id || '',
          blockId: detail?.block?.id || '',
          description: detail?.description || '',
          category: detail?.category || '',
          videos: constructVideos(vids || []),
          files: constructFiles(detail?.officialReportAttachments || []),
        })
      }
    }
  }, [fieldReportDetail?.data])

  // const removeFieldArray = (index: number) => {
  //   const filteresFields = fields.filter((f: any) => )
  // }

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah Berita Acara' : 'Tambah Berita Acara'} />
      <Loader loading={Boolean(formFieldReportStatus?.loading) || Boolean(fieldReportDetail?.loading)} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <TextInput
          disabled={true}
          disabledText={parent?.organization?.label || '-'}
          label="Organisasi"
          control={{}}
          name={'organizationId'}
        />
        <TextInput
          disabled={true}
          disabledText={parent?.division?.label || '-'}
          label="Divisi"
          control={{}}
          name={'divisionId'}
        />

        <TextInput
          placeholder="Contoh: Jalan Terhambat"
          label="Subjek"
          control={control}
          name={'subject'}
          errorText={errors?.subject?.message}
          isRequired
        />

        {isEdit ? (
          <TextInput
            disabled={true}
            disabledText={getValues('date')}
            placeholder="Tanggal"
            label="Tanggal"
            control={control}
            name={'date'}
            errorText={errors?.date?.message}
            isRequired
          />
        ) : (
          <DatePicker
            minimumDate={new Date(parseInt(parent?.year), parseInt(parent?.month?.value) - 1, 1)}
            maximumDate={new Date(parseInt(parent?.year), parseInt(parent?.month?.value), 0)}
            name="date"
            control={control}
            label="Tanggal"
            placeholder="Pilih tanggal"
            errorText={errors?.date?.message}
            isRequired={true}
            onChangeText={value => {
              setValue('date', value, {
                shouldValidate: true,
              })
            }}
          />
        )}

        <TextInput
          disabled={true}
          disabledText={isEdit ? fieldReportDetail?.data?.user?.name || '-' : user?.name || '-'}
          label="Karyawan"
          control={{}}
          name={'user'}
        />

        {isEdit ? (
          <TextInput
            disabled={true}
            disabledText={fieldReportDetail?.data?.block?.code || '-'}
            placeholder="Blok"
            label="Blok"
            control={control}
            name={'blockId'}
            errorText={errors?.blockId?.message}
            isRequired
          />
        ) : (
          <SelectInput
            items={blocks}
            control={control}
            label="Blok"
            placeholder="Pilih blok"
            name="blockId"
            errorText={errors?.blockId?.message}
          />
        )}

        {isEdit ? (
          <TextInput
            disabled={true}
            disabledText={fieldReportDetail?.data?.category || '-'}
            placeholder="Kategori"
            label="Kategori"
            control={control}
            name={'category'}
            errorText={errors?.category?.message}
            isRequired
          />
        ) : (
          <SelectInput
            items={SUB_ACTIVITY_CATEGORY}
            control={control}
            label="Kategori"
            placeholder="Pilih Kategori Sub-Aktivitas"
            name="subActivityCategory"
            errorText={errors?.subActivityCategory?.message}
            onChange={value => {
              setValue('category', value)
              setSelectedSubActivityCategory(value)
              setValue('subActivityId', '', {
                shouldValidate: true,
              })
            }}
          />
        )}

        {isEdit ? (
          <TextInput
            disabled={true}
            disabledText={fieldReportDetail?.data?.subActivity?.name || '-'}
            placeholder="Sub Aktivitas"
            label="Sub Aktivitas"
            control={control}
            name={'subActivtyId'}
            errorText={errors?.subActivityId?.message}
            isRequired
          />
        ) : (
          <SelectInput
            items={selectedSubActvityCategory == '' ? [] : subActivities}
            control={control}
            label="Sub Aktivitas"
            placeholder="Pilih Sub-Aktivitas"
            name="subActivityId"
            errorText={errors?.subActivityId?.message}
          />
        )}

        <TextInput
          errorText={errors?.description?.message}
          multiline={true}
          isRequired
          maxLines={5}
          placeholder="Contoh: Terdapat masalah di jalan menuju divisi A karena ada pohon tumbang"
          label="Deskripsi"
          control={control}
          name={'description'}
        />

        {fieldsFile.length >= 5 ? null : (
          <FieldReportAttachment
            title={fieldsFile.length > 0 ? 'Tambah File' : 'Pilih File'}
            onChooseFile={async () => {
              if (fieldsFile.length < 10) {
                chooseFile()
              } else {
                showInfoToast('Maksimum jumlah lampiran adalah 5')
              }
            }}
          />
        )}

        {fieldsFile.map((f: any, index: number) => (
          <FieldAttachment
            key={f?.id}
            title={f?.file?.name || '-'}
            onDelete={() => onDeleteFile(index)}
            hideDelete={Boolean(f?.file?.id)}
          />
        ))}

        {fields.map((s: any, index: number) => (
          <View style={styles.videoFieldContainer} key={s?.id}>
            <TouchableOpacity onPress={() => onDeleteVideo(index)} style={{alignSelf: 'flex-end'}}>
              <Icon name="delete" size={24} color={theme.colors.textThinBlack} />
            </TouchableOpacity>
            <TextInput
              label={`Link Video ${index + 1}`}
              control={control}
              name={`videos[${index}].link`}
              errorText={errors?.[`videos[${index}].link`]?.message}
              placeholder="Masukkan link video."
              isRequired
            />
          </View>
        ))}

        <Button
          style={styles.videoButton}
          onPress={() => {
            append({link: ''})
          }}>
          <Text size={11} color="white">
            Tambah Lampiran Video
          </Text>
        </Button>

        <Button disabled={Boolean(fieldReportDetail?.loading)} onPress={handleSubmit(onSubmit)}>
          <Text color="white">Simpan</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FieldReportForm

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  videoField: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  videoFieldContainer: {
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  videoDeleteButton: {
    backgroundColor: theme.colors.grey,
    borderRadius: 8,
    alignItems: 'center',
    padding: 8,
  },
  videoButton: {alignSelf: 'flex-start', marginBottom: 16, height: 40},
})
