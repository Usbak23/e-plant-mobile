import {IEffectAction, IEffectPayload} from '../types'
import {createReducer} from 'typesafe-actions'
import {ActionsType} from '../store'
import * as actions from './actions'
import IPagingDocs from '@app/models/commons/IPagingDocs'
import {IFieldReport, IFieldReportDetail} from '@app/models/eplant/FieldReport'

export interface IRSFieldReport {
  formFieldReportStatus?: IEffectPayload
  fieldReportList?: IEffectPayload<IPagingDocs<IFieldReport>>
  deleteFieldReportStatus?: IEffectPayload
  fieldReportDetail?: IEffectPayload<IFieldReportDetail>
  deleteFileFieldReportStatsu?: IEffectPayload
}

const DEFAULT_STATE = {}

const fieldReportReducer = createReducer<IRSFieldReport, ActionsType>(DEFAULT_STATE)
  .handleAction(
    [
      actions.createFieldReport.request,
      actions.createFieldReport.failure,
      actions.createFieldReport.success,
      actions.editFieldReport.request,
      actions.editFieldReport.failure,
      actions.editFieldReport.success,
      actions.clearFormFieldReport,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        formFieldReportStatus: payload,
      }
    },
  )
  .handleAction([actions.getFieldReportList.success], (state, action) => {
    const payload = (action as IEffectAction).payload

    if (payload?.data?.docs && payload?.data?.page > 1) {
      const prevDocs: IFieldReport[] = state?.fieldReportList?.data?.docs || []
      return {
        ...state,
        fieldReportList: {
          ...payload,
          data: {
            ...payload.data,
            docs: [...prevDocs, ...payload.data.docs],
          },
        },
      }
    }
    return {
      ...state,
      fieldReportList: payload,
    }
  })
  .handleAction([actions.getFieldReportList.request, actions.getFieldReportList.failure], (state, action) => {
    const payload = (action as IEffectAction).payload
    return {
      ...state,
      fieldReportList: {
        ...payload,
        data: state.fieldReportList?.data,
      },
    }
  })
  .handleAction(
    [
      actions.deleteFieldReport.request,
      actions.deleteFieldReport.success,
      actions.deleteFieldReport.failure,
      actions.clearDeleteFieldReportStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteFieldReportStatus: payload,
      }
    },
  )
  .handleAction(
    [actions.detailFieldReport.request, actions.detailFieldReport.success, actions.detailFieldReport.failure],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        fieldReportDetail: payload,
      }
    },
  )
  .handleAction(
    [
      actions.deleteFileFieldReport.request,
      actions.deleteFileFieldReport.success,
      actions.deleteFileFieldReport.failure,
      actions.clearDeleteFileFieldReportStatus,
    ],
    (state, action) => {
      const payload = (action as IEffectAction).payload
      return {
        ...state,
        deleteFileFieldReportStatsu: payload,
      }
    },
  )

export default fieldReportReducer
