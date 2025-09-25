export interface IFieldReportForm {
  files: any[]
  blockId: string
  subject: string
  date: string
  category: string
  subActivityId: string
  description: string
  videos: string[]
}

export interface IFieldReportBlock {
  id: string
  code: string
  blockArea: number
  totalTree: number
  harvestChapel: string
  numberOfLine: number
}

export interface IFieldReportSubActivity {
  id: string
  accountNumber: string
  name: string
  description: string
  category: string
}

export interface IFieldReport {
  id: string
  reportNumber: string
  block: IFieldReportBlock
  subject: string
  date: string
  category: string
  subActivity: IFieldReportSubActivity
  description: string
  user: {
    id: string
    nip: string
    email: string
    name: string
  }
}

export interface IFieldReportAttachmentDetail {
  id: string
  reportNumber: string
  name: string
  type: string
  mime: string
  size: number
  dir: string
  json: {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    size: number
    bucket: string
    key: string
    acl: string
    contentType: string
    location: string
    etag: string
  }
}

export interface IFieldReportDetail {
  id: string
  category: string
  date: string
  subject: string
  description: string
  videos: string | null
  createdAt: string
  updatedAt: string
  block: {
    id: string
    code: string
    blockArea: number
    totalTree: number
    plantingYear: string[]
    harvestChapel: string
    numberOfLine: number
    varieties: string[]
  }
  user: {
    id: string
    nip: string
    name: string
  }
  subActivity: {
    id: string
    accountNumber: string
    name: string
    description: string
    category: string
  }
  officialReportAttachments: IFieldReportAttachmentDetail[]
}
