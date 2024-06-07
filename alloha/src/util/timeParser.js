import moment from "moment";


export function parseTimeString(timeString) {
  const [hour, minute] = timeString.split(':').map(part => part.padStart(2, '0'));
  return {hour, minute};
}

// "09:00" -> {ampm: '오전', hour: '09', minute: '00'}
export function parseTimeString_old(timeString) {
const [hour, minute] = timeString.split(':').map(part => part.padStart(2, '0'));
const hourNumber = parseInt(hour, 10);
let ampm = "오전";

if (hour <12) {
  ampm = '오전';
  return { ampm, hour: hour, minute };
} else {
  ampm = '오후';
  return { ampm, hour: hour-12, minute };
}

  // if (hourNumber === 0) {
  //   return { ampm, hour: "12", minute };
  // } else if (hourNumber === 12) {
  //   ampm = "오후";
  //   return { ampm, hour: "12", minute };
  // } else if (hourNumber > 12) {
  //   ampm = "오후";
  //   return { ampm, hour: (hourNumber - 12).toString().padStart(2, '0'), minute };
  // } else {
  //   return { ampm, hour: hour.padStart(2, '0'), minute };
  // }
}



// {ampm: '오전', hour: '09', minute: '00'} -> "09:00"
export function formatTimeObject(timeObject) {
  let { ampm, hour, minute } = timeObject;
  hour = parseInt(hour, 10);

  if (ampm === "오전" && hour === 12) {
    // 오전 12시(자정)는 그대로 유지
    return `12:${minute}`; // 오전 12시는 12:00으로 유지
  } else if (ampm === "오후") {
    if (hour === 12) {
      // 오후 12시는 24시로 변환
      return `24:${minute}`;
    } else {
      // 오후 시간은 12를 더해서 24시간 형식으로 변환
      hour += 12;
    }
  }

  return `${hour.toString().padStart(2, '0')}:${minute}`;
}


// 07:00 08:00 -> 1, 07:00 08:30 -> 1.5
export function calculateDifference(sTime, eTime) {
  let startTime = moment(sTime, "HH:mm");
  let endTime = moment(eTime, "HH:mm");
  let difference = endTime.diff(startTime, 'minutes') / 60;
  return difference;
}

export function calculateTimeDifferenceStr(startTime, endTime) {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const differenceInHours = (endTotalMinutes - startTotalMinutes) / 60;

  return differenceInHours;
}

// '07:00', 1.5 -> '08:30', '07:00', -1.5 -> '05:30'
export function adjustTime(baseTime, hoursOffset) {
  // 'HH:mm' 형식의 시간을 moment 객체로 변환
  const time = moment(baseTime, 'HH:mm');
  
  // 초기 날짜와 시간 저장
  const initialDate = time.clone();
  
  // 시간 오프셋을 추가하거나 빼기
  time.add(hoursOffset, 'hours');
  
  // 날짜가 변경되었는지 확인
  // if (!time.isSame(initialDate, 'day')) {
  //   console.log(`The time adjustment leads to a date change: ${initialDate.format('YYYY-MM-DD HH:mm')} -> ${time.format('YYYY-MM-DD HH:mm')}`);
  //   return;
  // }

  // 날짜가 변경되지 않은 경우 결과 시간을 'HH:mm' 형식의 문자열로 반환
  return { baseTime, createTime:time.format('HH:mm') };

}