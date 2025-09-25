import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import NoAccessView from '@app/presentations/_shared-components/NoAccess'

describe('NoAccessView component', () => {
  it('Should render correctly', () => {
    const component = render(<NoAccessView />)
    expect(component).toMatchSnapshot()
  })
})
