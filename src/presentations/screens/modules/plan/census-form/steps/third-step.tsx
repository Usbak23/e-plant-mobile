import { Button, SelectInput, Text } from '@app/presentations/_shared-components'
import { useWatch } from 'react-hook-form'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import QuarterCard from '../quarter-card'

interface IThirdPageProps {
  isEdit: Boolean
  controlThirdPage: any
  handleQuarterSelectInput: any
  quarters: any
  errorsThirdPage: any
  censusMonthsFields: any
  onPrevious: () => void
  getValuesThirdPage: any
  getValuesSecondPage: any
  setValueThirdPage: any
  onSubmit: () => void
}

const ThirdPage: React.FC<IThirdPageProps> = props => {
  const {
    controlThirdPage,
    handleQuarterSelectInput,
    quarters,
    errorsThirdPage,
    censusMonthsFields,
    onPrevious,
    getValuesThirdPage,
    getValuesSecondPage,
    setValueThirdPage,
    onSubmit,
    isEdit,
  } = props

  return (
    <View>
      <SelectInput
        defaultValue={controlThirdPage._defaultValues.quarter}
        onChange={value => handleQuarterSelectInput(value)}
        isRequired
        items={quarters}
        control={controlThirdPage}
        label="Caturwulan"
        placeholder="Pilih caturwulan"
        name="quarter"
        errorText={errorsThirdPage?.quarter?.message}
      />

      {censusMonthsFields.map((i: any, index: number) => (
        <QuarterCard
          item={i}
          getValuesSecondPage={getValuesSecondPage}
          getValuesThirdPage={getValuesThirdPage}
          setValueThirdPage={setValueThirdPage}
          control={controlThirdPage}
          namePercentage={`censusMonths.[${index}].percentage`}
          nameScatter={`censusMonths.[${index}].scatter`}
          nameJanjangPerMonth={`censusMonths.[${index}].janjangPerMonth`}
          errorText={
            errorsThirdPage?.[`censusMonths[${index}].percentage`]?.message || errorsThirdPage?.censusMonths?.message
          }
          errorTextScatter={errorsThirdPage?.[`censusMonths?.[${index}].scatter`]?.message}
          errorTextJanjangPerMonth={errorsThirdPage?.[`censusMonths?.[${index}].janjangPerMonth`]?.message}
          // errors?.[`employee[${idx}].ancak`]?.message
          key={index}
        // key={i?.id}
        />
      ))}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button style={{ marginBottom: 26 }} onPress={onPrevious}>
          <Text color="white">Sebelumnya</Text>
        </Button>
        <Button style={{ marginBottom: 26 }} onPress={onSubmit}>
          <Text color="white">{isEdit ? 'Ubah Sensus' : 'Tambah Sensus'}</Text>
        </Button>
      </View>
    </View>
  )
}

export default ThirdPage

const styles = StyleSheet.create({})
