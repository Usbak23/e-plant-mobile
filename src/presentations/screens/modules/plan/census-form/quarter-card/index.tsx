import {Text, TextInput} from '@app/presentations/_shared-components'
import React from 'react'
import {useWatch} from 'react-hook-form'
import {StyleSheet, View} from 'react-native'

interface IQuarterCardProps {
  item?: any
  control: any
  getValuesThirdPage: any
  getValuesSecondPage: any
  setValueThirdPage: any
  namePercentage: string
  nameScatter: string
  nameJanjangPerMonth: string
  errorText: any
  errorTextScatter: any
  errorTextJanjangPerMonth: any
}

const QuarterCard: React.FC<IQuarterCardProps> = props => {
  const {
    item,
    control,
    namePercentage,
    nameScatter,
    nameJanjangPerMonth,
    errorText,
    getValuesSecondPage,
    getValuesThirdPage,
    setValueThirdPage,
    errorTextScatter,
    errorTextJanjangPerMonth,
  } = props

  const setScatterDefaultValue = () => {
    const percentage = parseFloat(getValuesThirdPage(namePercentage))
    const tonnage = parseFloat(getValuesSecondPage('totalTonnage'))
    if (isNaN(tonnage) || isNaN(percentage)) {
      return ''
    } else {
      const scatter = tonnage * (percentage / 100)
      if (scatter) {
        return scatter.toFixed(2)
      }
      return ''
    }
  }

  const setJanjangPerMonthDefaultValue = () => {
    const percentage = parseFloat(getValuesThirdPage(namePercentage))
    const janjangPerMonthTemp = parseFloat(getValuesSecondPage('totalFruitOfBlock'))

    if (isNaN(percentage) || isNaN(janjangPerMonthTemp)) {
      return ''
    } else {
      const janjang = janjangPerMonthTemp * (percentage / 100)

      if (janjang) {
        return janjang.toFixed(2)
      }
      return ''
    }
  }

  const scatterWatcher = useWatch({
    control: control,
    name: nameScatter,
    defaultValue: setScatterDefaultValue(),
  })

  const janjangPerMonthWatcher = useWatch({
    control: control,
    name: nameJanjangPerMonth,
    defaultValue: setJanjangPerMonthDefaultValue(),
  })

  const calculateScatter = (percentage: string) => {
    const tempPercentage = parseFloat(percentage)
    const tonnage = parseFloat(getValuesSecondPage('totalTonnage'))
    if (isNaN(tonnage) || isNaN(tempPercentage)) {
      setValueThirdPage(nameScatter, '', {shouldValidate: true})
    } else {
      const scatter = tonnage * (tempPercentage / 100)
      if (scatter) {
        setValueThirdPage(nameScatter, scatter.toFixed(2), {shouldValidate: true})
        return
      }
      setValueThirdPage(nameScatter, '', {shouldValidate: true})
    }
  }

  const calculateJanjangPerMonth = (percentage: string) => {
    const tempPercentage = parseFloat(percentage)
    const currentJanjangPerBlock = parseFloat(getValuesSecondPage('totalFruitOfBlock'))
    if (isNaN(currentJanjangPerBlock) || isNaN(tempPercentage)) {
      setValueThirdPage(nameJanjangPerMonth, '', {shouldValidate: true})
    } else {
      const _janjangPerMonth = currentJanjangPerBlock * (tempPercentage / 100)
      if (_janjangPerMonth) {
        setValueThirdPage(nameJanjangPerMonth, _janjangPerMonth.toFixed(2), {shouldValidate: true})
        return
      }
      setValueThirdPage(nameJanjangPerMonth, '', {shouldValidate: true})
    }
  }

  return (
    <View style={styles.root}>
      <TextInput
        disabled
        disabledText={item?.labelMonth || '-'}
        control={control}
        label="Bulan"
        placeholder="Bulan"
        name="month"
        isRequired
      />
      <TextInput
        isFloat={true}
        isNumber
        control={control}
        label="Persentase"
        placeholder="Contoh: 10"
        name={namePercentage}
        errorText={errorText || ''}
        isRequired
        onChangeText={v => {
          calculateScatter(v)
          calculateJanjangPerMonth(v)
        }}
      />
      <TextInput
        disabled
        disabledText={scatterWatcher}
        control={control}
        label="Total Tonase"
        placeholder="Total Tonase"
        name={nameScatter}
        errorText={errorTextScatter || ''}
        isRequired
      />
      <TextInput
        disabled
        disabledText={janjangPerMonthWatcher}
        control={control}
        label="Janjang Per Bulan"
        placeholder="Janjang Per Bulan"
        name={nameJanjangPerMonth}
        errorText={errorTextJanjangPerMonth || ''}
        isRequired
      />
    </View>
  )
}

export default QuarterCard

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
  },
})
