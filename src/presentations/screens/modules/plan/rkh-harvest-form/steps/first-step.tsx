import {IRKHRow} from '@app/models/eplant/RKH'
import {IRKHHarvestAllRowData, IRKHHarvestRow} from '@app/models/eplant/RKHHarvest'
import {Button, Text, TextInput} from '@app/presentations/_shared-components'
import React from 'react'
import moment from 'moment'
import {StyleSheet, View} from 'react-native'

interface IRKHHarvestFormFirstStepProps {
  onNext: () => void
  item?: IRKHHarvestAllRowData
}

const RKHHarvestFormFirstStep: React.FC<IRKHHarvestFormFirstStepProps> = props => {
  return (
    <View>
      <TextInput
        disabled
        disabledText={props.item?.block?.division?.organization?.name || '-'}
        control={{}}
        label="Organisasi"
        placeholder="Contoh: PT. Aksara Integrasi Sejahtera"
        name="organization"
        isRequired
      />
      <TextInput
        disabled
        disabledText={props.item?.block?.division?.name || '-'}
        control={{}}
        label="Divisi"
        placeholder="Contoh: Divisi Alpha"
        name="division"
        isRequired
      />
      <TextInput
        disabled
        disabledText={props.item?.block?.code || '-'}
        control={{}}
        label="Blok"
        placeholder="Contoh: Blok C1"
        name="block"
        isRequired
      />
      <TextInput
        disabled
        disabledText={props.item?.block?.blockArea != undefined ? props.item.block.blockArea.toString() : '-'}
        control={{}}
        label="Luas Blok (Ha)"
        placeholder="Contoh: 10"
        name="blockArea"
        isRequired
      />

      <TextInput
        disabled
        disabledText={props.item?.totalHectares != undefined ? props.item.totalHectares.toString() : '-'}
        control={{}}
        label="Total Ha"
        placeholder="Contoh: 10"
        name="totalHectare"
        isRequired
      />

      <TextInput
        disabled
        disabledText={props.item?.akp?.harvestDate ? moment(props.item.akp.harvestDate).format('D MMMM YYYY') : '-'}
        control={{}}
        label="Tanggal Panen"
        placeholder="Contoh: 2021-10-31"
        name="harvestDate"
        isRequired
      />

      <TextInput
        disabled
        disabledText={props.item?.harvestChapel != undefined ? props.item.harvestChapel.toString() : '-'}
        control={{}}
        label="Kapel Panen"
        placeholder="Contoh: 2"
        name="harvestChapel"
        isRequired
      />

      <TextInput
        disabled
        disabledText={props.item?.kilogram != undefined ? props.item.kilogram.toString() : '-'}
        control={{}}
        label="Kilogram [Janjang x BJR]"
        placeholder="Contoh: 12"
        name="kilogram"
        isRequired
      />

      <TextInput
        disabled
        disabledText={props.item?.numberOfEmployees != undefined ? props.item.numberOfEmployees.toString() : '-'}
        control={{}}
        label="Jumlah Karyawan"
        placeholder="Contoh: 100"
        name="numberOfEmployees"
        isRequired
      />

      <TextInput
        disabled
        disabledText={props.item?.ripeFruit != undefined ? props.item.ripeFruit.toString() : '-'}
        control={{}}
        label="Total Janjang"
        placeholder="Contoh: 100"
        name="totalFruit"
        isRequired
      />

      <TextInput
        disabled
        disabledText={
          props.item?.block?.harvestForeman
            ? `${props.item.block.harvestForeman.nip} - ${props.item.block.harvestForeman.name} - ${props.item.block.harvestForeman.role.name}`
            : '-'
        }
        control={{}}
        label="Mandor Panen"
        placeholder="Contoh: 123 - John - Mandor"
        name="harvestForeman"
        isRequired
      />

      <Button style={styles.nextBtn} onPress={props.onNext}>
        <Text color="white">Selanjutnya</Text>
      </Button>
    </View>
  )
}

export default RKHHarvestFormFirstStep

const styles = StyleSheet.create({
  nextBtn: {
    marginBottom: 26,
    width: '50%',
    alignSelf: 'flex-end',
  },
})
