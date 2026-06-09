import React from 'react'
import Routes from '@navigation/Routes'
import BKM from '@assets/icons/ic_book.svg'
import PMB from '@assets/icons/ic_grain.svg'
import PMA from '@assets/icons/ic_checklist.svg'
import BPBKS from '@assets/icons/ic_checklist.svg'
import Balance from '@assets/icons/ic_balance.svg'

export const harvestMenus: {
  icon: any
  slug: string
  title: string
  screen: string
  bgColor: string
}[] = [
  {
    icon: () => <BKM width={24} height={24} />,
    title: 'Buku Kerja\nMandor',
    slug: 'lihat-bkm',
    screen: Routes.BKM_FILTER,
    bgColor: 'rgba(246, 134, 62, 0.35)',
  },
  // {
  //   icon: () => <PMB width={24} height={24} />,
  //   title: 'PMB',
  //   slug: 'wait_for_module',
  //   screen: '',
  //   bgColor: 'rgba(30, 115, 200, 0.35)',
  // },
  {
    icon: () => <PMA width={24} height={24} />,
    title: 'Potongan\nMutu Ancak',
    slug: 'lihat-pma',
    screen: Routes.PMA_FILTER,
    bgColor: 'rgba(5, 152, 172, 0.35)',
  },
  {
    icon: () => <BPBKS width={24} height={24} />,
    title: 'Pemeriksaan\nMutu Buah',
    slug: 'lihat-bpbks',
    screen: Routes.BPBKS_FILTER,
    bgColor: 'rgba(156, 93, 228, 0.35)',
  },
  {
    icon: () => <Balance width={24} height={24} />,
    title: 'Tonase Kebun',
    slug: 'lihat-tonase-kebun',
    screen: Routes.TONNAGE_GARDEN_LIST,
    bgColor: 'rgba(233, 86, 117, 0.35)',
  },
  {
    icon: () => <Balance width={24} height={24} />,
    title: 'Tonase PKS',
    slug: 'lihat-tonase-pks',
    screen: Routes.TONNAGE_PKS_LIST,
    bgColor: 'rgba(240, 177, 13, 0.5)',
  },
  {
    icon: () => <BPBKS width={24} height={24} />,
    title: 'Monitoring\nTPH',
    slug: 'lihat-monitoring-tph',
    screen: Routes.MONITORING_TPH_FILTER,
    bgColor: 'rgba(46, 125, 50, 0.35)',
  },
  {
    icon: () => <Balance width={24} height={24} />,
    title: 'SPB Local',
    slug: 'lihat-spb-local',
    screen: Routes.SPB_LOCAL_FILTER,
    bgColor: 'rgba(30, 136, 229, 0.35)',
  },
]
