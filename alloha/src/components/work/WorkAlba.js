import { StyleSheet, Dimensions , Text, View, TouchableOpacity, Image } from 'react-native';
import { getCurrentWeek, getWeekList } from '../../util/moment';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import React from 'react';
import { theme } from '../../util/color';

export default function WeekAlba({alba, onTap, onDel, week}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const weekList = getWeekList(week);
    const navigator = useNavigation();
    const workInfo = useSelector((state)=>state.work.workAlbaInfo);
    //console.log(alba)
  return (
        <View style={styles.container}>
            <NameBox name={alba.userNa} onDel={onDel}/>
            {
                weekList.map((item, idx)=>{
                    const ymd = item.format("YYYYMMDD");
                    const selected = (workInfo.isEditing && workInfo.ymd == ymd && workInfo.userId == alba.userId)?true:false;
                    const filter = alba.list.filter((item)=>item.YMD == ymd)
                    if (filter.length > 0){
                        return (
                                <ContentBox selected={selected} onTap={onTap} key={idx} item={filter} userId={alba.userId} userNa={alba.userNa} ymd={ymd} num={idx} />
                                
                        )
                    }else{
                        return (
                                <ContentBox selected={selected} onTap={onTap} key={idx} blank={true} userId={alba.userId} userNa={alba.userNa} ymd={ymd} num={idx} />
                                
                        )
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
        <>
        <TouchableOpacity onPress={()=>onTap({userNa, userId, ymd, num}, item)} style={{...styles.box, width:boxWidth, borderRadius:5, borderColor:"red", borderWidth:(selected)?1:0}}>
            {
                (blank)?
                    <Text style={[fonts.content, {fontSize:boxWidth*0.3}]}>-</Text>    
                :
                    <>
                        {
                            (g > 0)?
                                <Text style={[fonts.content, {fontSize:boxWidth*0.3}]}>{g.toFixed(1)}</Text>
                            :
                                null
                        }
                        {
                            (s > 0)?
                                <Text style={[fonts.content, {fontSize:boxWidth*0.3, color:theme.primary}]}>{s.toFixed(1)}</Text>
                            :
                                null
                        }
                        { 
                            (g == 0 && s == 0)?
                                <Text style={[fonts.content, {fontSize:boxWidth*0.3}]}>-</Text>
                            :
                                null
                        }
                    </>
            }
        </TouchableOpacity>
        {(num < 6)?<View style={styles.sep}/>:null}
        </>
    );
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item) && prevProps.selected === nextProps.selected && prevProps.userId === nextProps.userId && prevProps.ymd === nextProps.ymd;
})

function NameBox({name, onDel}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, flex:1.3, width:boxWidth, backgroundColor:"#3479EF", borderTopLeftRadius:5, borderBottomLeftRadius:5}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={[fonts.albaName, {marginBottom:5}]}>{name}</Text>
            <TouchableOpacity onPress={onDel}>
                <Image source={require('../../../assets/icons/delIcon.png')} style={styles.delIcon}/>
            </TouchableOpacity>
        </View>
    );
}

function TotalBox({sum, sumSub}){
    const boxWidth = Dimensions.get('window').width / 9; // 박스의 너비
    return (
        <View style={{...styles.box, flex:1, width:boxWidth, backgroundColor:"#F9F3CC", borderTopRightRadius:5, borderBottomRightRadius:5}}>
            <Text style={[fonts.content, {fontSize:boxWidth*0.3}]}>{sum.toFixed(1)}</Text>
            {
                (sumSub == "")?
                    null
                :
                <Text style={[fonts.content, {fontSize:boxWidth*0.3, color:theme.primary}]}>{sumSub.toFixed(1)}</Text>
            }
            
        </View>
    );
}

const fonts = StyleSheet.create({
    albaName:{
        fontFamily: "SUIT-SemiBold",
        fontSize: 12,
        fontWeight: "600",
        fontStyle: "normal",
        color: "#FFFFFF"
    },
    content:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        fontWeight: "700",
        fontStyle: "normal",
        color: "#333333"
    }
})

const styles = StyleSheet.create({
    container:{ 
        flexDirection:"row",  
        marginBottom:8,
        borderWidth:1,
        borderColor:"#EEEEEE",
        borderRadius:5
    },
    box:{
        height:50,
        flex:1,
        paddingVertical:5,
        margin:0,
        alignItems:"center",
        justifyContent:"center",
    },
    blank:{
        flex:1,
    },
    delIcon:{
        width:16,
        height:16
    },
    sep:{
        borderWidth:0.5,
        borderColor:"#EEEEEE",
        height:"70%",
        alignSelf:"center",
        
    }
});
  