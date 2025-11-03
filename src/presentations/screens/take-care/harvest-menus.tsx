import React from 'react'
import Routes from '@navigation/Routes'
import BKM from '@assets/icons/ic_book.svg'
import IconFertilization from '@assets/icons/ic_fertilization.svg'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'

export const harvestMenus: {
  icon: any
  slug: string
  title: string
  screen: string
  bgColor: string
}[] = [
  {
    icon: () => <BKM width={24} height={24} />,
    title: 'BKM Rawat',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_BKM_TAKE_CARE,
    screen: Routes.BKM_TAKE_CARE_FILTER,
    bgColor: 'rgba(246, 134, 62, 0.35)',
  },
  {
    icon: () => <IconFertilization width={24} height={24} />,
    title: 'Realisasi\nPemupukan',
    slug: ROLE_ACCESS_SLUG.SEE_FERTILIZATION_REALIZATION,
    screen: Routes.REALIZATION_FERTILIZATION_FILTER,
    bgColor: 'rgba(30, 115, 200, 0.35);',
  },
]
