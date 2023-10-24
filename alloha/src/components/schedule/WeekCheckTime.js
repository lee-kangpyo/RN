import { StyleSheet, Dimensions , Text, View, TouchableOpacity } from 'react-native';
import { getCurrentWeek } from '../../util/moment';
import { useSelector, useDispatch } from 'react-redux';
import { onTabCheckTIme } from '../../../redux/slices/schedule';
import React, { useEffect, useMemo, useState } from 'react';


export default function WeekCheckTime({time, content, x}) {
    return (
    <View style={styles.container}>
        <NameBox name={time}/>
        {
            content.map((val, idx)=>{
                return <ContentBox key={idx} x={x} y={idx} value={val} />
            })
        }
    </View>
    );
}

const ContentBox = React.memo(function ContentBox({x, y, value}){
    console.log("asdf");
    const dispatch = useDispatch();
    const val = (value == "0")?"-":value;
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <TouchableOpacity onPress={()=>dispatch(onTabCheckTIme({x:x, y:y, val:value}))}>
            <View style={{...styles.box, width:boxWidth}}>
                <Text style={{fontSize:16}}>{val}</Text>
            </View>
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
  }
)


function NameBox({name}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, flex:1.5, width:boxWidth}}>
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
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    blank:{
        flex:1,
    }
});
  