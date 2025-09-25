import {useSingleBlockById} from '@app/domain/states/block/hooks'
import {useNormaSubActivities} from '@app/domain/states/raw-material/hooks'
import {useRKHTakeCareAll} from '@app/domain/states/rkh-take-care/hooks'
import {INormSubActivity} from '@app/models/eplant/NormSubactivity'
import {Button, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {showInfoToast} from '@app/presentations/_shared-components/Toast'
import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'

interface IRKHFormFirstStepProps {
  realizationOfThisDay: number | string
  docs: any[]
  onNext: () => void
  blocks: any[]
  subActivities: any[]
  control: any
  rkh: any
  errors: any
  getValues: any
  isValid: boolean
  isEdit: boolean
  setSelectedBlock: any
  setValue: any
  setSelectedSubActivity: any
  subActivityData?: INormSubActivity
  subactivity: any
  block: any
  item: any
  valueOfTotalPlanHk: string
}
const RKHFormFirstStep: React.FC<IRKHFormFirstStepProps> = props => {
  const [haTomorrow, setHaTomorrow] = useState(props.getValues('hectaresTomorrow') || '0')

  const realizationToThisDay = props.getValues('realizationToThisDay')

  const calculatedRealizationToThisDay = realizationToThisDay

  const totalHectare = parseFloat(props.getValues('realizationToThisDay')) + parseFloat(haTomorrow)

  useEffect((): void => {
    const _totalHectare = parseFloat(calculatedRealizationToThisDay) + parseFloat(haTomorrow)
    props.setValue('totalPlanHectare', _totalHectare)
  }, [haTomorrow])

  return (
    <View>
      <SelectInput
        disabled={props.isEdit}
        disabledText={props.item?.block?.code || '-'}
        control={props.control}
        errorText={props?.errors?.blockId?.message}
        items={props.blocks}
        label="Blok"
        placeholder="Pilih Blok"
        name="blockId"
        onChange={v => {
          props.setSelectedBlock(v)
        }}
        isRequired
      />
      <SelectInput
        disabled={props.isEdit}
        disabledText={props.item?.subActivity?.name || '-'}
        control={props.control}
        errorText={props?.errors?.subActivityId?.message}
        items={props.subActivities}
        label="Sub Aktivitas"
        placeholder="Pilih Sub Aktivitas"
        name="subActivityId"
        onChange={v => {
          props.setSelectedSubActivity(v)
        }}
        isRequired
      />
      <TextInput
        disabled
        disabledText={props?.block?.blockArea?.toString() || ''}
        control={props.control}
        label="Luas Blok"
        placeholder="0"
        name="blockArea"
        isRequired
      />
      <TextInput
        disabled
        disabledText={props?.realizationOfThisDay?.toString()}
        control={props.control}
        label="Realisasi s.d Hari Ini"
        placeholder="0"
        name="realizationToThisDay"
        isRequired
      />
      <TextInput
        control={props.control}
        label="Ha Esok Hari"
        placeholder="Contoh: 2"
        name="hectaresTomorrow"
        errorText={props?.errors?.hectaresTomorrow?.message}
        onChangeText={v => {
          setHaTomorrow(v)
        }}
        isNumber
        isFloat
        isRequired
      />
      <TextInput
        disabled
        disabledText={isNaN(totalHectare) ? '0' : totalHectare.toString()}
        control={props.control}
        label="Total Ha"
        errorText={props?.errors?.totalPlanHectare?.message}
        placeholder="Contoh: 10"
        name="totalHectare"
        isRequired
      />

      <TextInput
        errorText={props?.errors?.hkPerHa?.message}
        disabled
        disabledText={props.subActivityData?.qty != undefined ? props.subActivityData?.qty?.toString() || '-' : '-'}
        control={props.control}
        label="HK/Ha"
        placeholder="Pilih Sub Aktivitas Terlebih Dahulu"
        name="hkPerHa"
        isRequired
      />
      <TextInput
        disabled
        disabledText={props.valueOfTotalPlanHk}
        control={props.control}
        label="Total HK"
        placeholder="-"
        name="totalPlanHk"
        isRequired
      />

      <Button style={styles.nextBtn} onPress={props.onNext}>
        <Text color="white">Selanjutnya</Text>
      </Button>
    </View>
  )
}

export default RKHFormFirstStep

const styles = StyleSheet.create({
  nextBtn: {
    marginBottom: 26,
    width: '50%',
    alignSelf: 'flex-end',
  },
})
