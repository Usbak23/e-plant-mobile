import React, {useEffect} from 'react'
import {SafeAreaView, StyleSheet, ScrollView, View} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import {Header, Text} from '@app/presentations/_shared-components'
import {useDispatch} from 'react-redux'
import {useCurrentUserInfo} from '@app/domain/states/user/hooks'
import {actions} from '@app/domain/states/store'
import {ICurrentUserApproval} from '@app/models/eplant/User'

const Approver = () => {
  const dispatch = useDispatch()
  const user = useCurrentUserInfo()
  const approvers = user?.approvals || []

  const constructApprovers = () => {
    return approvers.map((a: ICurrentUserApproval) => ({
      label1: 'Nama Penanggung Jawab',
      value1: a.name || '-',
      label2: 'Peran',
      value2: a.role?.name || '-',
    }))
  }

  useEffect(() => {
    dispatch(actions.getCurrentUser.request({loading: true}))
  }, [])
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Penanggung Jawab" />
      <ScrollView style={styles.body}>
        {constructApprovers().map((a, i) => (
          <View key={i}>
            <Text style={{marginBottom: 16}} type="semibold">{`Penanggung Jawab ${i + 1}`}</Text>
            <LabelValue label={a.label1} value={a.value1} />
            <LabelValue label={a.label2} value={a.value2} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const LabelValue = (item: {label: string; value: string}) => (
  <View style={{flex: 1}}>
    <View style={{flex: 1}}>
      <Text size={13} type="semibold" style={{paddingVertical: 2}}>
        {item.label}
      </Text>
    </View>
    <View style={{flex: 1, marginVertical: 4}}>
      <Text>{item.value}</Text>
    </View>

    <View style={{flex: 1, height: 1, marginVertical: 8, backgroundColor: theme.colors.separator}} />
  </View>
)

export default Approver

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.pureWhite,
  },
  body: {
    padding: 16,
  },
})
