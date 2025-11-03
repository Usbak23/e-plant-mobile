import React from 'react'
import Routes from '@navigation/Routes'
import Organization from '@assets/icons/menus/master-data-menus/ic_organization.svg'
import Division from '@assets/icons/menus/master-data-menus/ic_division.svg'
import Block from '@assets/icons/menus/master-data-menus/ic_block.svg'
import TPH from '@assets/icons/menus/master-data-menus/ic_tph.svg'
import Material from '@assets/icons/menus/master-data-menus/ic_material.svg'
import Tools from '@assets/icons/menus/master-data-menus/ic_tools.svg'
import SubActivity from '@assets/icons/menus/master-data-menus/ic_sub_activity.svg'
import Cost from '@assets/icons/menus/master-data-menus/ic_cost.svg'

export const MasterDataMenus: {
  icon: any
  title: string
  slug: string
  screen: string
  bgColor: string
}[] = [
  {
    icon: () => <Organization width={24} height={24} />,
    title: 'Organisasi',
    slug: 'lihat-organisasi',
    screen: Routes.ORGANIZATION_LIST,
    bgColor: 'rgba(246, 134, 62, 0.35)',
  },
  {
    icon: () => <Division width={24} height={24} />,
    title: 'Divisi',
    slug: 'lihat-divisi',
    screen: Routes.DIVISION_LIST,
    bgColor: 'rgba(30, 115, 200, 0.35)',
  },
  {
    icon: () => <Block width={24} height={24} />,
    title: 'Blok',
    slug: 'lihat-blok',
    screen: Routes.BLOCK_LIST,
    bgColor: 'rgba(5, 152, 172, 0.35)',
  },
  {
    icon: () => <TPH width={24} height={24} />,
    title: 'TPH',
    slug: 'lihat-tph',
    screen: Routes.TPH_LIST,
    bgColor: 'rgba(156, 93, 228, 0.35)',
  },
  {
    icon: () => <Material width={24} height={24} />,
    title: 'Material',
    screen: Routes.RAW_MATERIAL_LIST,
    slug: 'lihat-material',
    bgColor: 'rgba(233, 86, 117, 0.35)',
  },
  {
    icon: () => <Tools width={24} height={24} />,
    title: 'Alat dan\nperlengkapan',
    slug: 'lihat-alat-dan-perlengkapan',
    screen: Routes.TOOLS_AND_EQUIPMENT_LIST,
    bgColor: 'rgba(19, 144, 242, 0.35)',
  },
  // {
  //   icon: () => <SubActivity width={24} height={24} />,
  //   title: 'Sub-aktivitas',
  //   screen: '',
  //   bgColor: ' rgba(128, 194, 203, 0.35)',
  // },
  // {
  //   icon: () => <Cost width={24} height={24} />,
  //   title: 'Biaya',
  //   screen: '',
  //   bgColor: 'rgba(240, 177, 13, 0.35)',
  // },
]
