import React, {useState} from 'react'
import {View} from 'react-native'
import {IProps} from '@app/presentations/types'

import DateTimePicker, {Event} from '@react-native-community/datetimepicker'
import {TouchableTextInput} from '..'
import {Controller} from 'react-hook-form'
import moment from 'moment'
// import TouchableTextInput from './TouchableTextInput'

export interface IPDatePicker extends IProps {
  control: any
  label: string
  placeholder: string
  value?: string
  errorText?: string
  isRequired?: boolean
  name: string
  defaultValue?: any
  onChangeText: (value: string) => void
  minimumDate?: any
  maximumDate?: any
  timeOnly?: boolean
  hideLabel?: boolean
  labelMaxLine?: number
  //   setDateValue: any
}

const DatePicker: React.FC<IPDatePicker> = props => {
  const todaysDate = new Date()
  const [date, setDate] = useState<Date>(todaysDate)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  return (
    <Controller
      name={props?.name}
      defaultValue={props?.defaultValue}
      control={props?.control}
      render={({field: {onChange, value}}: any) => {
        return (
          <View testID="datepicker-root">
            <TouchableTextInput
              testID="datepicker-label"
              label={props.label}
              labelMaxLine={props.labelMaxLine}
              hideLabel={props.hideLabel}
              placeholder={props.placeholder}
              value={props.value || value}
              errorText={props.errorText}
              isRequired={props.isRequired}
              onChangeText={props.onChangeText}
              onPress={() => setIsDatePickerOpen(true)}
            />
            {isDatePickerOpen && (
              <DateTimePicker
                minimumDate={props.minimumDate}
                maximumDate={props.maximumDate}
                // timeZoneOffsetInMinutes={60}
                testID="datepicker-library"
                value={date || value}
                mode={props.timeOnly ? 'time' : 'date'}
                is24Hour={true}
                display="default"
                onChange={(event: Event, selectedDate: Date | undefined) => {
                  if (event.type == 'set') {
                    if (props.timeOnly) {
                      const currentDate = selectedDate || date
                      let stringDate = ''

                      if (currentDate) {
                        stringDate = moment(currentDate).format('HH:mm')
                      } else {
                        stringDate = moment(todaysDate).format('HH:mm')
                      }

                      setIsDatePickerOpen(false)
                      setDate(currentDate)
                      props.onChangeText(stringDate)
                      onChange(stringDate)
                    } else {
                      const currentDate = selectedDate || date
                      let stringDate = ''
                      if (currentDate) {
                        stringDate = moment(currentDate).format('YYYY-MM-DD')
                      } else {
                        stringDate = moment(todaysDate).format('YYYY-MM-DD')
                      }
                      setIsDatePickerOpen(false)
                      setDate(currentDate)
                      props.onChangeText(stringDate)
                      onChange(stringDate)
                      // props.setDateValue('dueDate', stringDate)
                    }
                  } else {
                    setIsDatePickerOpen(false)
                  }
                }}
              />
            )}
          </View>
        )
      }}
    />
  )
}

export default DatePicker
