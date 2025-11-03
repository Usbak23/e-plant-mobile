import { theme } from '@app/presentations/utils/styles'
import { Button, SelectInput, Text, TextInput } from '@app/presentations/_shared-components'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

interface IFirstPageProps {
  isEdit: boolean
  controlFirstPage: any
  setSelectedBlock: any
  blocks: any
  singleBlock: any
  errorsFirstPage: any
  handleSubmitFirstPage: any
  validateFirstStep: any
  parentData: {
    ORGANIZATION: {
      label: string
      value: string
    }
    DIVISION: {
      label: string
      value: string
    }
    YEAR: string
  },
  //new
  quarters: any
  handleQuarterSelectInput: any
  handleDataChange: any
  getValuesFirstPage: any
  resetSecondPage: any

}

const FirstPage: React.FC<IFirstPageProps> = props => {
  const {
    controlFirstPage,
    setSelectedBlock,
    errorsFirstPage,
    blocks,
    singleBlock,
    handleSubmitFirstPage,
    validateFirstStep,
    parentData,
    quarters,
    handleDataChange,
    getValuesFirstPage,
    resetSecondPage
  } = props

  return (
    <View>
      <TextInput
        disabled={true}
        disabledText={parentData?.ORGANIZATION?.label || '-'}
        isRequired
        control={controlFirstPage}
        label="Organisasi"
        placeholder="Pilih Organisasi"
        name="organization"
        errorText={errorsFirstPage?.organization?.message}
      />

      <TextInput
        disabled={true}
        disabledText={parentData?.DIVISION?.label || '-'}
        isRequired
        control={controlFirstPage}
        label="Divisi"
        placeholder="Pilih Divsi"
        name="divisionId"
        errorText={errorsFirstPage?.divisionId?.message}
      />

      <SelectInput
        disabled={Boolean(props.isEdit)}
        disabledText={props.singleBlock?.code || '-'}
        defaultValue={controlFirstPage._defaultValues.blockId}
        onChange={value => {
          resetSecondPage({
            totalTreeChecked: '',
            totalFruit: '',
            averageFruit: '',
            totalFruitOfBlock: '',
            bjr: '',
            totalTonnage: '',
            tonnagePerHectare: '',
            censusMonths: [],
          })
          props?.handleQuarterSelectInput(getValuesFirstPage('quarter'))
          setSelectedBlock(value)
        }}
        isRequired
        items={blocks}
        control={controlFirstPage}
        label="Blok"
        placeholder="Pilih Blok"
        name="blockId"
        errorText={errorsFirstPage?.blockId?.message}
      />

      <TextInput
        disabled={true}
        disabledText={parentData?.YEAR || '-'}
        isNumber
        control={controlFirstPage}
        label="Tahun"
        placeholder="Contoh: 2021"
        name="yearOfCensus"
        errorText={errorsFirstPage?.yearOfCensus?.message}
        isRequired
      />

      <SelectInput
        onChange={value => {
          props?.handleQuarterSelectInput(value)
        }
        }
        isRequired
        items={quarters}
        control={controlFirstPage}
        label="Caturwulan"
        placeholder="Pilih caturwulan"
        name="quarter"
        errorText={errorsFirstPage?.quarter?.message}
      />

      {singleBlock && singleBlock.plantingYear && (
        <>
          <Text style={{ marginTop: 16 }} type="semibold" size={12}>
            Tahun Tanam
            <Text color="red" size={11}>
              *
            </Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
            {singleBlock?.plantingYear?.map((y: string, index: number) => (
              // <View style={styles.chipView}>
              <Text maxLines={1} style={{ fontStyle: 'italic' }} color={theme.colors.grey} key={index}>
                {y}
                {singleBlock?.plantingYear &&
                  Array.isArray(singleBlock?.plantingYear) &&
                  singleBlock?.plantingYear.length == index + 1
                  ? ''
                  : ','}
              </Text>
              // </View>
            ))}
          </ScrollView>
        </>
      )}



      <TextInput
        disabled
        disabledText={singleBlock?.blockArea?.toString() || '-'}
        control={controlFirstPage}
        label="Luas Blok (Ha)"
        name=""
        isRequired
      />

      <TextInput
        disabled
        disabledText={singleBlock?.totalTree?.toString() || '-'}
        control={controlFirstPage}
        label="Jumlah Pokok"
        placeholder="Contoh: 100"
        name="totalTree"
        errorText={errorsFirstPage?.totalTree?.message}
        isRequired
      />


      <Button style={styles.nextBtn} onPress={handleSubmitFirstPage(validateFirstStep)}>
        <Text color="white">Selanjutnya</Text>
      </Button>
    </View>
  )
}

export default FirstPage

const styles = StyleSheet.create({
  chipView: {
    marginHorizontal: 4,
    marginVertical: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 10,
  },
  nextBtn: {
    marginBottom: 26,
    width: '50%',
    alignSelf: 'flex-end',
  },
})
