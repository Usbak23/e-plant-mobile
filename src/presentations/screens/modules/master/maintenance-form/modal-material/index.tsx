import React, {ReactNode} from 'react'
import {Modal, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'
import * as yup from 'yup'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useRawMaterialFull, useRawMaterialOptions} from '@app/domain/states/raw-material/hooks'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {theme} from '@app/presentations/utils/styles'
import {Button, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useWatch} from 'react-hook-form'
import {IRawMaterialRow} from '@app/models/eplant/RawMaterial'

interface IProps {
  organizationId: string
  isOpen?: boolean
  onTouchOutside: () => void
  children?: ReactNode
  onHandleSubmit: (form: any) => void
}

const schemaMaterial = yup.object().shape({
  materialId: yup.string().required('Material harus diisi').typeError('Material harus diisi dengan benar'),
  uomId: yup.string().required('Satuan harus diisi').typeError('Satuan harus diisi dengan benar'),
  qty: yup.number().min(0, 'Minimum adalah 0').required('Qty harus diisi').typeError('Qty harus diisi dengan benar'),
  price: yup
    .number()
    .min(0, 'Minimum adalah 0')
    .required('Harga harus diisi')
    .typeError('Harga harus diisi dengan benar'),
  totalPrice: yup
    .number()
    .min(0, 'Minimum adalah 0')
    .required('Total harus diisi')
    .typeError('Total harus diisi dengan benar'),
})

const ModalMaterial: React.FC<IProps> = props => {
  const resolver2 = useYupValidationResolver(schemaMaterial)

  const materials = useRawMaterialOptions(props.organizationId)
  const materialsFull = useRawMaterialFull()

  const {
    handleSubmit: hs,
    control: ctrl,
    setValue: sv,
    getValues: gv,
    setError: se,
    reset,
    formState: {errors: em, isValid: ivm, isDirty: idm},
  } = useForm({
    resolver: resolver2,
    mode: 'onChange',
    defaultValues: {
      materialId: '',
      uomId: '',
      qty: '',
      price: '',
      totalPrice: '',
    },
  })

  const materialIdWatcher = useWatch({
    control: ctrl,
    name: 'materialId',
    defaultValue: gv('materialId') || '',
  })

  const qtyWatcher = useWatch({
    control: ctrl,
    name: 'qty',
    defaultValue: gv('qty') || '',
  })

  const totalPriceWatcher = useWatch({
    control: ctrl,
    name: 'totalPrice',
    defaultValue: gv('totalPrice') || '',
  })

  const priceWatcher = useWatch({
    control: ctrl,
    name: 'price',
    defaultValue: gv('price') || '',
  })

  const calculateTotalPrice = (qty: string) => {
    const _price = parseFloat(gv('price') || 0)
    const _qty = isNaN(parseFloat(qty)) ? 0 : parseFloat(qty)
    return isNaN(_price * _qty)
      ? sv('totalPrice', 0, {shouldValidate: true})
      : sv('totalPrice', _price * _qty, {shouldValidate: true})
  }

  const onSubmit2 = (f: any) => {
    Object.assign(f, {
      materialName: materialsFull.find(m => m.id === f.materialId)?.name,
    })
    props.onHandleSubmit(f)
    reset({
      materialId: '',
      price: '',
      uomId: '',
      qty: '',
      totalPrice: '',
    })
  }

  return (
    <Modal animationType="none" transparent={true} visible={Boolean(props.isOpen)}>
      <TouchableOpacity
        testID="touchOutsideButton"
        style={styles.centeredView}
        onPress={() => {
          props.onTouchOutside && props.onTouchOutside()
          reset({
            materialId: '',
            price: '',
            uomId: '',
            qty: '',
            totalPrice: '',
          })
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <View style={{width: '100%'}}>
              <TouchableOpacity
                style={{alignSelf: 'flex-end'}}
                onPress={() => {
                  props.onTouchOutside && props.onTouchOutside()
                  reset({
                    materialId: '',
                    price: '',
                    uomId: '',
                    qty: '',
                    totalPrice: '',
                  })
                }}>
                <Icon name="close" size={20} color={theme.colors.textThinBlack} />
              </TouchableOpacity>

              <View style={{width: '100%', marginVertical: 8, flexDirection: 'column'}}>
                <Text style={{alignSelf: 'flex-start'}} type="semibold" size={13} color={theme.colors.textThinBlack}>
                  Tambah Material
                </Text>
                <ScrollView style={{marginTop: 16}}>
                  <SelectInput
                    value={materialIdWatcher}
                    errorText={em?.materialId?.message}
                    isRequired
                    label="Material"
                    style={{alignSelf: 'stretch'}}
                    items={materials}
                    placeholder="Pilih Material"
                    name="materialId"
                    onChange={v => {
                      sv('materialId', v, {shouldValidate: true})
                      const m = materialsFull.find((m: IRawMaterialRow) => m.id === v)
                      sv('uomId', m?.uom?.id, {shouldValidate: true})

                      sv('price', !isNaN(m?.unitPrice) ? m?.unitPrice : 0, {shouldValidate: true})
                    }}
                  />
                  <TextInput
                    isRequired
                    isNumber
                    label="Kuantitas"
                    placeholder="Contoh: 10"
                    control={ctrl}
                    name="qty"
                    errorText={em.qty?.message}
                    onChangeText={v => {
                      calculateTotalPrice(v)
                    }}
                  />

                  <TextInput
                    disabled={true}
                    disabledText={(priceWatcher || 0).toFixed(2)}
                    isRequired
                    isNumber
                    label="Biaya Per Satuan"
                    placeholder="Contoh: 10"
                    control={ctrl}
                    name="price"
                    errorText={em.price?.message}
                  />

                  <TextInput
                    disabled={true}
                    disabledText={(totalPriceWatcher|| 0).toFixed(2)}
                    isRequired
                    isNumber
                    label="Total Satuan"
                    placeholder="Contoh: 10"
                    control={ctrl}
                    name="totalPrice"
                    errorText={em.totalPrice?.message}
                  />
                  <Button style={{width: '100%'}} onPress={hs(onSubmit2)}>
                    <Text color="white">Tambah Material</Text>
                  </Button>
                </ScrollView>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

export default ModalMaterial

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.6)',
  },
  footerButton: {
    marginHorizontal: 8,
  },
  modalView: {
    alignItems: 'center',
    marginHorizontal: 18,
    paddingHorizontal: 18,
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
  centerText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  deleteButton: {marginLeft: 10},
  wrapBtn: {flexDirection: 'row', marginHorizontal: -8},
})
