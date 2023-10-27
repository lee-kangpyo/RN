import { StyleSheet, Dimensions , Text, View, TouchableOpacity, Alert } from 'react-native';
import { getCurrentWeek } from '../../util/moment';
import { useNavigation } from '@react-navigation/native';

export default function WeekAlba({alba}) {
    const navigator = useNavigation();
    const onPressed = () =>{
        return Alert.alert(
            "알바생 "+alba.name+"님을 선택하셨습니다.",
            "수정 또는 삭제",
            [
                {
                    text: "삭제",
                    onPress: () => confirm("삭제", "정말 삭제 하시겠습니까?", ()=>delAlba(alba)),
                    style: "cancel"
                },
                { text: "수정", onPress: () => modifyAlba(alba) },
            ],
            { cancelable: false }
        );
    };

    const confirm = (title, content, confirm) => {
        return Alert.alert(
            title, content,
            [
                {text:"네", onPress:()=>confirm()},
                {text:"아니오"}
            ]
        )
    }

    const delAlba = (alba)=> {
        console.log(alba.name + "삭제")
    };

    const modifyAlba = (alba)=> {
        console.log(alba.name + "수정")
        navigator.navigate("scheduleModify", {alba:alba})
    };

  return (
    <TouchableOpacity onPress={onPressed}>
        <View style={styles.container}>
            <NameBox name={alba.name}/>
            {
                alba.list.map((item, idx)=>{
                    return <ContentBox key={idx} item={item} />
                })
            }
            <TotalBox sum={alba.sum} sumSub={alba.sumSub} />
        </View>
    </TouchableOpacity>
  );
}



function ContentBox({item}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, width:boxWidth}}>
            <Text style={{fontSize:boxWidth*0.3}}>{item.txt}</Text>
            {
                (item.subTxt == "")?
                    null
                :
                <Text style={{fontSize:boxWidth*0.3, color:"red"}}>{item.subTxt}</Text>
            }
            
        </View>
    );
}

function NameBox({name}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, flex:2, width:boxWidth, backgroundColor:"#D2E0FB"}}>
            <Text>{name}</Text>
        </View>
    );
}

function TotalBox({sum, sumSub}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, flex:2, width:boxWidth, backgroundColor:"#F9F3CC"}}>
            <Text style={{fontSize:boxWidth*0.3}}>{sum}</Text>
            {
                (sumSub == "")?
                    null
                :
                <Text style={{fontSize:boxWidth*0.3, color:"red"}}>{sumSub}</Text>
            }
            
        </View>
    );
}


const styles = StyleSheet.create({
    //container:{ flex: 1, justifyContent: 'center', alignItems: 'center'},
    container:{ flexDirection:"row",  },
    box:{
        height:50,
        flex:1,
        paddingVertical:5,
        margin:1,
        borderWidth: 1, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
        justifyContent:"center",
    },
    blank:{
        flex:1,
    }
});
  