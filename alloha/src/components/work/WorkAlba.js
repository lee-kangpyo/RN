import { StyleSheet, Dimensions , Text, View, TouchableOpacity, Alert } from 'react-native';
import { getCurrentWeek, getWeekList } from '../../util/moment';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { URL } from "@env";
import React from 'react';

export default function WeekAlba({alba, onTap, onDel, week}) {
    const cstCo = useSelector((state)=>state.schedule.cstCo);
    const weekList = getWeekList(week);
    const navigator = useNavigation();
    const isdeny = useSelector((state)=>state.schedule.week == state.schedule.eweek);
    const workInfo = useSelector((state)=>state.work.workAlbaInfo)
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
        <View style={styles.container}>
            <NameBox name={alba.userNa}/>
            {
                weekList.map((item, idx)=>{
                    const ymd = item.format("YYYYMMDD");
                    const selected = (workInfo.isEditing && workInfo.ymd == ymd)?true:false;
                    const filter = alba.list.filter((item)=>item.YMD == ymd)
                    if (filter.length > 0){
                        return <ContentBox selected={selected} onTap={onTap} key={idx} item={filter} userId={alba.userId} ymd={ymd} num={idx} />
                    }else{
                        return <ContentBox selected={selected} onTap={onTap} key={idx} blank={true} userId={alba.userId} ymd={ymd} num={idx} />
                    }
                    
                })
            }
            <TotalBox sum={alba.sumG} sumSub={alba.sumS} />
        </View>
  );
}


const ContentBox = React.memo(({item, userId, ymd, num, onTap, blank=false, selected}) => {
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
        
        <TouchableOpacity onPress={()=>onTap({userId, ymd, num}, item)} style={{...styles.box, width:boxWidth, borderColor:(selected)?"red":"grey"}}>
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
                        { 
                            (g == 0 && s == 0)?
                                <Text style={{fontSize:boxWidth*0.3}}>-</Text>
                            :
                                null
                        }
                    </>
            }
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    console.log(prevProps.selected)
    console.log(nextProps.selected)
    return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item) && prevProps.selected === nextProps.selected;
})
// function ContentBox({item, userId, ymd, num, onTap, blank=false, selected}){
//     const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
//     var gg = [];
//     var ss = [];
//     if(!blank){
//         gg = item.filter((el)=>el && el.JOBCL == "G");
//         ss = item.filter((el)=>el && el.JOBCL == "S");
//     }
//     const g = gg.reduce((total, item) => total + (item.JOBDURE || 0), 0);
//     const s = ss.reduce((total, item) => total + (item.JOBDURE || 0), 0);
//     return (
        
//         <TouchableOpacity onPress={()=>onTap({userId, ymd, num}, item)} style={{...styles.box, width:boxWidth, borderColor:(selected)?"red":"grey"}}>
//             {
//                 (blank)?
//                     <Text style={{fontSize:boxWidth*0.3}}>-</Text>    
//                 :
//                     <>
//                         {
//                             (g > 0)?
//                                 <Text style={{fontSize:boxWidth*0.3}}>{g}</Text>
//                             :
//                                 null
//                         }
//                         {
//                             (s > 0)?
//                                 <Text style={{fontSize:boxWidth*0.3, color:"red"}}>{s}</Text>
//                             :
//                                 null
//                         }
//                         { 
//                             (g == 0 && s == 0)?
//                                 <Text style={{fontSize:boxWidth*0.3}}>-</Text>
//                             :
//                                 null
//                         }
//                     </>
//             }
//         </TouchableOpacity>
//     );
// }

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
  