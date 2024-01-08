import { StyleSheet, Dimensions , Text, View, TouchableOpacity, Alert } from 'react-native';
import { getCurrentWeek, getWeekList } from '../../util/moment';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { URL } from "@env";
import React from 'react';

export default function WeekAlba({alba, onTap, onDel, week}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const weekList = getWeekList(week);
    const navigator = useNavigation();
    const workInfo = useSelector((state)=>state.work.workAlbaInfo)
    //console.log(alba)
  return (
        <View style={styles.container}>
            <NameBox name={alba.userNa}/>
            {
                weekList.map((item, idx)=>{
                    const ymd = item.format("YYYYMMDD");
                    const selected = (workInfo.isEditing && workInfo.ymd == ymd && workInfo.userId == alba.userId)?true:false;
                    const filter = alba.list.filter((item)=>item.YMD == ymd)
                    if (filter.length > 0){
                        return <ContentBox selected={selected} onTap={onTap} key={idx} item={filter} userId={alba.userId} userNa={alba.userNa} ymd={ymd} num={idx} />
                    }else{
                        return <ContentBox selected={selected} onTap={onTap} key={idx} blank={true} userId={alba.userId} userNa={alba.userNa} ymd={ymd} num={idx} />
                    }
                    
                })
            }
            <TotalBox sum={alba.sumG} sumSub={alba.sumS} />
        </View>
  );
}


const ContentBox = React.memo(({item, userId, userNa, ymd, num, onTap, blank=false, selected}) => {
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
        <TouchableOpacity onPress={()=>onTap({userNa, userId, ymd, num}, item)} style={{...styles.box, width:boxWidth, borderColor:(selected)?"red":"grey"}}>
            {
                (blank)?
                    <Text style={{fontSize:boxWidth*0.3}}>-</Text>    
                :
                    <>
                        {
                            (g > 0)?
                                <Text style={{fontSize:boxWidth*0.3}}>{g.toFixed(1)}</Text>
                            :
                                null
                        }
                        {
                            (s > 0)?
                                <Text style={{fontSize:boxWidth*0.3, color:"red"}}>{s.toFixed(1)}</Text>
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
    return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item) && prevProps.selected === nextProps.selected && prevProps.userId === nextProps.userId && prevProps.ymd === nextProps.ymd;
})

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
            <Text style={{fontSize:boxWidth*0.3}}>{sum.toFixed(1)}</Text>
            {
                (sumSub == "")?
                    null
                :
                <Text style={{fontSize:boxWidth*0.3, color:"red"}}>{sumSub.toFixed(1)}</Text>
            }
            
        </View>
    );
}


const styles = StyleSheet.create({
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
  