import {filter, concatMap} from 'rxjs/operators'
import {isActionOf} from 'typesafe-actions'
import * as actions from '@app/domain/states/_offline-fetch/actions'
import * as rkhHarvestActions from '@app/domain/states/rkh-harvest/actions'
import * as rkhTakeCareActions from '@app/domain/states/rkh-take-care/actions'
import * as rkhAllActions from '@app/domain/states/rkh/actions'
import * as organizationActions from '@app/domain/states/organization/actions'
import * as divisionActions from '@app/domain/states/division/actions'
import * as userActions from '@app/domain/states/user/actions'
import * as blockActions from '@app/domain/states/block/actions'
import * as subActivityActions from '@app/domain/states/subactivity/actions'
import * as itemActions from '@app/domain/states/item/actions'
import * as materialActions from '@app/domain/states/raw-material/actions'
import * as masterActions from '@app/domain/states/master/actions'
import * as tphActions from '@app/domain/states/tph/actions'

import {StreamType} from '@app/domain/states/types'

const fetchAllDataForOfflineMode: StreamType = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(actions.fetchAllDataForOfflineMode)),
    concatMap(() => {
      // const queue = [
      //   blockActions.getAllForemanX.request({
      //     loading: true,
      //     //@ts-ignore
      //     next: tphActions.getTPHAll.request({
      //       loading: true,
      //       //@ts-ignore
      //       next: masterActions.getRangeYear.request({
      //         loading: true,
      //         //@ts-ignore
      //         next: masterActions.getRangeBreakTime.request({
      //           loading: true,
      //           //@ts-ignore
      //           next: materialActions.getNormaSubactivity.request({
      //             data: {category: 'Rawat'},
      //             loading: true,
      //             //@ts-ignore
      //             next: blockActions.getAllBlock.request({
      //               loading: true,
      //               //@ts-ignore
      //               next: masterActions.getMinimumAkp.request({
      //                 loading: true,
      //               }),
      //             }),
      //           }),
      //         }),
      //       }),
      //     }),
      //   }),
      // ]

      const queue1 = [
        tphActions.getTPHAll.request({
          loading: true,
          //@ts-ignore
          next: masterActions.getRangeYear.request({
            loading: true,
            //@ts-ignore
            next: masterActions.getRangeBreakTime.request({
              loading: true,
            }),
          }),
        }),
      ]

      const queue2 = [
        materialActions.getNormaSubactivity.request({
          data: {category: 'Rawat'},
          loading: true,
          //@ts-ignore
          next: blockActions.getAllBlock.request({
            loading: true,
            //@ts-ignore
            next: masterActions.getMinimumAkp.request({
              loading: true,
            }),
          }),
        }),
      ]

      //master data 1
      const queue3 = [
        userActions.getCurrentUser.request({
          loading: true,
          //@ts-ignore
          next: organizationActions.getOrganizationAll.request({
            loading: true,
            //@ts-ignore
            next: divisionActions.getAllDivision.request({
              loading: true,
              //@ts-ignore
              next: userActions.getAllUser.request({
                loading: true,
                //@ts-ignore
                next: subActivityActions.getSubActivityAll.request({
                  loading: true,
                }),
              }),
            }),
          }),
        }),
      ]

      //Master data 2
      const queue4 = [
        itemActions.getItemAll.request({
          loading: true,
          //@ts-ignore
          next: materialActions.getRawMaterialAll.request({
            loading: true,
            //@ts-ignore
            next: masterActions.getWorkStatus.request({
              loading: true,
              //@ts-ignore
              next: masterActions.getSupervisions.request({
                loading: true,
              }),
            }),
          }),
        }),
      ]

      // rkh
      const queue5 = [
        rkhTakeCareActions.getRKHTakeCareAll.request({
          loading: true,
          //@ts-ignore
          next: rkhHarvestActions.getRKHHarvestAll.request({
            loading: true,
            //@ts-ignore
            next: rkhAllActions.getRKHAll.request({
              loading: true,
            }),
          }),
        }),
      ]

      return queue3.concat(queue4).concat(queue1).concat(queue2).concat(queue5)

      // return [
      //   userActions.getCurrentUser.request({ //done
      //     loading: true,
      //     //@ts-ignore
      //     next: rkhTakeCareActions.getRKHTakeCareAll.request({
      //       loading: true,
      //       //@ts-ignore
      //       next: rkhAllActions.getRKHAll.request({
      //         loading: true,
      //         //@ts-ignore
      //         next: organizationActions.getOrganizationAll.request({ //done
      //           loading: true,
      //           //@ts-ignore
      //           next: divisionActions.getAllDivision.request({ //done
      //             loading: true,
      //             //@ts-ignore
      //             next: userActions.getAllUser.request({ //done
      //               loading: true,
      //               //@ts-ignore
      //               next: subActivityActions.getSubActivityAll.request({ //done
      //                 loading: true,
      //                 //@ts-ignore
      //                 next: itemActions.getItemAll.request({ //done
      //                   loading: true,
      //                   //@ts-ignore
      //                   next: materialActions.getRawMaterialAll.request({ //done
      //                     loading: true,
      //                     //@ts-ignore
      //                     next: rkhHarvestActions.getRKHHarvestAll.request({
      //                       loading: true,
      //                       //@ts-ignore
      //                       next: masterActions.getWorkStatus.request({ //done
      //                         loading: true,
      //                         //@ts-ignore
      //                         next: masterActions.getSupervisions.request({ //done
      //                           loading: true,
      //                           //@ts-ignore
      //                         }),
      //                       }),
      //                     }),
      //                   }),
      //                 }),
      //               }),
      //             }),
      //           }),
      //         }),
      //       }),
      //     }),
      //   }),
      // ].concat(queue1).concat(queue2)
    }),
  )
}

export default [fetchAllDataForOfflineMode]
