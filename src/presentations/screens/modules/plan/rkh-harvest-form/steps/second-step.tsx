import {Button, Text} from '@app/presentations/_shared-components'
import {useRoute, useNavigation} from '@react-navigation/native'
import React, {useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import RKHHarvestEmployeeCard from '../employee-card'
import {IRKHHarvestFormData} from '@app/models/eplant/RKHHarvest'
import Routes from '@app/presentations/navigation/Routes'
import numberWithDot from '@app/presentations/utils/numberWithDot'

interface IRKHHarvestFormSecondStepProps {
  onPrevious: () => void
  onAddEmployeeResult: (employee: any) => void
  workerWatcher: any
  fields: any[]
  errors: any
  onRemove: (item: any) => void
  onAppend: (item: any) => void
  handleSubmit: () => void
  params: any
}

const RKHHarvestFormSecondStep: React.FC<IRKHHarvestFormSecondStepProps> = props => {
  const navigation = useNavigation()

  const onRemoveEmployee = (item: any) => props.onRemove(item)

  const calculateTotalHk = () => {
    if (props.workerWatcher) {
      let qty = 0
      for (let i = 0; i < props.workerWatcher.length; i++) {
        //@ts-ignore
        if (props.workerWatcher[i].qty) {
          //@ts-ignore
          qty += props.workerWatcher[i].qty
        }
      }
      return `${qty}`
    }
    return '0'
  }

  const calculateEmployeeTotalCost = () => {
    if (props.workerWatcher) {
      let price = 0
      for (let i = 0; i < props.workerWatcher.length; i++) {
        //@ts-ignore
        if (props.workerWatcher[i].cost != undefined && props.workerWatcher[i].qty != undefined) {
          //@ts-ignore
          price += props.workerWatcher[i].cost * props.workerWatcher[i].qty
        }
      }
      return `Rp.${numberWithDot(price)}`
    }
    return 'Rp.0'
  }

  return (
    <View>
      <Button
        onPress={() => {
          //@ts-ignore
          navigation.navigate(Routes.RKH_HARVEST_FORM_EMPLOYEE, {
            onSubmit: props.onAddEmployeeResult, 
            organizationId: props.params?.organization?.id
          })
        }}>
        <Text color="white">Tambah Tenaga Kerja</Text>
      </Button>
      <View style={styles.overView}>
        <View style={styles.overViewContainer}>
          <View style={{flex: 1}}>
            <Text size={12}>Total Biaya Karyawan</Text>
            <Text type="semibold">{calculateEmployeeTotalCost()}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text size={12}>Total HK</Text>
            <Text type="semibold">{calculateTotalHk()}</Text>
          </View>
        </View>
      </View>

      {props.errors?.worker && (
        <>
          <Text style={{margin: 8}} color="red" size={11}>
            {props.errors.worker.message}
          </Text>
        </>
      )}

      {props.fields.map((item: any, index: number) => (
        <View>
          <RKHHarvestEmployeeCard key={index} item={item} onRemove={() => onRemoveEmployee(item)} />
          {props.errors?.worker?.[index] && (
            <Text key={index} style={{margin: 8}} color="red" size={11}>
              {props.errors.worker?.[index]?.id.message}
            </Text>
          )}
        </View>
      ))}

      <View style={styles.bottomBtn}>
        <Button style={[styles.halfBtn, {backgroundColor: '#9C9C9C', margin: 4}]} onPress={props.onPrevious}>
          <Text maxLines={1} color="white">Sebelumnya</Text>
        </Button>
        <Button style={[styles.halfBtn, {margin: 4, }]} onPress={props.handleSubmit}>
          <Text maxLines={1} style={{paddingHorizontal: 16}} color="white">Simpan</Text>
        </Button>
      </View>
    </View>
  )
}

export default RKHHarvestFormSecondStep

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
