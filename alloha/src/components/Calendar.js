import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarList, Calendar, LocaleConfig } from 'react-native-calendars';

// Locale 설정
LocaleConfig.locales['kr'] = {
    monthNames: [
      '1월', '2월', '3월', '4월', '5월', '6월', 
      '7월', '8월', '9월', '10월', '11월', '12월'
    ],
    monthNamesShort: [
      '1월', '2월', '3월', '4월', '5월', '6월', 
      '7월', '8월', '9월', '10월', '11월', '12월'
    ],
    dayNames: [
      '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'
    ],
    dayNamesShort: [
      '일', '월', '화', '수', '목', '금', '토'
    ],
    today: '오늘'
  };
  LocaleConfig.defaultLocale = 'kr';

const events = {
  '2024-06-01': [{ text: 'Meetingat10AM' }, { text: 'Meetingat10AM' },{ text: 'Meetingat10AM' },{ text: 'Meetingat10AM' },{ text: 'Meetingat10AM' },{ text: 'Meetingat10AM' },{ text: 'Meetingat10AM' },{ text: 'Meetingat10AM' }],
  '2024-06-02': [{ text: 'Birthday Party' }],
  '2024-06-03': [{ text: 'Conference' }],
  // 추가 이벤트 데이터...
};

const renderCustomDay = (day) => {
    const dayEvents = events[day.dateString];
    const isSunday = new Date(day.dateString).getDay() === 0;
    const isSaturday = new Date(day.dateString).getDay() === 6;
  return (
    <View style={styles.dayContainer}>
      <Text style={[styles.dayText, isSunday && styles.sundayText, isSaturday && styles.saturdayText]}>{day.day}</Text>
      <View style={styles.dayContent}>
        {
            dayEvents && dayEvents.map((event, index) => (
                    <Text numberOfLines={1} key={index} style={styles.eventText}>
                        {event.text}
                    </Text>
            ))
        }
      </View>
    </View>
  );
};

const MyCalendar = () => {
  return (
    <Calendar
        onDayPress={day => {
            console.log('selected day', day);
        }}
        onDayLongPress={day => {
            console.log('selected day', day);
        }}
        monthFormat={'yyyy년 MM월'}
        onMonthChange={month => {
          console.log('month changed', month);
        }}
        markingType={'custom'}
        dayComponent={({ date, state }) => {
            return renderCustomDay(date);
        }}

        theme={{
            arrowColor: '#111',
            'stylesheet.calendar.header': {
              week: {
                color:"black",
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-around'
              },
              dayHeader:{
                color:"#111"
              },
              dayTextAtIndex0: {
                color: 'red'
              },
              dayTextAtIndex6: {
                color: 'blue'
              }
            }
          }}

        // 기타 캘린더 설정...
    />
  );
};

const styles = StyleSheet.create({
    dayContainer: {
        borderTopWidth:0.5,
        borderTopColor:"#ddd",
        alignItems: 'center',
        justifyContent: 'flex-start',
        width:"100%"
        // height: 60,
        // borderWidth: 1,       // Border width
        // borderColor: 'gray',  // Border color
        // borderRadius: 4,      // Optional: Border radius for rounded corners
      },
      dayText: {
        marginBottom:4,
        fontSize: 10,
        alignSelf:"flex-start"
      },
      sundayText: {
        color: 'red',
      },
      saturdayText: {
        color: 'blue',
      },
      dayContent:{
        padding:1,
        height:60,
        width:"100%"
      },
      eventText: {
        fontSize: 8,
        color: 'blue',
      },
});

export default MyCalendar;
