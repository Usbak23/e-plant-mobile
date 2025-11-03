import {theme} from '@app/presentations/utils/styles'
import {Header, Text} from '@app/presentations/_shared-components'
import {useRoute} from '@react-navigation/native'
import React from 'react'
import {SafeAreaView, ScrollView} from 'react-native'

const InformationLongText = () => {
  const routes: any = useRoute()
  const reason = routes?.params?.description
  const title = routes?.params?.title || 'Informasi'
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Header title={title} />
      <ScrollView contentContainerStyle={{paddingBottom: 86}} style={{padding: 16}}>
        <Text>{reason || ''}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default InformationLongText
