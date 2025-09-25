import Routes from '@app/presentations/navigation/Routes'
import {Button, Text} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/native'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import RKHHarvestEmployeeCard from '../../rkh-harvest-form/employee-card'
import * as schema from '@utils/validation/rkh-harvest-add-employee-validation'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useFieldArray} from 'react-hook-form'
import {useSelector} from 'react-redux'
import {RootStateType} from '@app/domain/states/store'
import RKHTakeCareMaterialCard from '../material-card'
import numberWithDot from '@app/presentations/utils/numberWithDot'

interface IRKHFormSecondStepProps {
  onPrevious: () => void
  onNext: () => void
  control: any
  watch: any
  params: any
}

const RKHFormSecondStep: React.FC<IRKHFormSecondStepProps> = props => {
  const navigation = useNavigation()
  const route: any = useRoute()
  const {formRKHTakeCareStatus} = useSelector((state: RootStateType) => state?.rkhTakeCare)

  const {fields, append, remove} = useFieldArray({
    control: props.control,
    //@ts-ignore
    name: 'material',
  })

  const watcher = props.watch('material', [])

  const onRemoveEmployee = (item: any) => {
    remove(item)
  }

  // 353
  const onAddEmployeeResult = (param: {
    id: string
    cost: number
    qty: number
    name: string
    roleCategory: string[]
  }) => {
    param.cost = parseInt(param.cost.toString())
    const currentExistWorker = fields.find((material: any) => material?._id == param?.id)
    if (currentExistWorker) {
      Object.assign(param, {_id: param.id})
      remove(currentExistWorker)
      append(param)
      return
    }
    Object.assign(param, {_id: param.id})
    append(param)
  }

  const calculateTotalQty = () => {
    if (watcher) {
      let price = 0
      for (let i = 0; i < watcher.length; i++) {
        //@ts-ignore
        if (watcher[i].qty) {
          //@ts-ignore
          price += watcher[i].qty
        }
      }
      return `${numberWithDot(price)}`
    }
    return '0'
  }

  const calculateTotalCost = () => {
    if (watcher) {
      let price = 0
      for (let i = 0; i < watcher.length; i++) {
        //@ts-ignore
        if (watcher[i].cost != undefined && watcher[i].qty != undefined) {
          //@ts-ignore
          price += watcher[i].cost * watcher[i].qty
        }
      }
      return `Rp.${numberWithDot(price)}`
    }
    return 'Rp.0'
  }

  return (
    <View style={{flex: 1}}>
      <Button
        onPress={() => {
          //@ts-ignore
          navigation.navigate(Routes.RKH_TAKE_CARE_FORM_MATERIAL, {
            onSubmit: onAddEmployeeResult,
            organizationId: props.params?.organizationId,
          })
        }}>
        <Text color="white">Tambah Material</Text>
      </Button>
      <View style={styles.overView}>
        <View style={styles.overViewContainer}>
          <View style={{flex: 1}}>
            <Text size={12}>Total Biaya Material</Text>
            <Text type="semibold">{calculateTotalCost()}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text size={12}>Total Kuantitas</Text>
            <Text type="semibold">{calculateTotalQty()}</Text>
          </View>
        </View>
      </View>

      {fields.map((item: any, index: number) => (
        <RKHTakeCareMaterialCard key={index} item={item} onRemove={() => onRemoveEmployee(item)} />
      ))}

      <View style={styles.bottomBtn}>
        <Button
          disabled={Boolean(formRKHTakeCareStatus?.loading)}
          style={[styles.halfBtn, {backgroundColor: '#9C9C9C', marginEnd: 4}]}
          onPress={props.onPrevious}>
          <Text maxLines={1} color="white">
            Sebelumnya
          </Text>
        </Button>
        <Button
          style={[styles.halfBtn, {marginEnd: 4}]}
          disabled={Boolean(formRKHTakeCareStatus?.loading)}
          onPress={props.onNext}>
          <Text maxLines={1} style={{paddingHorizontal: 18}} color="white">
            {formRKHTakeCareStatus?.loading ? 'Loading...' : 'Simpan'}
          </Text>
        </Button>
      </View>
    </View>
  )
}

export default RKHFormSecondStep

const styles = StyleSheet.create({
  overView: {
    borderRadius: 10,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F0F0F0',
  },
  overViewContainer: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
  },
  halfBtn: {
    marginBottom: 26,
    alignSelf: 'flex-end',
  },
  bottomBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 16,
  },
})
