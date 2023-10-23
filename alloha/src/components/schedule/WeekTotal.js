import { StyleSheet, Dimensions , Text, View } from 'react-native';
import { getCurrentWeek } from '../../util/moment';

export default function WeekTotal() {
    
  return (
    <View style={styles.container}>
        <NameBox name="합계"/>
        {
            alba.list.map((item, idx)=>{
                return <ContentBox key={idx} item={item} />
            })
        }
        <TotalBox sum={alba.sum} sumSub={alba.sumSub} />
    </View>
  );
}

function ContentBox({item}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, width:boxWidth}}>
            <Text style={{fontSize:boxWidth*0.3}}>{item.txt}</Text>
            <Text style={{fontSize:boxWidth*0.3, color:"red"}}>{item.subTxt}</Text>
        </View>
    );
}

function NameBox({name}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, width:boxWidth}}>
            <Text>{name}</Text>
        </View>
    );
}

function TotalBox({sum, sumSub}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, width:boxWidth}}>
            <Text style={{fontSize:boxWidth*0.3}}>{sum}</Text>
            <Text style={{fontSize:boxWidth*0.3, color:"red"}}>{sumSub}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    //container:{ flex: 1, justifyContent: 'center', alignItems: 'center'},
    container:{ flexDirection:"row",  },
    box:{
        flex:1,
        paddingVertical:15,
        margin:1,
        borderWidth: 1, // 테두리 두께
        borderColor: 'black', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    blank:{
        flex:1,
    }
});
  