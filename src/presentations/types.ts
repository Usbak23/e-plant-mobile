export interface IProps {
  style?: Record<any, any>
  children?: any
  ref?: any
  key?: any
  testID?: string
}

export declare enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  NURTURING = 'Nurturing',
  CONVERTED = 'Converted',
  UNQUALIFIED = 'Unqualified',
}

export const ModuleType = {
  ACCOUNT: 'Account',
  CONTACT: 'Contact',
  LEAD: 'Lead',
  OPPORTUNITY: 'Opportunity',
  PRODUCT: 'Product',
  CASE: 'Case',
  QUOTE: 'Quote',
}
