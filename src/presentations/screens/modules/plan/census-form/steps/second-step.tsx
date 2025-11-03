import {Button, Text, TextInput} from '@app/presentations/_shared-components'
import React from 'react'
import {useWatch} from 'react-hook-form'

import {StyleSheet, View} from 'react-native'

interface ISecondPageProps {
  controlSecondPage: any
  errorsSecondPage: any
  setCurrentPage: any
  handleSubmitSecondPage: any
  setValueSecondPage: any
  getValuesSecondPage: any
  getValuesFirstPage: any
  validateSecondStep: any
  resetSecondPage: any
  goToFirstStep: any
  singleBlock: any
}

const SecondPage: React.FC<ISecondPageProps> = props => {
  const {
    controlSecondPage,
    errorsSecondPage,
    setCurrentPage,
    setValueSecondPage,
    handleSubmitSecondPage,
    validateSecondStep,
    getValuesSecondPage,
    getValuesFirstPage,
    resetSecondPage,
    goToFirstStep,
    singleBlock,
  } = props

  const setAverageFruitDefaultValue = () => {
    const totalFruitAsInt = parseInt(getValuesSecondPage('totalFruit'))
    const totalTreeCheckedAsInt = parseInt(getValuesSecondPage('totalTreeChecked'))
    if (isNaN(totalFruitAsInt) || isNaN(totalTreeCheckedAsInt)) {
      return ''
    } else {
      const average = totalFruitAsInt / totalTreeCheckedAsInt
      if (average) {
        return average.toFixed(2).toString()
      }
      return ''
    }
  }

  const setFruitPerBlockDefaultValue = () => {
    const totalTree = parseInt(getValuesFirstPage('totalTree'))
    const averageFruitAsInt = parseFloat(getValuesSecondPage('averageFruit'))
    if (isNaN(averageFruitAsInt) || isNaN(totalTree)) {
      return ''
    } else {
      const fruitPerBlock = averageFruitAsInt * totalTree
      if (fruitPerBlock) {
        return fruitPerBlock.toFixed(2).toString()
      }
      return ''
    }
  }

  const setTotalTonnageDefaultValue = () => {
    const bjr = parseFloat(getValuesSecondPage('bjr'))
    const fruitPerPerBlock = parseFloat(getValuesSecondPage('totalFruitOfBlock'))
    if (isNaN(bjr) || isNaN(fruitPerPerBlock)) {
      return ''
    } else {
      const tonnage = fruitPerPerBlock * bjr
      if (tonnage) {
        return tonnage.toFixed(2).toString()
      }
      return ''
    }
  }

  const setTonnagePerHectare = () => {
    const blockArea = parseFloat(singleBlock?.blockArea ? singleBlock?.blockArea?.toString() : '')
    const tonnage = parseFloat(getValuesSecondPage('totalTonnage'))
    if (isNaN(blockArea) || isNaN(tonnage)) {
      return ''
    } else {
      const tonnagePerHectare = tonnage / 1000 / blockArea
      if (tonnagePerHectare && isFinite(tonnagePerHectare)) {
        return tonnagePerHectare.toFixed(2).toString()
      }
      return ''
    }
  }

  const averageWatcher = useWatch({
    control: controlSecondPage,
    name: 'averageFruit',
    defaultValue: setAverageFruitDefaultValue(),
  })

  const fruitPerBlockWatcher = useWatch({
    control: controlSecondPage,
    name: 'totalFruitOfBlock',
    defaultValue: setFruitPerBlockDefaultValue(),
  })

  const tonnageWatcher = useWatch({
    control: controlSecondPage,
    name: 'totalTonnage',
    defaultValue: setTotalTonnageDefaultValue(),
  })

  const tonnagePerHectareWatcher = useWatch({
    control: controlSecondPage,
    name: 'tonnagePerHectare',
    defaultValue: setTonnagePerHectare(),
  })

  const calculateFruitPerBlock = (averageFruit: string) => {
    const averageFruitAsInt = parseFloat(averageFruit)
    const totalTreeAsInt = parseInt(getValuesFirstPage('totalTree'))

    if (isNaN(averageFruitAsInt) || isNaN(totalTreeAsInt)) {
      setValueSecondPage('totalFruitOfBlock', '', {shouldValidate: true})
      setValueSecondPage('totalTonnage', '', {shouldValidate: true})
    } else {
      const fruitPerBlock = averageFruitAsInt * totalTreeAsInt
      if (fruitPerBlock || fruitPerBlock == 0) {
        setValueSecondPage('totalFruitOfBlock', fruitPerBlock.toFixed(2).toString(), {
          shouldValidate: true,
        })
        calculateTonnage(undefined, fruitPerBlock.toString())
      }
    }
  }

  const calculateAverageFruit = (totalTreeChecked?: string, totalFruit?: string) => {
    const totalTreeAsInt = totalTreeChecked
      ? parseInt(totalTreeChecked)
      : parseInt(getValuesSecondPage('totalTreeChecked'))
    const totalFruitAsInt = totalFruit ? parseInt(totalFruit) : parseInt(getValuesSecondPage('totalFruit'))

    if (isNaN(totalFruitAsInt) || isNaN(totalTreeAsInt)) {
      setValueSecondPage('averageFruit', '', {shouldValidate: true})
      setValueSecondPage('totalFruitOfBlock', '', {shouldValidate: true})
    } else {
      const average = totalFruitAsInt / totalTreeAsInt
      if ((average || average == 0) && isFinite(average)) {
        setValueSecondPage('averageFruit', average.toFixed(2).toString(), {shouldValidate: true})
        calculateFruitPerBlock(average.toString())
        return
      }
      setValueSecondPage('averageFruit', '', {shouldValidate: true})
      setValueSecondPage('totalFruitOfBlock', '', {shouldValidate: true})
    }
  }

  const calculateTonnage = (bjr?: string, fruitPerBlock?: string) => {
    const tempBjr = bjr ? parseFloat(bjr) : parseFloat(getValuesSecondPage('bjr'))
    const tempFruitPerBlock = fruitPerBlock
      ? parseFloat(fruitPerBlock)
      : parseFloat(getValuesSecondPage('totalFruitOfBlock'))

    if (isNaN(tempBjr) || isNaN(tempFruitPerBlock)) {
      setValueSecondPage('totalTonnage', '', {shouldValidate: true})
      setValueSecondPage('tonnagePerHectare', '', {shouldValidate: true})
    } else {
      const totalTonnage = tempFruitPerBlock * tempBjr
      if (totalTonnage || totalTonnage == 0) {
        setValueSecondPage('totalTonnage', totalTonnage.toFixed(2).toString(), {shouldValidate: true})
        calculateTonPerHa(totalTonnage.toString())
      } else {
        setValueSecondPage('totalTonnage', '', {shouldValidate: true})
        setValueSecondPage('tonnagePerHectare', '', {shouldValidate: true})
      }
    }
  }

  const calculateTonPerHa = (tonnage?: string) => {
    const tempTonnage = tonnage ? parseFloat(tonnage) : parseFloat(getValuesSecondPage('tonnage'))
    const tempBlockArea = parseFloat(singleBlock?.blockArea ? singleBlock?.blockArea?.toString() : '')

    if (isNaN(tempTonnage) || isNaN(tempBlockArea)) {
      setValueSecondPage('tonnagePerHectare', '', {shouldValidate: true})
    } else {
      const tonnagePerHectare = tempTonnage / 1000 / tempBlockArea
      if ((tonnagePerHectare || tonnagePerHectare == 0) && isFinite(tonnagePerHectare)) {
        setValueSecondPage('tonnagePerHectare', tonnagePerHectare.toFixed(2).toString(), {
          shouldValidate: true,
        })
        return
      }
      setValueSecondPage('tonnagePerHectare', '', {shouldValidate: true})
    }
  }

  return (
    <View>
      <TextInput
        isNumber
        control={controlSecondPage}
        label="Jumlah Pokok Diperiksa"
        placeholder="Contoh: 100"
        name="totalTreeChecked"
        errorText={errorsSecondPage?.totalTreeChecked?.message}
        isRequired
        onChangeText={v => calculateAverageFruit(v)}
      />

      <TextInput
        isNumber
        control={controlSecondPage}
        label="Jumlah Janjang"
        placeholder="Contoh: 100"
        name="totalFruit"
        errorText={errorsSecondPage?.totalFruit?.message}
        onChangeText={v => calculateAverageFruit(undefined, v)}
        isRequired
      />

      <TextInput
        disabled
        disabledText={averageWatcher}
        control={controlSecondPage}
        label="Rata-rata Janjang (Janjang diperiksa/Pokok diperiksa)"
        placeholder="Contoh: 100"
        name="averageFruit"
        errorText={errorsSecondPage?.averageFruit?.message}
        isRequired
      />

      <TextInput
        disabled
        disabledText={fruitPerBlockWatcher}
        control={controlSecondPage}
        label="Janjang per Blok (Rata-rata Janjang x Jumlah Pokok)"
        placeholder="Contoh: 100"
        name="totalFruitOfBlock"
        errorText={errorsSecondPage?.totalFruitOfBlock?.message}
        isRequired
      />

      <TextInput
        isNumber
        isFloat={true}
        control={controlSecondPage}
        label="BJR (Kg)"
        placeholder="Contoh: 25"
        name="bjr"
        errorText={errorsSecondPage?.bjr?.message}
        isRequired
        onChangeText={v => calculateTonnage(v)}
      />

      {/* TODO: Tonase Per Blok diganti jadi Tonase Blok (?) */}
      <TextInput
        disabled
        disabledText={`${tonnageWatcher} Kilogram`}
        control={controlSecondPage}
        label="Tonase Per Blok"
        placeholder="Contoh: 100"
        name="totalTonnage"
        errorText={errorsSecondPage?.totalTonnage?.message}
        isRequired
      />

      <TextInput
        disabled
        disabledText={tonnagePerHectareWatcher}
        control={controlSecondPage}
        label="Ton / Ha"
        placeholder="Contoh: 10"
        name="tonnagePerHectare"
        errorText={errorsSecondPage?.tonnagePerHectare?.message}
        isRequired
      />
      <View style={styles.prevNextView}>
        <Button style={{marginBottom: 26}} onPress={goToFirstStep}>
          <Text color="white">Sebelumnya</Text>
        </Button>
        <Button style={{marginBottom: 26}} onPress={handleSubmitSecondPage(validateSecondStep)}>
          <Text color="white">Selanjutnya</Text>
        </Button>
      </View>
    </View>
  )
}

export default SecondPage

const styles = StyleSheet.create({
  prevNextView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})
