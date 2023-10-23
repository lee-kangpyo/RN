import moment from 'moment';
require('moment/locale/ko'); 

// 현재 날짜 객체 생성
const currentDate = moment();

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

export const getWeekNumber = () => {
    // 현재 연도 가져오기
    const currentYear = currentDate.year();

    // 현재 월 가져오기 (0부터 시작하므로 +1 해야 함)
    const currentMonth = currentDate.month() + 1;

    // 현재 날짜 가져오기
    const currentDay = currentDate.date();

    // 주차 번호 계산
    const currentWeekNumber = Math.ceil(currentDay / 7);

    // 결과 출력
    console.log(`${currentMonth}월 ${currentWeekNumber}주차`);
    return {"month":currentMonth, "num":currentWeekNumber}
}