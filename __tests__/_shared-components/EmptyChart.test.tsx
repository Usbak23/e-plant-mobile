import React from 'react'
import {render} from '@testing-library/react-native'
import {EmptyChart} from '@app/presentations/_shared-components'

describe('EmptyChart', () => {
  it('should render correctly', () => {
    const component = render(<EmptyChart />)
    expect(component).toMatchSnapshot()
  })
})
