import React, {useEffect} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import {Header, Loader, Text} from '@app/presentations/_shared-components'
import {Table, Row} from 'react-native-table-component'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import {ICurrentUserDivisionInfo} from '@app/models/eplant/User'

const tHeader = ['Organisasi', 'Divisi']

const WorkingArea = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootStateType) => state.user?.currentUserInfo)

  const workingDivisions = user?.data?.userDivisions || []

  const constructTableData = () => {
    const organizationsUnique: {id: string; name: string}[] = []
    workingDivisions.forEach((w: ICurrentUserDivisionInfo) => {
      const isExists = organizationsUnique.find(o => o.id == w.division?.organization?.id)
      if (!isExists) {
        organizationsUnique.push({id: w.division?.organization?.id, name: w.division?.organization?.name})
      }
    })

    const dataTables: string[][] = []
    organizationsUnique.forEach((o: {id: string; name: string}) => {
      const temps: string[] = []
      workingDivisions.forEach((w: ICurrentUserDivisionInfo) => {
        if (w.division?.organization?.id == o.id) {
          temps.push(w.division?.name)
        }
      })
      const divisionNames = temps.join(',')
      dataTables.push([o.name, divisionNames])
    })
    return dataTables
  }

  useEffect(() => {
    dispatch(actions.getCurrentUser.request({loading: true}))
  }, [])
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Lingkup Kerja" />
      <ScrollView style={styles.scroll} showsHorizontalScrollIndicator={false}>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: theme.colors.grey}}>
            <Row data={tHeader} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
          </Table>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            {constructTableData().map((d, i) => (
              <Row key={i} data={d} textStyle={styles.tableRow} />
            ))}
          </Table>
        </View>
      </ScrollView>
      <Loader loading={Boolean(user?.loading)} />
    </SafeAreaView>
  )
}

export default WorkingArea

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.pureWhite,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 56,
  },
  tableHeader: {
    height: 40,
    backgroundColor: theme.colors.lightGrey,
  },
  tableHeaderText: {
    fontWeight: '700',
    padding: 10,
    alignSelf: 'center',
  },
  tableRow: {
    padding: 3,
    alignSelf: 'center',
  },
})
