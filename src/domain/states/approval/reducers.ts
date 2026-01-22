import {ActionType, getType} from 'typesafe-actions'
import * as actions from '@app/domain/states/approval/actions'
import {IError} from '@app/domain/states/types'

interface IRktItem {
  id: string
  year: number
  organization: {
    id: string
    name: string
  }
  division: {
    id: string
    name: string
  }
  subActivity: {
    id: string
    name: string
  }
  user?: {
    name: string
    nip: string
    role?: {
      name: string
    }
  }
  status: string
  currentApprovalLevel: number
  createdAt: string
}

export interface ApprovalState {
  pendingApprovals: {
    data: IRktItem[]
    loading: boolean
    error: IError | null
  }
  approve: {
    data: any
    loading: boolean
    error: IError | null
  }
  reject: {
    data: any
    loading: boolean
    error: IError | null
  }
  rktDetail: {
    data: any
    loading: boolean
    error: IError | null
  }
}

const initialState: ApprovalState = {
  pendingApprovals: {
    data: [],
    loading: false,
    error: null,
  },
  approve: {
    data: null,
    loading: false,
    error: null,
  },
  reject: {
    data: null,
    loading: false,
    error: null,
  },
  rktDetail: {
    data: null,
    loading: false,
    error: null,
  },
}

type ApprovalAction = ActionType<typeof actions>

export default function approvalReducer(state = initialState, action: ApprovalAction): ApprovalState {
  switch (action.type) {
    case getType(actions.getPendingApprovals.request):
      return {
        ...state,
        pendingApprovals: {
          ...state.pendingApprovals,
          loading: action.payload.loading,
        },
      }
    case getType(actions.getPendingApprovals.success):
      return {
        ...state,
        pendingApprovals: {
          data: action.payload.data,
          loading: false,
          error: null,
        },
      }
    case getType(actions.getPendingApprovals.failure):
      return {
        ...state,
        pendingApprovals: {
          ...state.pendingApprovals,
          loading: false,
          error: action.payload.error,
        },
      }
    case getType(actions.approveRkt.request):
      return {
        ...state,
        approve: {
          ...state.approve,
          loading: action.payload.loading,
        },
      }
    case getType(actions.approveRkt.success):
      return {
        ...state,
        approve: {
          data: action.payload.data,
          loading: false,
          error: null,
        },
      }
    case getType(actions.approveRkt.failure):
      return {
        ...state,
        approve: {
          ...state.approve,
          loading: false,
          error: action.payload.error,
        },
      }
    case getType(actions.rejectRkt.request):
      return {
        ...state,
        reject: {
          ...state.reject,
          loading: action.payload.loading,
        },
      }
    case getType(actions.rejectRkt.success):
      return {
        ...state,
        reject: {
          data: action.payload.data,
          loading: false,
          error: null,
        },
      }
    case getType(actions.rejectRkt.failure):
      return {
        ...state,
        reject: {
          ...state.reject,
          loading: false,
          error: action.payload.error,
        },
      }
    case getType(actions.clearApprovalStatus):
      return {
        ...state,
        approve: {
          data: null,
          loading: false,
          error: null,
        },
        reject: {
          data: null,
          loading: false,
          error: null,
        },
      }
    default:
      return state
  }
}