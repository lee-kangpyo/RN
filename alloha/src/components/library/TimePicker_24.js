import { View, Text, Animated } from 'react-native';
import WheelPicker from './WheelPicker';
import { useEffect, useRef, useState } from 'react';
import WheelPicker2 from './WheelPicker2';

// TimePicker 컴포넌트 정의
const TimePicker = ({ onTimeChange, itemHeight, initValue, refresh }) => {
  
  const hourItems = Array.from({ length: 25 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  const minuteItems = ["00", "30"];
  
  const { hour, minute } = initValue || {};
  const minidx = (minute == "00")?0:1;
  
  const selectedHour = useRef('');
  const selectedMinute = useRef('');
  
  const [hourIdx, setHourIndex] = useState(hour)
  const [hRefresh, setHRefresh] = useState(0)

  const [minIdx, setMinIdx] = useState(minidx)
  const [mRefresh, setMRefresh] = useState(0)

  const handleIndexChange = (category, item) => {
    console.log(category, item)
    switch (category) {
      case 'hour':
        selectedHour.current = item;
        break;
      case 'minute':
          if(selectedHour.current == "24"){
            setMinIdx(0);
            setMRefresh(mRefresh+1);
            selectedMinute.current = "00";
          }else{
            selectedMinute.current = item;
          }
        break;
      default:
        throw new Error('Invalid time category');
    }
    
    onTimeChange({
      hour: selectedHour.current,
      minute: selectedMinute.current,
    });
  };


  useEffect(()=>{
    console.log("refresh 변경됨", refresh);
    const minidx = (initValue.minute == "00")?0:1;
    setHourIndex(Number(initValue.hour));
    setMinIdx(minidx);
    
    setHRefresh(hRefresh + 1)
    setMRefresh(mRefresh + 1);

  }, [refresh])
  

  return (
    
    <View
      style={{
        flexDirection: 'row',
        height: itemHeight * 3,
        justifyContent: 'center',
      }}
    >
      <WheelPicker2
        idx={hourIdx}
        refresh={hRefresh}
        items={hourItems}
        onItemChange={(item) => handleIndexChange('hour', item)}
        itemHeight={itemHeight}
        initValue={hour}
        containerStyle={{ paddingHorizontal: 16 }}
      />
      <View
        style={{
          height: itemHeight * 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={[{ color: "#111", paddingHorizontal: 16, fontFamily: "SUIT-Bold", fontSize: 24,  }]}>:</Text>
      </View>
      <WheelPicker2
        idx={minIdx}
        refresh={mRefresh}
        items={minuteItems}
        onItemChange={(item) => handleIndexChange('minute', item)}
        itemHeight={itemHeight}
        initValue={minute}
        containerStyle={{ paddingHorizontal: 16 }}
      />
      <View
        style={{
          position: 'absolute',
          height: itemHeight,
          top: itemHeight,
          left: 0,
          right: 0,
          zIndex: -1,
        }}
      ></View>
    </View>
  );
};

export default TimePicker;