import React, {useCallback, useEffect} from 'react'
import {View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert, Animated} from 'react-native'
import Text from '@components/Text'
import Button from '@components/Button'
import {useNavigation} from '@react-navigation/core'
import {useDispatch, useSelector} from 'react-redux'
import flux, {RootStateType} from '@domain/states/store'
import {useLeadLists} from '@app/domain/states/leads/hooks'
import {theme} from '@app/presentations/utils/styles'

export default function Home() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const lists = useLeadLists()

  const isConnected = useSelector((state: RootStateType) => state.network.isConnected)

  const getData = useCallback(data => {
    dispatch(
      flux.actions.getLeadLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  useEffect(() => {
    // getData({page: 1, limit: 1000})
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
        {isConnected ? (
          <Text type="bold" color="green">
            CONECTED
          </Text>
        ) : (
          <Text type="bold" color="red">
            DISCONECT
          </Text>
        )}
      </View>
      <FlatList
        data={lists}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({item}: any) => (
          <Animated.View style={{opacity: item.isTemp ? 0.4 : 1}}>
            <TouchableOpacity
              key={item._id}
              style={[styles.card]}
              // @ts-ignore
              onPress={() => navigation.navigate('SampleForm', {item})}>
              <Text>{item.name}</Text>
              {item.isTemp && <Text color="red">DRAFT</Text>}
            </TouchableOpacity>
          </Animated.View>
        )}
      />
      <Button
        style={{marginHorizontal: 18}}
        // @ts-ignore
        onPress={() => navigation.navigate('SampleForm')}>
        <Text color="white">NEW DATA</Text>
      </Button>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 6,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: theme.colors.defaultBorderColor,
  },
})
