import React, {useEffect, useState} from 'react'
import {Dimensions, FlatList, SafeAreaView, StyleSheet, View} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import {Header, Menu} from '@app/presentations/_shared-components'
import {ReportMenus} from './report-menus'
import ProfileRightHeader from '@app/presentations/_shared-components/ProfileRightHeader'
import {
  useIsAllowedToSeeAKP,
  useIsAllowedToSeeReportAKP,
  useIsAllowedToSeeReportBJR,
  useIsAllowedToSeeReportBMP,
  useIsAllowedToSeeReportBPK,
  useIsAllowedToSeeReportCropBook,
  useIsAllowedToSeeReportKapelPusingan,
  useIsAllowedToSeeReportPMA,
  useIsAllowedToSeeReportPMB,
  useIsAllowedToSeeReportRKBHarvest,
  useIsAllowedToSeeReportRKBTakeCare,
  useIsAllowedToSeeReportRRP,
  useIsAllowedToSeeReportTonnageGarden,
  useIsAllowedToSeeReportTonnagePKS,
  useIsAllowedToSeeReportWage,
  useIsAllowedToSeeReportWageDeduction,
  useIsAllowedToSeeReportYield,
  useIsAllowedToSeeTPH,
} from '@app/domain/states/user/hooks'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'
const window = Dimensions.get('window')
const screen = Dimensions.get('screen')

const Report = () => {
  const [dimensions, setDimensions] = useState({window, screen})

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window, screen}) => {
      setDimensions({window, screen})
    })
    return () => subscription?.remove()
  })

  const isAllowedToSeeReportAKP = useIsAllowedToSeeReportAKP()
  const isAllowedToSeeReportPMB = useIsAllowedToSeeReportPMB()
  const isAllowedToSeeReportYield = useIsAllowedToSeeReportYield()
  const isAllowedToSeeReportRKBTakeCare = useIsAllowedToSeeReportRKBTakeCare()
  const isAllowedToSeeReportRKBHarvest = useIsAllowedToSeeReportRKBHarvest()
  const isAllowedToSeeReportBJR = useIsAllowedToSeeReportBJR()
  const isAllowedToSeeReportWage = useIsAllowedToSeeReportWage()
  const isAllowedToSeeReportWageDeduction = useIsAllowedToSeeReportWageDeduction()
  const isAllowedToSeeReportRRP = useIsAllowedToSeeReportRRP()
  const isAllowedToSeeReportCropBook = useIsAllowedToSeeReportCropBook()
  const isAllowedToSeeReportPMA = useIsAllowedToSeeReportPMA()
  const isAllowedToSeeReportTonnageGarden = useIsAllowedToSeeReportTonnageGarden()
  const isAllowedToSeeReportTonnagePKS = useIsAllowedToSeeReportTonnagePKS()
  const isAllowedToSeeReportBPK = useIsAllowedToSeeReportBPK()
  const isAllowedToSeeReportBMP = useIsAllowedToSeeReportBMP()
  const isAllowedToSeeReportKapelDanPusingan = useIsAllowedToSeeReportKapelPusingan()

  const constructMenus = ReportMenus.filter(menu => {
    if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_AKP) {
      return isAllowedToSeeReportAKP
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_PMB) {
      return isAllowedToSeeReportPMB
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_YIELD) {
      return isAllowedToSeeReportYield
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_RKB_TAKE_CARE) {
      return isAllowedToSeeReportRKBTakeCare
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_RKB_HARVEST) {
      return isAllowedToSeeReportRKBHarvest
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_BJR) {
      return isAllowedToSeeReportBJR
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_WAGE_EMPLOYEE) {
      return isAllowedToSeeReportWage
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_WAGE_DEDUCTION) {
      return isAllowedToSeeReportWageDeduction
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_RRP) {
      return isAllowedToSeeReportRRP
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_CROPBOOK) {
      return isAllowedToSeeReportCropBook
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_PMA) {
      return isAllowedToSeeReportPMA
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_TONNAGE_GARDEN) {
      return isAllowedToSeeReportTonnageGarden
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_TONNAGE_PKS) {
      return isAllowedToSeeReportTonnagePKS
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_BPK) {
      return isAllowedToSeeReportBPK
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_BMP) {
      return isAllowedToSeeReportBMP
    } else if (menu.slug == ROLE_ACCESS_SLUG.SEE_REPORT_CHAPEL) {
      return isAllowedToSeeReportKapelDanPusingan
    }
    return true
  })

  const renderItem = ({item, index}: any) => <Menu key={index.toString()} menuItem={item} />

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Laporan" headerRight={() => <ProfileRightHeader />} />
      <View style={styles.body}>
        {dimensions.window.height > dimensions.window.width ? (
          <FlatList
            key={'v'}
            numColumns={2}
            data={constructMenus}
            contentContainerStyle={{paddingBottom: 100}}
            keyExtractor={item => item.title}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            key={'h'}
            numColumns={4}
            data={constructMenus}
            contentContainerStyle={{paddingBottom: 100}}
            keyExtractor={item => item.title}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default Report

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  body: {
    paddingHorizontal: 16,
  },
})
