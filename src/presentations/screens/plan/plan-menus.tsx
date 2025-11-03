import React from 'react'
import Routes from '@navigation/Routes'
import Taxation from '@assets/icons/ic_small_taxation.svg'
import IconAKP from '@assets/icons/ic_small_akp.svg'
import IconCensus from '@assets/icons/ic_small_census.svg'
import IconRKH from '@assets/icons/ic_small_rkh.svg'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'

export const PlanMenus: {
  icon: any
  slug: string
  title: string
  screen: string
  bgColor: string
}[] = [
  {
    icon: () => <IconAKP width={24} height={24} />,
    title: 'Angka\nKerapatan Panen',
    slug: 'lihat-akp',
    screen: Routes.AKP_FILTER,
    bgColor: 'rgba(246, 134, 62, 0.35)',
  },
  {
    icon: () => <Taxation width={24} height={24} />,
    title: 'Taksasi',
    slug: 'lihat-taksasi',
    screen: Routes.TAXATION_FILTER,
    bgColor: 'rgba(30, 115, 200, 0.35)',
  },
  {
    icon: () => <IconCensus width={24} height={24} />,
    title: 'Sensus',
    slug: 'lihat-sensus',
    screen: Routes.CENSUS_FILTER,
    bgColor: 'rgba(5, 152, 172, 0.35)',
  },
  {
    icon: () => <IconRKH width={24} height={24} />,
    title: 'Rencana Kerja\nHarian',
    // slug: ROLE_ACCESS_SLUG.LIHAT_RKH,
    slug: 'lihat-rkh',
    screen: Routes.RKH_FILTER,
    bgColor: 'rgba(19, 144, 242, 0.35)',
  },
]
