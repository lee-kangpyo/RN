import React, { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, TouchableOpacity } from "react-native";
import { color } from 'react-native-reanimated';



export const DatePiker = ({date, mode, txt, txtStyle, onChanged}) => {
    const [show, setShow] = useState(false);
    

    const onChange = (event, selectedDate) => {
        setShow(false);
        onChanged(selectedDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
    };

    const showpicker = () => {
        showMode(mode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <View>
            <TouchableOpacity onPress={showpicker}>
                <Text style={txtStyle}>{date.getFullYear()}-{String(date.getMonth() + 1).padStart(2, '0')}-{String(date.getDate()).padStart(2, '0')}</Text>
            </TouchableOpacity>
            {show && (
                    <DateTimePicker
                        locale="ko-kr"
                        display="calendar"
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                    />
            )}
        </View>
    );
}