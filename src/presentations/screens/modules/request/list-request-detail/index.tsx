import {IRSRequests} from '@app/domain/states/request/reducer'
import {actions, RootStateType} from '@app/domain/states/store'
import {IMyRequest, IMyRequestDetail} from '@app/models/eplant/MyRequest'
import {IProcessRequest, IRequestHistory} from '@app/models/eplant/Request'
import {theme} from '@app/presentations/utils/styles'
import {Button, Header, ModalGeneral, Text, TextInput} from '@app/presentations/_shared-components'
import {showErrorToast, showInfoToast} from '@app/presentations/_shared-components/Toast'
import {useIsFocused, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import ListRequestDetailHeader from './list-request-detail-header'
import ListRequestHistoryCard from './list-request-history-card'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useIsAllowedToOrganizeListOfRequest } from '@app/domain/states/user/hooks'

const validationSchemaRejection = yup.object().shape({
  notes: yup.string().required('Tulis alasan penolakan').typeError('Alasan penolakan wajib diisi'),
})

const ListRequestDetail = () => {
  const isAllowedToOrganizeListOfRequest = useIsAllowedToOrganizeListOfRequest()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const routes: any = useRoute()
  const item = routes?.params?.item
  const parent = routes?.params?.parent
  const [req, setReq] = useState<undefined | IMyRequestDetail>()
  const histories = req?.requestHistories || []

  const {myRequesstDetail, processRequestStatus}: IRSRequests = useSelector(
    (state: RootStateType) => state?.requestReducer,
  )
  const resolverRejection = useYupValidationResolver(validationSchemaRejection)

  const [selectedRequest, setSelectedRequest] = useState<IMyRequest | undefined>()

  const {
    handleSubmit: handleSubmitRejection,
    control: controlRejection,
    setValue: setValueRejection,
    getValues: getValuesRejection,
    formState: {errors: errorsRejection, isValid: isValidRejection, isDirty: isDirtyRejection},
  } = useForm({
    resolver: resolverRejection,
    mode: 'onChange',
    defaultValues: {
      notes: '',
    },
  })

  const onSubmitRejection = (form: any) => {
    Object.assign(form, {
      id: selectedRequest?.id,
      status: 'Ditolak',
    })

    dispatch(actions.processRequest.request({loading: true, data: form}))
    setSelectedRequest(undefined)
    setValueRejection('notes', '')
  }

  useEffect(() => {
    const detail = myRequesstDetail?.data
    if (detail) {
      setReq(detail)
    }
  }, [myRequesstDetail?.data])

  useEffect(() => {
    dispatch(actions.getMyRequestDetail.request({loading: true, data: item?.id}))
  }, [isFocused])

  useEffect(() => {
    const error = processRequestStatus?.error
    if (error) {
      showErrorToast(error?.message || 'Gagal menolak permintaan')
    }
    setSelectedRequest(undefined)
  }, [processRequestStatus?.error])

  useEffect(() => {
    setSelectedRequest(undefined)
    const data = processRequestStatus?.data?.data
    if (data?.code == 200) {
      dispatch(actions.getMyRequestDetail.request({loading: true, data: item?.id}))
      showInfoToast('Perubahan disimpan')
    }
  }, [processRequestStatus?.data])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Permintaan" />
      <ScrollView>
        <ListRequestDetailHeader
          isAllowedToOrganize={isAllowedToOrganizeListOfRequest}
          onReject={() => {
            setSelectedRequest(item)
          }}
          onAccept={() => {
            const obj: IProcessRequest = {
              id: item?.id,
              status: 'Disetujui',
            }
            dispatch(actions.processRequest.request({loading: true, data: obj}))
          }}
          item={item}
          itemDetail={req}
          parent={parent}
        />

        <Text style={{margin: 16}} type="semibold" size={14}>
          Riwayat Permintaan
        </Text>
        {histories.map((requestHistory: any, index: number) => (
          <ListRequestHistoryCard key={index} requestHistory={requestHistory} />
        ))}
      </ScrollView>
      <Modal animationType="fade" key={'modal-reject'} transparent={true} visible={Boolean(selectedRequest)}>
        <TouchableOpacity
          testID="onTouchOutsideButton"
          onPress={() => {
            setValueRejection('notes', '')
            setSelectedRequest(undefined)
          }}
          style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text type="semibold">Tolak Permintaan</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setValueRejection('notes', '')
                    setSelectedRequest(undefined)
                  }}>
                  <Icon name="close" size={20} color={theme.colors.textThinBlack} />
                </TouchableOpacity>
              </View>
              <Text type="semibold" size={12} style={[{marginVertical: 16}]} color={theme.colors.textThinBlack}>
                Berikan alasan terhadap permintaan yang ditolak pada kolom di bawah ini
              </Text>
              <TextInput
                errorText={errorsRejection?.notes?.message}
                multiline={true}
                isRequired
                maxLines={5}
                placeholder="Masukkan alasan penolakan"
                label="Alasan"
                control={controlRejection}
                name={'notes'}
              />

              <Button onPress={handleSubmitRejection(onSubmitRejection)}>
                <Text color="white">Tolak Permintaan</Text>
              </Button>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.6)',
  },
  footerButton: {
    marginHorizontal: 8,
  },
  modalView: {
    paddingHorizontal: 16,
    marginHorizontal: 18,
    paddingBottom: 10,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#000',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export default ListRequestDetail
