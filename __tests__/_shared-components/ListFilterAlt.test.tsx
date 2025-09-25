import React from 'react'
import {StyleProp, ViewStyle} from 'react-native'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import {ListFilter, ListFilterAlt} from '@app/presentations/_shared-components'

interface IProps {
  style?: StyleProp<ViewStyle>
  searchValue?: string
  onChangeSearch?: (value: string) => void
  onPressDownload?: () => void
  onPressFilter?: () => void
  sortOptions?: () => JSX.Element | undefined | null
}
function renderComponent(props: IProps) {
  const component = render(<ListFilterAlt {...props} />)
  return {
    component,
    ...component,
  }
}

describe('ListFilterAlt component', () => {
  it('Should render correctly', () => {
    const c = renderComponent({})
    expect(c).toMatchSnapshot()
  })
})
