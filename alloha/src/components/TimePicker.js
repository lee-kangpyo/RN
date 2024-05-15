import React, { useState } from 'react'
import { Button } from 'react-native'
import DatePicker from 'react-native-date-picker'


export const InlineTimePicker = ({date, setDate, style = {}}) => {
    //const [date, setDate] = useState(new Date())
  return <DatePicker date={date} mode='time' theme={"light"} dividerColor={"#F7F7F7"} onDateChange={setDate} minuteInterval={30} />
}

export const InlineDatePicker = ({date, setDate, maxDate=null, minDate=null,}) => {
  //const [date, setDate] = useState(new Date())
return <DatePicker minimumDate={minDate} maximumDate={maxDate} locale={"ko"} date={date} mode='date' theme={"light"} dividerColor={"#F7F7F7"} onDateChange={setDate} minuteInterval={30} />
}

export default () => {
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button title="Open" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </>
  )
}