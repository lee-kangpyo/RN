import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { lightenColor, theme } from '../util/color';
import moment from 'moment';
import isEqual from 'lodash/isEqual';

// Locale 설정
LocaleConfig.locales['kr'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'kr';


const MyCalendar = ({data, cstList, initialDate, selectDay, onDayTap, onChangeMonth}) => {
  const onDayComponentTap = useCallback((day, items) => onDayTap(day, items), []);
  
  return (
    <Calendar
        key={initialDate}
        current={initialDate}
        monthFormat={'yyyy년 MM월'}
        onMonthChange={month => onChangeMonth(month)}
        dayComponent={({ date, state }) => {
            const items = data[date.dateString]??[];
            // 색상 추가
            items.forEach((item)=>{
              const cst = cstList.find(el => el.CSTCO == item.CSTCO);
              if(cst) item["color"] = cst.color
            });
            const isSel = (selectDay == date.dateString);
            return (
              <RenderCustomDay day={date} state={state} items={items} onTap={onDayComponentTap} isSelected={isSel} />
            )
        }}
        headerStyle={{fontFamily:"SUIT-Bold"}}
        theme={{
            textMonthFontFamily:"SUIT-Bold",
            arrowColor: '#111',
            'stylesheet.calendar.header': {
              week: {
                color:"black",
                marginTop: 8,
                flexDirection: 'row',
                justifyContent: 'space-around'
              },
              dayHeader:{
                // 월화수목금
                fontFamily:"SUIT-Bold",
                color:"#111",
                fontSize:16
              },
              dayTextAtIndex0: {
                //일
                color: 'red'
              },
              dayTextAtIndex6: {
                //토
                color: 'blue'
              }
            }
          }}
        // 기타 캘린더 설정...
    />
  );
};

//마커
const Markers = ({items}) => {
  return(
    <>
      { 
        (items.length > 0 )?
          items.map((el, idx) => <Marker key={idx} item={el} />)
        :
          <View style={styles.marker} />
      }
    </>
  )
}
const Markers_circle = ({items}) => {
  console.log(items.length);
  const test = [...items, ...items];
  //50 -> 45 ->  35 -> 
  const color = {0:'#C80000', 1:'#34A853', 2:'#3396FE', 3:'#1547FF'}
  return(
    <View style={{position:"absolute", top:21.3, justifyContent:"center", alignItems:"center"}}>
      {/* items.map((el, idx) => <Marker key={idx} item={el} />) */}
      {
        test.map((el, idx) => (
          <View style={{borderWidth:2, borderColor:color[idx], backgroundColor:(idx < 4)?color[idx]:"white", width:(40 - idx * 8), height:(40 - idx * 8), position:"absolute", borderRadius:50}} />
        ))
      }
    </View>
  )
}
const Marker = ({item}) => {
  const schDure = item.SCHDURE;
  const jobDure = item.JOBDURE;  
  const backGourd = (jobDure > 0)?{backgroundColor:item.color}:{};
  const border = {borderWidth:1, borderColor:item.color};
  return ( <View style={[styles.marker, backGourd, border]} /> );
}

const RenderCustomDay = memo(({day, state, items, onTap, isSelected}) => {
  const isToday = moment().isSame(moment(day.dateString), 'day');
  // 디자인 변수들
  const dayOfWeek = new Date(day.dateString).getDay();
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;
  const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
  const isCurrentMonth = state != 'disabled';
  return (
    <TouchableOpacity activeOpacity={1} onPress={()=>onTap(day, items)}  style={[styles.dayContainer]}>
      <View style={styles.dayBox}>
          <View style={[isSelected && styles.isSelected, isToday && styles.today]}>
            <Text style={[
              styles.regular, styles.dayText,
              isSunday && styles.sundayText,
              isSaturday && styles.saturdayText,
              isWeekday && styles.weekdayText,
              !isCurrentMonth && styles.outsideMonthText,
              (isToday) && styles.isToday,
            ]}>
              {day.day}
            </Text>
          </View>
      </View>
      <View style={{height:4}} />
      <View style={{flexDirection:"row"}}>
        <Markers items = {items} />
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return renderConditions(prevProps, nextProps);
})

const renderConditions = (prevProps, nextProps) => {
  return prevProps.isSelected === nextProps.isSelected || 
         prevProps.state === nextProps.state || 
         prevProps.items.length === nextProps.items.length|| 
         prevProps.day.dateString === nextProps.day.dateString;
}


const styles = StyleSheet.create({
    dayContainer: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      width:"100%"
    },
    dayBox:{width:21, height:21, justifyContent:"center", alignItems:"center",},
    dayText: {
      fontSize: 16,
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
    row:{flexDirection:"row"},
    marker:{width:6,height:6, borderRadius:100, borderWidth:0, marginHorizontal:1,},
    today:{backgroundColor:"#111", borderRadius:50, width:23, height:23, justifyContent:"center", alignItems:"center"},
    isToday:{color:"white", fontFamily:"SUIT-Bold"},
    isSelected:{backgroundColor:lightenColor("#111", '85'), borderRadius:50, width:23, height:23, justifyContent:"center", alignItems:"center"},
    regular:{fontFamily:"SUIT-Regular",},
});


export default MyCalendar;
