import {IEmployeeCost, IUserRow} from '@app/models/eplant/User'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {StyleSheet, View} from 'react-native'

interface IRKHListEmployeeCardProps {
  item?: IEmployeeCost
}

const RKHListEmployeeCard: React.FC<IRKHListEmployeeCardProps> = props => {
  return (
    <View style={styles.card}>
      <View style={styles.horizontalContainer}>
        <View style={{flex: 1}}>
          <Text size={11} type="thin">
            Nama Tenaga Kerja
          </Text>
          <Text size={12}>{props.item?.name || '-'}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={11} type="thin">
            Peran
          </Text>
          <Text size={12}>{props.item?.role?.name || '-'}</Text>
        </View>
      </View>

      <View style={styles.horizontalContainer}>
        <View style={{flex: 1}}>
          <Text size={11} type="thin">
            Jenis Karyawan
          </Text>
          <Text size={12}>{props.item?.typeEmployee?.name || '-'}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text size={11} type="thin">
            Biaya Per Ha
          </Text>
          <Text size={12}>
            {props.item?.costEmployee?.wages ? `Rp.${numberWithDot(props.item.costEmployee.wages)}` : '-'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default RKHListEmployeeCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginVertical: 7.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  horizontalContainer: {
    marginTop: 8,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
})
