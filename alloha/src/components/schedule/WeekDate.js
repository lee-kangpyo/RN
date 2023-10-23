import { StyleSheet, Dimensions , Text, View } from 'react-native';
import { getCurrentWeek } from '../../util/moment';

export default function WeekDate() {
    const currentWeek = getCurrentWeek();
    console.log(currentWeek);
    console.log(currentWeek[0].format('YYYY년 MM월 DD일'));

  return (
    <View style={styles.container}>
        <BlankBox flex={2}/>
        {currentWeek.map((el, idx)=>{
            return <WeekBox key={idx} item={el}/>
        })}
        <BlankBox flex={1}/>
    </View>
  );
}

function WeekBox({item}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    const dd = item.format('dd');
    const color = (dd == "일")?"red":(dd == "토")?"blue":"black";
    return (
        <View style={{...styles.box, width:boxWidth}}>
            <Text style={{fontSize:boxWidth*0.4, color:color}}>{item.format('DD')}</Text>
            <Text style={{fontSize:boxWidth*0.2, color:color}}>({dd})</Text>
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

const styles = StyleSheet.create({
    container:{ flexDirection:"row",  },
    box:{
        flex:1,
        paddingVertical:5,
        margin:1,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    blank:{
        flex:1,
        paddingVertical:15,
        margin:2,
        alignItems:"center",
    }
});
  