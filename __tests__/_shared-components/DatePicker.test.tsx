import React from 'react'
import {render, fireEvent} from '@testing-library/react-native'
import {IProps} from '@app/presentations/types'
import {DatePicker} from '@app/presentations/_shared-components'
import {View} from 'react-native'
import {useForm} from 'react-hook-form'

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  Controller: () => <></>,
  useForm: () => ({
    control: () => ({}),
    handleSubmit: () => jest.fn(),
  }),
}))

interface IPDatePicker extends IProps {
  control: any
  label: string
  placeholder: string
  value?: string
  errorText?: string
  isRequired?: boolean
  name: string
  defaultValue?: any
  onChangeText: (value: string) => void
}

function renderComponent(props: IPDatePicker) {
  const component = render(
    <View>
      <DatePicker {...props} />
    </View>,
  )
  return {
    component,
    ...component,
  }
}

describe('DatePicker component', () => {
  it('Should render correctly', () => {
    const {control} = useForm({
      mode: 'onChange',
      defaultValues: {
        date: '',
      },
    })
    const component = renderComponent({
      control: control,
      label: 'Date picker',
      placeholder: 'Placeholder',
      onChangeText: v => {},
      name: 'date',
    })
    expect(component).toMatchSnapshot()
  })
})
