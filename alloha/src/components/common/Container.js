import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Touchable, TouchableOpacity, Keyboard } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

export function PayDetailContainer({header, contents, ondeataTap}){
    return(
        <View>
            <View style={styles.row}>
                {
                    header.map((label, idx)=>{
                        return <NameBox key={idx} text={label} />
                    })
                }
            </View>
                {
                    (contents.length > 0)?
                    <View>
                        {
                            contents.map((el, idx)=>{
                                return <PayDetailLine key={idx} item={el} onDeataTap={ondeataTap}/>
                            })
                        }
                    </View>
                    :
                    <View style={{alignItems:"center", borderWidth:0.5, margin:1, padding:3}}>
                        <Text>데이터가 없습니다.</Text>
                    </View>
                }
        </View>
    )
}


const PayDetailLine = ({item, onDeataTap}) => {
    const [isEdit, setEdit] = useState(false);
    const spcWage = (item.spcWage > 0)?item.spcWage.toLocaleString():"";
    return(
        <View style={[styles.row, {justifyContent:"space-between"}]}>
            <ContentBox text={item.week1+"주"} />
            <ContentBox text={item.jobDure} subText={item.jobWage.toLocaleString()} alignItems='flex-end'/>
            {
                (isEdit && item.spcDure > 0)?
                    <EidtNumberBox text={item.spcDure.toLocaleString()} onTap={(value)=>{onDeataTap({value, userId:item.userId, weekNumber:item.week1});setEdit(false);}} />
                :
                (item.spcDure > 0)?
                    <ContentBox text={item.spcDure.toLocaleString()} subText={spcWage} onTap={()=>setEdit(true)}  alignItems='flex-end'/>
                :
                <ContentBox text={item.spcDure.toLocaleString()} subText={spcWage}  alignItems='flex-end'/>
            }
            
            <ContentBox text={"-"} subText={item.weekWage} alignItems='flex-end'/>
            <ContentBox text={item.jobDure + item.spcDure} subText={item.salary} alignItems='flex-end'/>
            
        </View>
    )
}

export function PayContainer({header, contents, onNameTap, onIncentiveTap}) {
    return(
        <ScrollView>
            <View style={styles.row}>
                {
                    header.map((label, idx)=>{
                        return <NameBox key={idx} text={label} />
                    })
                }
            </View>
                {
                    (contents.length > 0)?
                    <View>
                        {
                            contents.map((el, idx)=>{
                                return <PayLine key={idx} item={el} onNameTap={onNameTap} onIncentiveTap={onIncentiveTap} />
                            })
                        }
                    </View>
                    :
                    <View style={{alignItems:"center", borderWidth:0.5, margin:1, padding:3}}>
                        <Text>데이터가 없습니다.</Text>
                    </View>
                }
        </ScrollView>
    )
};

export function TotalContainer({contents}) {
    
    return(
        <View>
            <View style={styles.row}>
                {
                    contents.map((label, idx)=>{
                        if(Array.isArray(label)){
                            return <NameBox2 key={idx} list={label} />
                        }else{
                            return <NameBox key={idx} text={label} />
                        }
                        
                    })
                }
            </View>
        </View>
    )
};

const NameBox = ({text}) => {
    return (
        <View style={styles.box}>
            <Text>{text}</Text>
        </View>
    )
}
const NameBox2 = ({list}) => {
    return (
        <View style={styles.box}>
            <Text>{list[0]}</Text>
            <Text style={styles.subText}>{list[1]}</Text>
        </View>
    )
}

const PayLine = ({item, onNameTap, onIncentiveTap}) => {
    const [isEdit, setEdit] = useState(false);
    return(
        <View style={[styles.row, {justifyContent:"space-between"}]}>
            <ContentBox text={item.userNa} onTap={()=>onNameTap(item)}/>
            <ContentBox text={item.jobWage.toLocaleString()} alignItems='flex-end'/>
            <ContentBox text={item.weekWage.toLocaleString()} subText={item.weekWageNa}  alignItems='flex-end' />
            
            {
                (isEdit)?
                    <EidtNumberBox text={item.incentive.toLocaleString()} onTap={(value)=>{onIncentiveTap({value, userId:item.userId});setEdit(false);}} />
                :
                    <ContentBox text={item.incentive.toLocaleString()} onTap={()=>setEdit(true)}  alignItems='flex-end' />
            }
            <ContentBox text={item.salary.toLocaleString()}  alignItems='flex-end'/>
        </View>
    )
}

const EidtNumberBox = ({ initvalue=0, onTap, alignItems = "center"}) => {
    const ref = useRef(initvalue);
    const [value, setValue] = useState("")
    const onSave = () => {
        if (value == "" || (!isNaN(value) && value >= 0 && value == parseInt(value, 10))) {
            onTap(value);
        }else{
            alert("잘못된 값을 입력하셨습니다.")
            ref.current.focus();
        }
    }
    return(
        <TouchableOpacity activeOpacity={(onTap)?0.2:1} style={[styles.box, {alignItems:alignItems, paddingHorizontal:5}]} onPress={onTap}>
            <TextInput autoFocus={true} style={styles.input} ref={ref} value={value} keyboardType='number-pad' onChange={(e)=>setValue(e.nativeEvent.text)} 
                onBlur={onSave}
            />
        </TouchableOpacity>
    )
}
const ContentBox = ({text, subText, onTap, alignItems = "center"}) => {
    return(
        <TouchableOpacity activeOpacity={(onTap)?0.2:1} style={[styles.box, {alignItems:alignItems, paddingHorizontal:5}]} onPress={onTap}>
            <Text>{text}</Text>
            {
                (subText)?
                    <Text style={styles.subText}>({subText})</Text>
                :null
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    row:{
        flexDirection:"row",
        justifyContent:"space-between",
        margin:0.5,
    },
    box:{
        alignItems:"center",
        paddingVertical:5,
        flex:1,
        marginHorizontal:0.5,
        borderWidth:1,
        borderColor:"grey",
        justifyContent:"center",
    },
    subText:{
        color:"grey",
        fontSize:10
    },
    input:{
        borderWidth:1,
        borderRadius:1,
        borderColor:"grey",
        width:"100%"
    }
});