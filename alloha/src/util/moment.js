import moment from 'moment';
require('moment/locale/ko'); 

export const getWeekByWeekNumber = (startMonth, weekNumber) => {
    // "20231001", 4(주차)
    const startOfWeek = moment(startMonth).add(weekNumber-1, 'w').startOf('week').format('YYYYMMDD');

    // 2023년 9월의 2주차 끝 날짜
    const endOfWeek = moment(startMonth).add(weekNumber-1, 'w').endOf('week').format('YYYYMMDD');

    return {startOfWeek, endOfWeek}
}

export const getCurMM = () => {
    const currentDate = moment();
    return currentDate.format("MM");
}
export const getCurMonth = () => {
    const currentDate = moment();
    const start = currentDate.startOf('month').clone();
    const end = currentDate.endOf('month').clone();
    return ({start : start.format("YYYYMMDD"), end : end.format("YYYYMMDD"), mm:currentDate.format("MM")});
}

export const getPrevMM = () => {
    const currentDate = moment();
    const lastMonth = currentDate.subtract(1, 'month');
    return lastMonth.format("MM");
}
export const getPrevMonth = () => {
    const currentDate = moment();
    const lastMonth = currentDate.subtract(1, 'month');
    const start = lastMonth.startOf('month').clone();
    const end = lastMonth.endOf('month').clone();
    return ({start : start.format("YYYYMMDD"), end : end.format("YYYYMMDD"), mm:lastMonth.format("MM")});
}
export const movePrevMonth = (date) => {
    const dateObject = moment(date.start);
    const prevWeekStart = dateObject.clone().subtract(1, 'month');
    const start = prevWeekStart.startOf('month').clone();
    const end = prevWeekStart.endOf('month').clone();
    return ({start : start.format("YYYYMMDD"), end : end.format("YYYYMMDD"), mm:prevWeekStart.format("MM")});
}
export const moveNextMonth = (date) => {
    const dateObject = moment(date.start);
    const nextWeekStart = dateObject.clone().add(1, 'month');
    const start = nextWeekStart.startOf('month').clone();
    const end = nextWeekStart.endOf('month').clone();
    return ({start : start.format("YYYYMMDD"), end : end.format("YYYYMMDD"), mm:nextWeekStart.format("MM")});
}

export const getNextWeek = () => {
    const currentDate = moment();
    // 현재 주의 시작 날짜 계산
    const currentWeekStart = currentDate.startOf('week');
    // 다음 주의 시작 날짜 계산
    const nextWeekStart = currentWeekStart.clone().add(7, 'days');
    return nextWeekStart.format("YYYY-MM-DD");
}

export const getCurWeek = () => {
    const currentDate = moment();
    // 현재 주의 시작 날짜 계산
    const currentWeekStart = currentDate.startOf('week');
    // 다음 주의 시작 날짜 계산
    return currentWeekStart.format("YYYY-MM-DD");
}

export const getPrevWeek = () => {
    const currentDate = moment();
    const currentWeekStart = currentDate.startOf('week');
    const prevWeekStart = currentWeekStart.clone().subtract(7, 'days');
    return prevWeekStart.format("YYYY-MM-DD");
}


export const movePrevWeek = (week) => {
    const dateObject = moment(week);
    const prevWeekStart = dateObject.clone().subtract(7, 'days');
    return prevWeekStart.format("YYYY-MM-DD");
}

export const moveNextWeek = (week) => {
    const dateObject = moment(week);
    const nextWeekStart = dateObject.clone().add(7, 'days');
    return nextWeekStart.format("YYYY-MM-DD");
}

export const moveDay = (cls, week) => {
    const dateObject = moment(week);
    var result;
    if(cls == "next"){
        result = dateObject.clone().add(1, 'days');
    }else if(cls == "prev"){
        result = dateObject.clone().subtract(1, 'days');
    }
    return result.format("yyyyMMDD");
}

export const getWeekList = (week) => {
    // 이번 주의 일자를 담을 배열 초기화
    const dateObject = moment(week);
    const weekDates = [];

    // 이번 주의 날짜를 배열에 추가
    for (let i = 0; i < 7; i++) {
        const date = dateObject.clone().add(i, 'days');
        
        //thisWeekDates.push(date.format('YYYY년 MM월 DD일'));
        weekDates.push(date);
    }

    return weekDates;
}

export const getWeekNumber = (dateString) => {
    // dateString을 moment 객체로 변환
    const inputDate = moment(dateString);

    // 월과 주차를 추출
    const month = inputDate.format('MM');

    // 해당 월의 첫째 주부터의 주차를 계산
    const startOfMonth = moment(inputDate).startOf('month');
    const weeksSinceStartOfMonth = inputDate.diff(startOfMonth, 'weeks') + 1;
    return {"month":month, "number":weeksSinceStartOfMonth};
}

export const getDayWeekNumber = (dateStr) => {
   // const dateStr = "20231105"; // 분석할 날짜 문자열
    const date = moment(dateStr, 'YYYYMMDD'); // 날짜 문자열을 Moment 객체로 변환
    const dayOfWeekNumber = date.day(); // 요일(숫자) 반환
    return dayOfWeekNumber;
}

export const getCurrentWeek = () => {

    // 이번 주의 시작 날짜 계산
    const startOfWeek = currentDate.startOf('week');

    // 이번 주의 일자를 담을 배열 초기화
    const thisWeekDates = [];

    // 이번 주의 날짜를 배열에 추가
    for (let i = 0; i < 7; i++) {
        const date = startOfWeek.clone().add(i, 'days');

        //thisWeekDates.push(date.format('YYYY년 MM월 DD일'));
        thisWeekDates.push(date);
    }

    return thisWeekDates
}


export const getSTime = (sTime) => {
    var splittedTime = sTime.split(":");
    var hours = parseInt(splittedTime[0], 10);
    var minutes = parseInt(splittedTime[1], 10);
    var currentDate = new Date();
    
    // 시간을 설정
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    return currentDate
}

// eTime 반환 홤수 07:00, 0.5 -> 07:30
export const getETime = (sTime, endHour) => {
    var splittedTime = sTime.split(":");
    var hours = parseInt(splittedTime[0], 10);
    var minutes = parseInt(splittedTime[1], 10);
    var startTime = moment().hour(hours).minutes(minutes);
    var endTime = startTime.clone().add(endHour, 'hours');
    var result = endTime.format("HH:mm");
    return result;
}


export const calTimeDiffHours = (sTime, eTime) => {
    const today = moment();
    const startTime = moment(sTime, 'HH:mm');
    const endTime = moment(eTime, 'HH:mm');
    const timeDifferenceMinutes = endTime.diff(startTime, 'minutes');
    const timeDifferenceHours = timeDifferenceMinutes / 60;
    return timeDifferenceHours;
  };
  

// 시간 조작함수 07:00, 30 -> 07:30, 07:00, -30 -> 06:30
export const manipulateTime = (timeString, minutes) => {
    // 현재 날짜를 가져옵니다.
    const today = moment();
  
    // 입력받은 시간 문자열을 moment 객체로 변환합니다.
    const inputTime = moment(timeString, 'HH:mm');
  
    // 분을 더하거나 뺀 결과를 계산합니다.
    const resultTime = inputTime.add(minutes, 'minutes');
  
    // 오늘의 날짜와 합쳐서 반환합니다.
    return today.set({
      hour: resultTime.hour(),
      minute: resultTime.minute(),
      second: 0,
      millisecond: 0,
    }).format('HH:mm');
  };