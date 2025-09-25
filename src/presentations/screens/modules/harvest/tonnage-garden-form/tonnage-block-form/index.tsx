import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {SelectInput, Text, TextInput} from '@app/presentations/_shared-components'

const TonnageBlockForm = ({control, errors, fields, onDelete, index, blocks}: any) => {
  return (
    <View
      style={{
        marginHorizontal: 2,
        marginVertical: 4,
        padding: 8,
        borderRadius: 8,
        backgroundColor: theme.colors.lightGrey,
      }}>
      {fields.length > 1 && (
        <TouchableOpacity
          onPress={() => {
            onDelete && onDelete()
          }}
          style={{position: 'absolute', right: 0, top: 0, padding: 16}}>
          <AntDesign name={'close'} size={18} color={theme.colors.black} />
        </TouchableOpacity>
      )}

      <View style={styles.body}>
        <View style={{flex: 1, margin: 8}}>
          <SelectInput
            isRequired
            items={blocks}
            control={control}
            label="Blok"
            placeholder="Pilih Blok"
            name={`gardenTonnageBlocks.[${index}].blockId`}
            errorText={errors?.[`gardenTonnageBlocks[${index}].blockId`]?.message}
          />
        </View>
        <View style={{flex: 1, margin: 8}}>
          <TextInput
            // disabled={!block.isEditable}
            // disabledText={block.ancak.toString()}
            isNumber
            control={control}
            label="Jumlah Janjang"
            placeholder="Contoh: 1"
            name={`gardenTonnageBlocks.[${index}].totalJanjang`}
            errorText={errors?.[`gardenTonnageBlocks[${index}].totalJanjang`]?.message}
            isRequired
          />
        </View>
      </View>
    </View>
  )
}

export default TonnageBlockForm

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  body: {
    flex: 1,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
})
