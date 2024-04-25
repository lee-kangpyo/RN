import { StyleSheet, Dimensions , Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getWeekList } from '../../util/moment';

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

function WeekBox({item, dateEng}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    const dd = item.format('dd');
    const color = (dd == "일")?"red":(dd == "토")?"blue":"#111111";
    const color2 = (dd == "일")?"red":(dd == "토")?"blue":"#777777";
    return (
        <View style={{...styles.box, width:boxWidth}}>
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
    blank:{
        paddingVertical:15,
        margin:2,
        alignItems:"center",
    }
});
  