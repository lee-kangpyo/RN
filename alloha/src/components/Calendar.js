import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarList, Calendar, LocaleConfig } from 'react-native-calendars';
import { lightenColor } from '../util/color';

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
  '2024-06-01': [{ text: '8.5시간', subText:"100,000원", color:"#94FFD8"}, { text: '8.5시간', color:"#94FFD8" },{ text: '8.5시간', color:"#94FFD8" },{ text: '8.5시간', color:"#94FFD8" },{ text: '8.5시간', color:"#94FFD8" },{ text: '8.5시간', color:"#94FFD8" },{ text: '8.5시간', color:"#94FFD8" }],
  '2024-06-02': [{ text: '8.5시간', subText:"999,999원", color:"#94FFD8" }],
  '2024-06-03': [{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" }],
  '2024-06-04': [{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원" }],
  '2024-06-05': [{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" }],
  '2024-06-06': [{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" }],
  '2024-06-07': [{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" },{ text: '8.5시간', subText:"100,000원", color:"#94FFD8" }],
  // 추가 이벤트 데이터...
};

const renderCustomDay = (day, state) => {
    const viewCnt = 4;
    const dayEvents = events[day.dateString];
    // const isSunday = new Date(day.dateString).getDay() === 0;
    // const isSaturday = new Date(day.dateString).getDay() === 6;
    const dayOfWeek = new Date(day.dateString).getDay();
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;
    const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
    const isCurrentMonth = state != 'disabled';

  return (
    <View style={styles.dayContainer}>
      <View style={styles.dayBox}>
        <Text style={[
          isSunday && styles.sundayText,
          isSaturday && styles.saturdayText,
          isWeekday && styles.weekdayText,
          !isCurrentMonth && styles.outsideMonthText,
        ]}>
          {day.day}
        </Text>
        {
          (dayEvents && dayEvents.length - viewCnt > 0)?
            <View style={styles.badge}>
              <Text style={[styles.dayText, {color:"white"}]}>+{dayEvents.length - viewCnt}</Text>
            </View>
          :
            null
        }
        
      </View>
      <View style={styles.dayContent}>
        {
            dayEvents && dayEvents.map((event, index) => {
              const color = (event.color)?event.color:"#888888";
              //backgroundColor:"#94FFD8",
              if(index >= viewCnt) return;
              return (
                <View key={index} style={[styles.row, {width:"100%"}]}>
                  <View style={{
                    backgroundColor:color, 
                    width:4,
                    paddingHorizontal:2,
                    paddingVertical:6,
                    marginBottom:4,
                  }} />
                  {
                    (dayEvents.length <= 2)?
                      <View style={[styles.item_2line, {backgroundColor:lightenColor(color, 30)}]}>
                        <Text numberOfLines={1} style={styles.eventText}>
                          {event.text}
                        </Text>
                        <Text numberOfLines={1} style={styles.eventText}>
                          {event.subText}
                        </Text>
                      </View>
                    :
                      <View style={[styles.item_1line, {backgroundColor:lightenColor(color, 30)}]}>
                        <Text numberOfLines={1} style={styles.eventText}>
                            {event.text}
                        </Text>
                      </View>
                  }
                </View>
              )
            })
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
            return renderCustomDay(date, state);
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
      },
      dayBox:{
        padding:2,
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-between",
      },
      dayText: {
        fontSize: 10,
      },
      sundayText: {
        color: 'red',
      },
      saturdayText: {
        color: 'blue',
      },
      outsideMonthText: {
        color: '#ddd',
      },
      dayContent:{
        padding:1,
        height:60,
        width:"100%"
      },
      eventText: {
        fontFamily:"SUIT-ExtraBold",
        fontSize: 8,
        color: '#111',
      },
      item_1line:{
        flex:1,
        paddingHorizontal:2,
        paddingVertical:2,
        marginBottom:4,
        borderRadius:2
      },
      item_2line:{
        flex:1,
        paddingHorizontal:2,
        paddingVertical:6,
        
        marginBottom:4,
        borderRadius:2
      },
      badge:{backgroundColor:"#FF76CE", paddingHorizontal:4, borderRadius:3, justifyContent:"center", },
      row:{flexDirection:"row"}
});


export default MyCalendar;
