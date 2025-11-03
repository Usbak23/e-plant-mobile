export interface ISubActivity {
  id: string
  accountNumber: string
  name: string
  description: string
  category: string
}

export const SUB_ACTIVITY_CATEGORY = [
  {
    label: 'Rawat',
    value: 'Rawat',
  },
  {
    label: 'Panen',
    value: 'Panen',
  },
  {
    label: 'Transportasi',
    value: 'Transportasi',
  },
]
