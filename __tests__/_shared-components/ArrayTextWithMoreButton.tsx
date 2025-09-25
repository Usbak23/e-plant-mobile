import {ArrayTextWithMoreButton} from '@app/presentations/_shared-components'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import React from 'react'

interface IProps {
  arrayOfText: string[]
  breakpoint?: number
  textSize?: number
  textColor?: string
  textType?: 'regular' | 'bold' | 'semibold'
  onMorePress?: Function
}

function renderComponent(props: IProps) {
  const component = render(<ArrayTextWithMoreButton {...props} />)
  return {
    component,
    ...component,
  }
}

describe('ArrayTextWithMoreButton component', () => {
  it('Should render correctly', async () => {
    const onPressFn = jest.fn()
    const {component} = renderComponent({
      arrayOfText: [],
      onMorePress: onPressFn,
    })
    expect(component).toMatchSnapshot()
  })

  it('Should show - when array of string is empty', async () => {
    const onPressFn = jest.fn()
    const {component} = renderComponent({
      arrayOfText: [],
      onMorePress: onPressFn,
    })
    expect(component).toMatchSnapshot()
    await waitFor(() => {
      expect(component.getByText('-')).toBeTruthy()
    })

    fireEvent.press(component.getByTestId('onMoreButton'))
    expect(onPressFn).toBeCalled()
  })

  it('Should show by params passed', async () => {
    const onPressFn = jest.fn()
    const {component} = renderComponent({
      arrayOfText: ['Lorem', 'Ipsum'],
      onMorePress: onPressFn,
    })
    expect(component).toMatchSnapshot()
    await waitFor(() => {
      expect(component.getByText('Lorem, Ipsum')).toBeTruthy()
    })
  })

  it('Should show text only by its breakpoint', async () => {
    const onPressFn = jest.fn()
    const {component} = renderComponent({
      arrayOfText: ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'],
      onMorePress: onPressFn,
      breakpoint: 3,
    })
    expect(component).toMatchSnapshot()
    await waitFor(() => {
      expect(component.getByText('Lorem, Ipsum, Dolor')).toBeTruthy()
    })
  })
})
