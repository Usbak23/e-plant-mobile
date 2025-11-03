import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SelectInput, Text, TextInput } from '@app/presentations/_shared-components'
import { theme } from '@app/presentations/utils/styles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IOption from '@app/models/commons/IOption'
import styles from '@app/presentations/screens/modules/harvest/pma-form/styles'
import { useWatch } from 'react-hook-form'
import { usePlantingYearsByBlockId } from '@app/domain/states/block/hooks'

const BlockFormView = ({ idx, control, errors, block, blocks, isPortrait, isEdit, fields, remove, getValues, setValue, }: any) => {
  const isShouldDelete = () => {
    if (isEdit) {
      return false
    }
    if (!block.isEditable) {
      return false
    }

    const editableBlocksIsOne = fields.filter((b: any) => b.isEditable == true).length <= 1
    return Boolean(!editableBlocksIsOne)
  }

  const blockIdWatcher = useWatch({
    control: control,
    name: `employee.[${idx}].blockId`,
    default: getValues(`employee.[${idx}].blockId`) || ''
  })


  const remainingFruitTreeWatcher = useWatch({
    control: control,
    name: `employee.[${idx}].remainingFruitTree`,
    defaultValue: getValues(`employee.[${idx}].remainingFruitTree`) ? getValues(`employee.[${idx}].remainingFruitTree`).toString() : '0'
  })

  const brondolanEachTreeWatcher = useWatch({
    control: control,
    name: `employee.[${idx}].brondolanEachTree`,
    default: getValues(`employee.[${idx}].brondolanEachTree`) ? getValues(`employee.[${idx}].brondolanEachTree`).toString() : '0'
  })

  //menghitung buah tinggal per pokok
  const calculateBuahTinggalPerPokok = (tidakDipanen?: string, mthr?: string, checkedTree?: string) => {
    const tdkDipanen = parseFloat(tidakDipanen || getValues(`employee.[${idx}].notHarvestFruit`))
    const matahari = parseFloat(mthr || getValues(`employee.[${idx}].sunFruit`))
    const pokokDiperiksa = parseFloat(checkedTree || getValues(`employee.[${idx}].checkedTree`))
    const result = (tdkDipanen + matahari) / pokokDiperiksa
    const res = !result || isNaN(result) || !isFinite(result) ? '0' : result.toFixed(2).toString()
    setValue(`employee.[${idx}].remainingFruitTree`, res)
  }

  //menghitung brondolan tinggal per pokok
  const calculateBrondolanTinggalPerPokok = (diPiringanDanPasarPikul?: string, diTPH?: string, checkedTree?: string) => {
    const diPiringanPikul = parseFloat(diPiringanDanPasarPikul || getValues(`employee.[${idx}].looseOnPlateAndPikul`))
    const mDiTPH = parseFloat(diTPH || getValues(`employee.[${idx}].looseOnTph`))
    const pokokDiperiksa = parseFloat(checkedTree || getValues(`employee.[${idx}].checkedTree`))
    const result = (diPiringanPikul + mDiTPH) / pokokDiperiksa
    const res = !result || isNaN(result) || !isFinite(result) ? '0' : result.toFixed(2).toString()
    setValue(`employee.[${idx}].brondolanEachTree`, res)
  }



  const transformPlantingYears = (): IOption[] => {
    const plantingYears = (blocks || [])?.find((b: any) => b.value == blockIdWatcher)?.plantingYear || []
    return plantingYears
  }

  return (
    <View
      style={{
        marginHorizontal: 2,
        marginVertical: 4,
        padding: 8,
        borderRadius: 8,
        backgroundColor: theme.colors.lightGrey,
      }}>

      {isShouldDelete() && (
        <TouchableOpacity onPress={() => remove(idx)} style={{ position: 'absolute', right: 0, top: 0, padding: 16 }}>
          <AntDesign name={'delete'} size={18} color={theme.colors.black} />
        </TouchableOpacity>
      )}

      <Text size={13} style={{ position: 'absolute', left: 0, top: 0, padding: 16 }} type='semibold'>Informasi Blok</Text>


      <View style={[styles.body, { marginTop: 18 }]}>
        <View style={{ flex: 1, margin: 8 }}>
          <SelectInput
            disabled={!block.isEditable}
            disabledText={blocks.find((b: IOption) => b?.value == block?.blockId)?.label || '-'}
            isRequired
            items={blocks}
            control={control}
            label="Blok"
            placeholder="Pilih Blok"
            name={`employee.[${idx}].blockId`}
            errorText={errors?.[`employee[${idx}].blockId`]?.message}
            onChange={v => {
              setValue(`employee.[${idx}].plantingYear`, '')
            }}
          />
        </View>
        <View style={{ flex: 1, margin: 8 }}>
          <SelectInput
            disabled={block.isEditable == false ? true : false}
            disabledText={block.plantingYear.toString()}
            isRequired
            items={transformPlantingYears()}
            control={control}
            label="Tahun Tanam"
            placeholder="Pilih Tahun Tanam"
            name={`employee.[${idx}].plantingYear`}
            errorText={errors?.[`employee[${idx}].plantingYear`]?.message}
          />
        </View>
      </View>

      <View style={[styles.body]}>
        <View style={{ flex: 1, margin: 8 }}>
          <TextInput
            disabled={!block.isEditable}
            disabledText={block.ancak.toString()}
            isNumber
            control={control}
            label="Ancak"
            placeholder="Contoh: 1"
            name={`employee.[${idx}].ancak`}
            errorText={errors?.[`employee[${idx}].ancak`]?.message}
            isRequired
          />
        </View>
      </View>

      <View style={[styles.body]}>
        <View style={{ flex: 1, marginHorizontal: 8 }}>
          <TextInput
            disabled={!block.isEditable}
            disabledText={block?.checkedTree?.toString() || '-'}
            isNumber
            control={control}
            label="Pokok Diperiksa"
            placeholder="Masukkan Jumlah Pokok Diperiksa"
            name={`employee.[${idx}].checkedTree`}
            errorText={errors?.[`employee[${idx}].checkedTree`]?.message}
            isRequired
            onChangeText={v => {
              calculateBuahTinggalPerPokok(undefined, undefined, v)
              calculateBrondolanTinggalPerPokok(undefined, undefined, v)
            }}
          />
        </View>
      </View>

      <Text style={{ marginTop: 16, marginStart: 8 }} type="semibold">Buah/Janjang</Text>

      <View style={styles.body}>
        <View style={{ flex: 1, margin: 8 }}>
          <TextInput
            disabled={!block.isEditable}
            disabledText={block.notHarvestFruit.toString()}
            control={control}
            isNumber
            label="Tidak Dipanen"
            placeholder="Contoh: 1"
            name={`employee.[${idx}].notHarvestFruit`}
            errorText={errors?.[`employee[${idx}].notHarvestFruit`]?.message}
            onChangeText={v => {
              calculateBuahTinggalPerPokok(v)
            }}
          // isRequired
          />
        </View>
        <View style={{ flex: 1, margin: 8 }}>
          <TextInput
            disabled={!block.isEditable}
            disabledText={block.sunFruit.toString()}
            isNumber
            control={control}
            label="Matahari"
            placeholder="Contoh: 1"
            name={`employee.[${idx}].sunFruit`}
            errorText={errors?.[`employee[${idx}].sunFruit`]?.message}
            onChangeText={v => {
              calculateBuahTinggalPerPokok(undefined, v)
            }}
          // isRequired
          />
        </View>
      </View>

      <Text size={12} style={{ marginTop: 16, marginStart: 8 }} type="semibold">Brondolan Tidak Dikutip (Butir)</Text>

      <View style={styles.body}>
        <View style={{ flex: 1, margin: 8 }}>
          <TextInput
            disabled={!block.isEditable}
            disabledText={block.looseOnPlateAndPikul.toString()}
            isNumber
            maxLines={2}
            control={control}
            label="Di piringan &amp; Pasar Pikul"
            placeholder="Contoh: 1"
            name={`employee.[${idx}].looseOnPlateAndPikul`}
            errorText={errors?.[`employee[${idx}].looseOnPlateAndPikul`]?.message}
            onChangeText={v => {
              calculateBrondolanTinggalPerPokok(v)
            }}
          // isRequired
          />
        </View>
        <View style={{ flex: 1, margin: 8 }}>
          <TextInput
            disabled={!block.isEditable}
            disabledText={block.looseOnTph.toString()}
            isNumber
            control={control}
            label={isPortrait ? 'Di TPH\n' : 'Di TPH'}
            placeholder="Contoh: 1"
            name={`employee.[${idx}].looseOnTph`}
            errorText={errors?.[`employee[${idx}].looseOnTph`]?.message}
            onChangeText={v => calculateBrondolanTinggalPerPokok(undefined, v)}
          // isRequired
          />
        </View>
      </View>

      <Text style={{ marginTop: 16, marginStart: 8 }} type="semibold">Pelepah (Pokok)</Text>

      <View style={styles.body}>
        <View style={{ flex: 1, margin: 8 }}>
          <TextInput
            disabled={!block.isEditable}
            disabledText={block.brokenMidrib.toString()}
            maxLines={1}
            isNumber
            control={control}
            label="Sengkleh"
            placeholder="Contoh: 1"
            name={`employee.[${idx}].brokenMidrib`}
            errorText={errors?.[`employee[${idx}].brokenMidrib`]?.message}
          // isRequired
          />
        </View>
        <View style={{ flex: 1, margin: 8 }}>
          <TextInput
            isNumber
            disabled={!block.isEditable}
            disabledText={block.onPlateMidrib.toString()}
            control={control}
            label="Di Piringan"
            placeholder="Contoh: 1"
            name={`employee.[${idx}].onPlateMidrib`}
            errorText={errors?.[`employee[${idx}].onPlateMidrib`]?.message}
          // isRequired
          />
        </View>
      </View>

      <Text style={{ marginTop: 16, marginStart: 8 }} type="semibold">Persentase</Text>

      <View style={styles.body}>
        <View style={{ flex: 1, margin: 8 }}>
          <TextInput
            disabled
            disabledText={remainingFruitTreeWatcher || '-'}
            maxLines={2}
            isNumber
            control={control}
            label={`Buah Tinggal\nPer Pokok`}
            placeholder="Contoh: 1"
            name={`employee.[${idx}].remainingFruitTree`}
            errorText={errors?.[`employee[${idx}].remainingFruitTree`]?.message}
          // isRequired
          />
        </View>
        <View style={{ flex: 1, margin: 8 }}>
          <TextInput
            isNumber
            disabled
            disabledText={brondolanEachTreeWatcher}
            control={control}
            label={`Brondolan\nPer Pokok`}
            placeholder="Contoh: 1"
            name={`employee.[${idx}].brondolanEachTree`}
            errorText={errors?.[`employee[${idx}].brondolanEachTree`]?.message}
          // isRequired
          />
        </View>
      </View>
    </View>
  )
}

export default BlockFormView
