import React from 'react'
import Routes from '@app/presentations/navigation/Routes'
import IconAKP from '@assets/icons/ic_small_akp.svg'
import IconChecklist from '@assets/icons/ic_checklist.svg'
import IconFluentCalendar from '@assets/icons/ic_fluent_calendar.svg'
import IconBalance from '@assets/icons/ic_balance.svg'
import IconGrain from '@assets/icons/ic_grain.svg'
import IconScissor from '@assets/icons/ic_small_scissor.svg'
import IconWage from '@assets/icons/ic_small_wage.svg'
import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconDoubleBookmark from '@assets/icons/ic_double_bookmark.svg'
import IconFertilization from '@assets/icons/ic_fertilization.svg'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'
import IconChapel from '@assets/icons/ic_chapel.svg'

export const ReportMenus: {
  icon: any
  slug: string
  title: string
  screen: string
  bgColor: string
}[] = [
  {
    icon: () => <IconAKP width={24} height={24} />,
    title: 'Angka\nKerapatan Panen',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_AKP,
    screen: Routes.REPORT_AKP_REPORT,
    bgColor: 'rgba(246, 134, 62, 0.35)',
  },
  {
    icon: () => <IconChecklist width={24} height={24} />,
    title: 'R-PMB',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_PMB,
    screen: Routes.REPORT_BPBKS,
    bgColor: 'rgba(156, 93, 228, 0.35)',
  },
  {
    icon: () => <IconBalance width={24} height={24} />,
    title: 'Yield',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_YIELD,
    screen: Routes.REPORT_YIELD_REPORT,
    bgColor: 'rgba(242,195,207, 0.9)',
  },
  {
    icon: () => <IconFluentCalendar width={24} height={24} />,
    title: 'RKB Rawat',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_RKB_TAKE_CARE,
    screen: Routes.REPORT_RKB_TAKE_CARE,
    bgColor: 'rgba(240, 177, 13, 0.5)',
  },
  {
    icon: () => <IconFluentCalendar width={24} height={24} />,
    title: 'RKB Panen',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_RKB_HARVEST,
    screen: Routes.REPORT_RKB_HARVEST,
    bgColor: 'rgba(240, 177, 13, 0.5)',
  },
  {
    icon: () => <IconGrain width={24} height={24} />,
    title: 'BJR Per Blok',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_BJR,
    screen: Routes.REPORT_BJB_PER_BLOK,
    bgColor: 'rgba(19, 144, 242, 0.35);',
  },
  {
    icon: () => <IconWage width={24} height={24} />,
    title: 'Upah\nKaryawan',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_WAGE_EMPLOYEE,
    screen: Routes.REPORT_EMPLOYEE_WAGE,
    bgColor: 'rgba(246, 134, 62, 0.35);',
  },
  {
    icon: () => <IconScissor width={24} height={24} />,
    title: 'Potongan\nKaryawan',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_WAGE_DEDUCTION,
    screen: Routes.REPORT_EMPLOYEE_WAGE_CUT,
    bgColor: 'rgba(156, 93, 228, 0.35)',
  },
  {
    icon: () => <IconCalendar width={24} height={24} />,
    title: 'RRP',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_RRP,
    screen: Routes.REPORT_RRP,
    bgColor: 'rgba(86, 187, 97, 0.6)',
  },
  {
    icon: () => <IconDoubleBookmark width={24} height={24} />,
    title: 'Croopbook',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_CROPBOOK,
    screen: Routes.REPORT_CROPBOOK,
    bgColor: 'rgba(19, 144, 242, 0.35);',
  },
  {
    icon: () => <IconChecklist width={24} height={24} />,
    title: 'R-PMA',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_PMA,
    screen: Routes.REPORT_PMA,
    bgColor: 'rgba(240, 177, 13, 0.6);',
  },
  {
    icon: () => <IconBalance width={24} height={24} />,
    title: 'Tonase Kebun',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_TONNAGE_GARDEN,
    screen: Routes.REPORT_TONNAGE_GARDEN,
    bgColor: 'rgba(0, 176, 152, 0.6);',
  },
  {
    icon: () => <IconBalance width={24} height={24} />,
    title: 'Tonase PKS',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_TONNAGE_PKS,
    screen: Routes.REPORT_TONNAGE_PKS,
    bgColor: 'rgba(246, 134, 62, 0.35);',
  },
  {
    icon: () => <IconBalance width={24} height={24} />,
    title: 'Buku Prestasi\nKaryawan',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_BPK,
    screen: Routes.REPORT_BPK,
    bgColor: 'rgba(246, 14, 62, 0.35);',
  },
  {
    icon: () => <IconFertilization width={24} height={24} />,
    title: 'Monitoring\nPemupukan',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_BMP,
    screen: Routes.REPORT_BMP,
    bgColor: 'rgba(86, 187, 97, 0.6);',
  },
  {
    icon: () => <IconChapel width={24} height={24} />,
    title: 'Kapel\ndan Pusingan',
    slug: ROLE_ACCESS_SLUG.SEE_REPORT_CHAPEL,
    screen: Routes.REPORT_CHAPEL,
    bgColor: '#9AD6A0',
  },
]
