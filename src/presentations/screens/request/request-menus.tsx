import React from 'react'
import MyRequest from '@assets/icons/ic_my_request.svg'
import ListOfRequest from '@assets/icons/ic_list.svg'
import Warehouse from '@assets/icons/ic_warehouse.svg'
import Routes from '@app/presentations/navigation/Routes'
import {ROLE_ACCESS_SLUG} from '@app/models/eplant/Role'

export const RequestMenus = [
  {
    icon: () => <MyRequest width={24} height={24} />,
    title: 'Permintaan\nGudang',
    slug: ROLE_ACCESS_SLUG.SEE_MY_REQUEST,
    screen: Routes.MY_REQUEST_FILTER,
    bgColor: 'rgba(30, 115, 200, 0.35)',
  },
  {
    icon: () => <ListOfRequest width={24} height={24} />,
    title: 'Daftar\nPermintaan Gudang',
    slug: ROLE_ACCESS_SLUG.SEE_LIST_OF_REQUEST,
    screen: Routes.LIST_OF_REQUEST_FILTER,
    bgColor: 'rgba(246, 134, 62, 0.35)',
  },
  {
    icon: () => <Warehouse width={24} height={24} />,
    title: 'Manajemen\nGudang',
    slug: ROLE_ACCESS_SLUG.SEE_WAREHOUSE_MANAGEMENT,
    screen: Routes.WAREHOUSE_MANAGEMENT_FILTER,
    bgColor: 'rgba(5, 152, 172, 0.35)',
  },
]
