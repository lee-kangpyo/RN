import { StyleSheet, Dimensions , Text, View, TouchableOpacity, Alert } from 'react-native';
import { getCurrentWeek, getWeekList } from '../../util/moment';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { URL } from "@env";

export default function WeekAlba({alba, onDel, week}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const weekList = getWeekList(week);
    const navigator = useNavigation();
    // [v] 이걸 풀어주면 근무계획에서 다음주만 계획 수정 가능함.
    // const isdeny = useSelector((state)=>state.schedule.week == state.schedule.eweek);
    const isdeny = true
    const onPressed = () =>{
        
        return (
            (isdeny)?Alert.alert(
                "알바생 "+alba.userNa+"님을 선택하셨습니다.",
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
            )
            :
            null
        )
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

    const delAlba = async (alba)=> {
        param = {cls:"AlbaDelete", cstCo:cstCo, userId:alba.userId, ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD"), wCnt:"0",};
        await axios.get(URL+`/api/v1/getWeekSchedule`, {params:param})
        .then((res)=>{
            onDel();
            alert("삭제가 완료되었습니다.");
        }).catch(function (error) {
            console.log(error);
            alert("삭제하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
        // exec PR_PLYA01_SCHMNG 'AlbaDelete', 16, 'Qpqpqpqp', '20231105', '20231111', 0
        
    };

    const modifyAlba = (alba)=> {
        navigator.navigate("scheduleModify", {alba:alba, stat:"search"})
    };
  return (
    <TouchableOpacity onPress={onPressed}>
        <View style={styles.container}>
            <NameBox name={alba.userNa}/>
            {
                weekList.map((item, idx)=>{
                    const ymd = item.format("YYYYMMDD");
                    const filter = alba.list.filter((item)=>item.YMD == ymd)
                    if (filter.length > 0){
                        return <ContentBox key={idx} item={filter} />
                    }else{
                        return <ContentBox key={idx} blank={true} />
                    }
                    
                })
            }
            <TotalBox sum={alba.sumG} sumSub={alba.sumS} />
        </View>
    </TouchableOpacity>
  );
}



function ContentBox({item, blank=false}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    var gg = [];
    var ss = [];
    if(!blank){
        gg = item.filter((el)=>el && el.JOBCL == "G");
        ss = item.filter((el)=>el && el.JOBCL == "S");
    }
    const g = gg.reduce((total, item) => total + (item.JOBDURE || 0), 0);
    const s = ss.reduce((total, item) => total + (item.JOBDURE || 0), 0);
    return (

        <View style={{...styles.box, width:boxWidth}}>
            {
                (blank)?
                    <Text style={{fontSize:boxWidth*0.3}}>-</Text>    
                :
                    <>
                        {
                            (g > 0)?
                                <Text style={{fontSize:boxWidth*0.3}}>{g}</Text>
                            :
                                null
                        }
                        {
                            (s > 0)?
                                <Text style={{fontSize:boxWidth*0.3, color:"red"}}>{s}</Text>
                            :
                                null
                        }
                    </>
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
  