import moment from 'moment';
require('moment/locale/ko'); 

// 현재 날짜 객체 생성
const currentDate = moment();

export const getNextWeek = () => {
    // 현재 주의 시작 날짜 계산
    const currentWeekStart = currentDate.startOf('week');
    // 다음 주의 시작 날짜 계산
    const nextWeekStart = currentWeekStart.clone().add(7, 'days');
    return nextWeekStart.format("YYYY-MM-DD");
}

export const getPrevWeek = () => {
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
    console.log({"month":month, "number":weeksSinceStartOfMonth});
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
