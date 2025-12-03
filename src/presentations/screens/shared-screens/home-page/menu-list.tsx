import React from 'react'
import Routes from '@app/presentations/navigation/Routes'
import MasterData from '@assets/icons/menus/ic_master_data.svg'
import Planning from '@assets/icons/menus/ic_planning.svg'
import Harvesting from '@assets/icons/menus/ic_harvesting.svg'
import Treat from '@assets/icons/menus/ic_treat.svg'
import Report from '@assets/icons/menus/ic_report.svg'
import News from '@assets/icons/menus/ic_news.svg'
import Attendance from '@assets/icons/ic_attendance.svg'
import Request from '@assets/icons/ic_request.svg'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'

export const Menus = [
  {
    icon: <MasterData width={24} height={24} />,
    title: 'Master data',
    slug: 'master-data',
    screen: Routes.MASTER_DATA,
    bgColor: 'rgba(246, 134, 62, 0.35)',
  },
  {
    icon: <Planning width={24} height={24} />,
    title: 'Rencana',
    slug: 'rencana',
    screen: Routes.PLAN,
    bgColor: 'rgba(30, 115, 200, 0.35)',
  },
  {
    icon: <Attendance width={24} height={24} />,
    title: 'Absensi',
    slug: 'lihat-absensi',
    screen: Routes.ATTENDANCE_FILTER,
    bgColor: 'rgba(240, 177, 13, 0.5);',
  },
  {
    icon: <Harvesting width={24} height={24} />,
    title: 'Panen',
    slug: 'panen',
    screen: Routes.HARVEST,
    bgColor: 'rgba(5, 152, 172, 0.35)',
  },
  {
    icon: <Treat width={24} height={24} />,
    title: 'Rawat',
    slug: 'rawat',
    screen: Routes.TAKE_CARE,
    bgColor: 'rgba(156, 93, 228, 0.35)',
  },
  {
    icon: <Report width={24} height={24} />,
    title: 'Laporan',
    slug: 'laporan',
    screen: Routes.REPORT,
    bgColor: 'rgba(233, 86, 117, 0.35)',
  },
  {
    icon: <News width={24} height={24} />,
    title: 'Berita acara',
    slug: ROLE_ACCESS_SLUG.SEE_WAREHOUSE_MANAGEMENT,
    screen: Routes.FIELD_REPORT_FILTER,
    bgColor: 'rgba(19, 144, 242, 0.35)',
  },
  {
    icon: <Request width={24} height={24} />,
    title: 'Gudang',
    slug: 'request',
    screen: Routes.REQUEST,
    bgColor: 'rgba(30, 115, 200, 0.35)',
  },
]
