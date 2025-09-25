import System from '@app/domain/services/System'
import {IRSFieldReport} from '@app/domain/states/field-report/reducers'
import {actions, RootStateType} from '@app/domain/states/store'
import {IFieldReport, IFieldReportAttachmentDetail, IFieldReportDetail} from '@app/models/eplant/FieldReport'
import Routes from '@app/presentations/navigation/Routes'
import downloadFile from '@app/presentations/utils/downloadFile'
import {theme} from '@app/presentations/utils/styles'
import {Header, Loader, ModalAsk, Text} from '@app/presentations/_shared-components'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {Linking, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import {useDispatch, useSelector} from 'react-redux'
import AttachmentCard from './attachment-card'
import FieldReportDetailInfo from './field-report-detail-info'
import RNFS from 'react-native-fs'
import FileViewer from 'react-native-file-viewer'
// import VideoCard from './videos-card'
// import Clipboard from '@react-native-clipboard/clipboard'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {useCurrentUserInfo, useIsAllowedToOrganizeFieldReport} from '@app/domain/states/user/hooks'
import {LinkPreview} from '@flyerhq/react-native-link-preview'
import * as c from '@utils/notifications/constantsNotificationt'
import * as notifications from '@utils/notifications/eksportNotification'

const FieldReportDetail = () => {
  const isAllowedToOrganize = useIsAllowedToOrganizeFieldReport()
  const user = useCurrentUserInfo()
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const route: any = useRoute()
  const parent = route?.params?.parent
  const item: IFieldReport | undefined = route?.params?.item

  const {fieldReportDetail, deleteFileFieldReportStatsu, deleteFieldReportStatus}: IRSFieldReport = useSelector(
    (state: RootStateType) => state?.fieldReportReducer,
  )
  const [itemDetail, setItemDetail] = useState<IFieldReportDetail | undefined>()
  const attachments = itemDetail?.officialReportAttachments || []
  const videos =
    itemDetail?.videos == null || itemDetail?.videos == '' || itemDetail?.videos == '[]'
      ? []
      : JSON.parse(itemDetail?.videos)

  const [selectedFile, setSelectedFile] = useState<IFieldReportAttachmentDetail | undefined>()
  const [isOpenModalDelete, setModalDelete] = useState<boolean>(false)

  const onEdit = () => {
    navigation.navigate(Routes.FIELD_REPORT_FORM, {parent, item})
  }

  const onMoreTap = () => {
    if (itemDetail) {
      navigation.navigate(Routes.COMMON_INFORMATION_LONG, {title: 'Deskripsi', description: itemDetail?.description})
    }
  }

  const onDownloadFile = (f: IFieldReportAttachmentDetail, isShouldOpen = false) => {
    const url = System.instance.fieldReportService.getDownloadUrl(f?.id)
    let fileName = `${new Date().getMilliseconds()}_${f?.name}`
    fileName = fileName.replace('/', '')
    downloadFile(url, fileName)
      .then(res => {
        showSuccessToast('File berhasil diunduh')
        if (res) {
          notifications
            .onDisplayNotificationExportFile(c.NOTIF_TITLE, c.NOTIF_BODY(fileName), c.EXPORT_NOTIFICATION_ID, {
              path: res,
            })
            .then(res => {})
            .catch(e => {})
        }
        if (isShouldOpen) {
          const dirx = RNFS.DownloadDirectoryPath
          RNFS.exists(dirx + '/' + fileName)
            .then(exist => {
              if (exist) {
                //open the file
                const path = exist ? dirx + '/' + fileName : ''
                FileViewer.open(path)
                  .then(() => {})
                  .catch(e => {
                    if (Array.isArray(e) && e.includes('Error: No app associated with this mime type')) {
                      showErrorToast('Aplikasi untuk membuka file ini tidak ditemukan.')
                    } else {
                      showErrorToast('Tidak dapat membuka file. Pastikan anda memiliki aplikasi lain untuk membukanya')
                    }
                  })
              } else {
                showErrorToast('Gagal membuka file karena file tidak ditemukan')
              }
            })
            .catch(e => {
              showErrorToast('Gagal membuka file')
            })
        }
      })
      .catch(err => {
        showErrorToast('Gagal mengunduh file')
      })
  }

  const onPreviewImage = (f: IFieldReportAttachmentDetail) => {
    navigation.navigate(Routes.FIELD_REPORT_PREVIEW_IMAGE, {
      imageUri: f?.dir,
    })
  }

  const onHandleDeleteFile = () => {
    dispatch(actions.deleteFileFieldReport.request({loading: true, data: selectedFile?.id}))
    setSelectedFile(undefined)
  }

  const onHandleDelete = () => {
    dispatch(actions.deleteFieldReport.request({loading: true, data: item?.id}))
    setModalDelete(false)
  }

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={onHandleDelete}
      isDanger
      isOpen={Boolean(isOpenModalDelete)}
      onTouchOutside={() => setModalDelete(false)}
      title={'Anda yakin ingin menghapus berita acara ini?'}
      description={'Data yang dihapus tidak akan bisa dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalDeleteFile = () => (
    <ModalAsk
      onPositiveButtonTap={onHandleDeleteFile}
      isDanger
      isOpen={Boolean(selectedFile)}
      onTouchOutside={() => setSelectedFile(undefined)}
      title={'Anda yakin ingin menghapus file ini?'}
      description={'Menghapus file ini akan menghilangkan file yang telah diupload'}
      positiveButtonText={'Hapus'}
    />
  )

  useEffect(() => {
    const error = deleteFieldReportStatus?.error
    if (error) {
      showErrorToast(error?.message || 'Gagal menghapus berita acara')
    }
    setModalDelete(false)
  }, [deleteFieldReportStatus?.error])

  useEffect(() => {
    setModalDelete(false)
    const data = deleteFieldReportStatus?.data?.data
    if (data?.code == 200) {
      showSuccessToast('Berita acara berhasil dihapus')
      navigation.goBack()
    }
  }, [deleteFieldReportStatus?.data])

  useEffect(() => {
    const error = deleteFileFieldReportStatsu?.error
    if (error) {
      showErrorToast(error?.message || 'Gagal menghapus file')
    }
    setSelectedFile(undefined)
  }, [deleteFileFieldReportStatsu?.error])

  useEffect(() => {
    setSelectedFile(undefined)
    const data = deleteFileFieldReportStatsu?.data?.data
    if (data?.code == 200) {
      dispatch(actions.detailFieldReport.request({loading: true, data: item?.id}))
      showSuccessToast('File berhasil dihapus')
    }
  }, [deleteFileFieldReportStatsu?.data])

  useEffect(() => {
    const detail = fieldReportDetail?.data
    if (detail) {
      setItemDetail(detail)
    }
  }, [fieldReportDetail?.data])

  useEffect(() => {
    dispatch(actions.detailFieldReport.request({loading: true, data: item?.id}))
  }, [isFocused])

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title="Detail Berita Acara"
        headerRight={() => (
          <TouchableOpacity
            onPress={() => {
              dispatch(actions.detailFieldReport.request({loading: true, data: item?.id}))
            }}>
            <MaterialCommunityIcons size={23} name="refresh" />
          </TouchableOpacity>
        )}
      />
      <Loader
        loading={
          Boolean(fieldReportDetail?.loading) ||
          Boolean(deleteFileFieldReportStatsu?.loading) ||
          Boolean(deleteFieldReportStatus?.loading)
        }
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <FieldReportDetailInfo
          item={item}
          parent={parent}
          onEdit={onEdit}
          itemDetail={itemDetail}
          onDelete={() => setModalDelete(true)}
          onMoreTap={onMoreTap}
          user={user}
          isAllowedToOrganize={isAllowedToOrganize}
        />

        {attachments.length > 0 && (
          <Text type="semibold" style={{margin: 16}}>
            Lampiran Dokumen
          </Text>
        )}
        {attachments.map((a: IFieldReportAttachmentDetail, index: number) => (
          <AttachmentCard
            isOwner={user?.id == item?.user?.id}
            onDelete={() => setSelectedFile(a)}
            file={a}
            key={index}
            onPreview={a?.mime?.includes('image') ? () => onPreviewImage(a) : () => {}}
            onDownload={() => onDownloadFile(a)}
            isAllowedToOrganize={isAllowedToOrganize}
          />
        ))}

        {videos.length > 0 && (
          <Text type="semibold" style={{margin: 16}}>
            Lampiran Video
          </Text>
        )}

        {videos.map((v: string, index: number) => (
          <View
            style={{
              marginHorizontal: 16,
              padding: 16,
              backgroundColor: 'white',
              borderRadius: 10,
              marginVertical: 7.5,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
              elevation: 2,
            }}>
            <LinkPreview text={v} />
          </View>

          // <VideoCard
          //   onGo={async () => {
          //     const supported = await Linking.canOpenURL(v)
          //     if (supported) {
          //       Linking.openURL(v)
          //     } else {
          //       showErrorToast('Tidak dapat membuka link ini karena link tidak valid')
          //     }
          //   }}
          //   onCopy={() => {
          //     Clipboard.setString(v)
          //     showSuccessToast('Link berhasil disalin')
          //   }}
          //   key={index}
          //   link={v}
          // />
        ))}
      </ScrollView>
      <ModalDeleteFile />
      <ModalDelete />
    </SafeAreaView>
  )
}

export default FieldReportDetail

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    // padding: 16,
  },
  scrollContent: {
    paddingBottom: 120,
  },
})
