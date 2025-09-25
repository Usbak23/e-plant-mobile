import {IMyRequest, IRequestHistory} from '@app/models/eplant/Request'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import moment from 'moment'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'

interface IProps {
  requestHistory?: IRequestHistory
}

const MyRequestHistoryCard = ({requestHistory}: IProps) => {
  return (
    <TouchableOpacity onPress={() => {}} style={styles.card}>
      <Text color={theme.colors.yellowDark} type="semibold">
        {moment(requestHistory?.date).format('DD MMMM YYYY HH:mm')}
      </Text>
      <View style={styles.container}>
        <View style={{flex: 1, marginTop: 8}}>
          <Text color={theme.colors.grey} size={12}>
            Perubahan Status
          </Text>
          <Text>{requestHistory?.status || '-'}</Text>
        </View>
        <View style={{flex: 1, marginTop: 8}}>
          <Text color={theme.colors.grey} size={12}>
            Pengguna
          </Text>
          <Text>{requestHistory?.user?.name || '-'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default MyRequestHistoryCard

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    padding: 16,
    backgroundColor: 'white',
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
  container: {
    flexDirection: 'row',
  },
})
