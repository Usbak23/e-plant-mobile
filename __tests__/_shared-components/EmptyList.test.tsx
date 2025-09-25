import React from 'react'
import {render} from '@testing-library/react-native'
import EmptyList from '@app/presentations/_shared-components/Empty'

describe('EmptyList', () => {
  it('should render correctly', () => {
    const component = render(<EmptyList />)
    expect(component).toMatchSnapshot()
  })
})
