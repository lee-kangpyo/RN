import { StyleSheet, Dimensions , Text, View, TouchableOpacity, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { getWeekList } from '../../util/moment';
import { lightenColor } from '../../util/color';
import { useEffect, useRef, useState } from 'react';

export default function WeekDate({sBlank, eBlank, week}) {
    const weekList = getWeekList(week);
    const dateEng = {"일":"Sun", "월":"Mon", "화":"Tue", "수":"Wed", "목":"Thu", "금":"Fri", "토":"Sat"};
    
    return (
    <View style={styles.container}>
        {
            (sBlank)?
                <BlankBox flex={sBlank}/>
            :
                null
        }
        {
            weekList.map((el, idx)=>{
                return <WeekBox key={idx} item={el} dateEng={dateEng}/>
            })
        }
        {
            (eBlank)?
                <BlankBox flex={eBlank}/>
            :
                null
        }
        
    </View>
    );
}

export function WeekDate2({week, selectDay, onTap, position, selYmd, enterEl, isAnime}) {
    const weekList = getWeekList(week);
    const dateEng = {"일":"Sun", "월":"Mon", "화":"Tue", "수":"Wed", "목":"Thu", "금":"Fri", "토":"Sat"};
    return (
    <View style={styles.container}>
        {
            weekList.map((el, idx)=>{
                return (
                    <TouchableWeekBox key={idx} position={position} item={el} dateEng={dateEng} mode={"sel"} selectDay={selectDay} onDateTap={(ymd)=>onTap(ymd)} selYmd={selYmd} enterEl={enterEl} isAnime={isAnime}/>
                )
            })
        }
    </View>
    );
}

function TouchableWeekBox({item, dateEng, selectDay, onDateTap, position, selYmd, enterEl, isAnime}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    const ymd = item.format("yyyyMMDD");
    const dd = item.format('dd');
    const color = (dd == "일")?"#ff0000":(dd == "토")?"#0000ff":"#111111";
    const color2 = (dd == "일")?"#ff0000":(dd == "토")?"#0000ff":"#111111";

    const [elSize, setElSize] = useState({});
    const [isActive, setIsactive] = useState(false);
    const ref = useRef(null)
    const getCoordinates = () => {
        ref.current.measure((fx, fy, width, height, px, py) => {
            let adjustmentHeight = 0;
            if(Platform.OS == "ios"){
                adjustmentHeight = 88;
            }
            setElSize({
                fX: px,  // 왼쪽 상단 X 좌표
                fY: py + adjustmentHeight + 10,  // 왼쪽 상단 Y 좌표
                lX: px + width,  // 오른쪽 하단 X 좌표
                lY: py + height + adjustmentHeight + 100  // 오른쪽 하단 Y 좌표
            });
        });
    };
    
    const isPointInObjectBounds = (bounds, point) => {
        const { fX, fY, lX, lY } = bounds;
        const { x, y } = point;
        // 좌표가 범위 안에 있는지 체크
        return (
            x >= fX && x <= lX &&  // x 좌표가 범위 내에 있는지
            y >= fY && y <= lY     // y 좌표가 범위 내에 있는지
        );
    }

    useEffect(()=>{
        const active = isPointInObjectBounds(elSize, position);
        if(active) enterEl(ymd);
        if(!active && selYmd == ymd) enterEl("");
        if(isActive != active){
            setIsactive(active);
        }
    }, [position])
    return (
        <TouchableOpacity onLayout={getCoordinates} ref={ref} onPress={()=>onDateTap(ymd)} style={[styles.box2, {width:boxWidth, transform: [{ scale: (isActive && isAnime)?1.3:1}, {translateY: (isActive && isAnime)?0:0}] }]}>
            <Text style={[fonts.date, {fontSize:boxWidth*0.4, color:(selectDay == ymd || isActive)?color:lightenColor(color, 80)}]}>{item.format('DD')}</Text>
            <Text style={[fonts.dateStr, {fontSize:boxWidth*0.2, color:(selectDay == ymd || isActive)?color2:lightenColor(color2, 80)}]}>{dateEng[dd]}</Text>
        </TouchableOpacity>
    );
}
function WeekBox({item, dateEng}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    const dd = item.format('dd');
    const color = (dd == "일")?"#ff0000":(dd == "토")?"#0000ff":"#111111";
    const color2 = (dd == "일")?"#ff0000":(dd == "토")?"#0000ff":"#111111";
    return (
        <View style={[styles.box, {width:boxWidth}]}>
            <Text style={[fonts.date, {fontSize:boxWidth*0.4, color:color}]}>{item.format('DD')}</Text>
            <Text style={[fonts.dateStr, {fontSize:boxWidth*0.2, color:color2}]}>{dateEng[dd]}</Text>
        </View>
    );
}



function BlankBox({flex}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.blank, flex:flex, width:boxWidth}}>
        </View>
    );
}

const fonts = StyleSheet.create({
    date:{
        fontFamily: "SUIT-ExtraBold",
        fontWeight: "800",
    },
    dateStr:{
        fontFamily: "SUIT-Regular",
        fontWeight: "400",
        fontStyle: "normal",
        color: "#777777"
    }
})

const styles = StyleSheet.create({
    container:{ flexDirection:"row",  },
    box:{
        flex:1,
        paddingVertical:5,
        margin:1,
        borderWidth: 1, // 테두리 두께
        borderColor: 'white', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    box2:{
        flex:1,
        backgroundColor:"white",
        paddingVertical:5,
        margin:5,
        borderWidth: 1, // 테두리 두께
        borderColor: 'white', // 테두리 색상
        borderRadius: 5, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    blank:{
        paddingVertical:15,
        margin:2,
        alignItems:"center",
    }
});
  