import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Touchable, TouchableOpacity, Keyboard, ScrollView, TextInput } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';


const ProfitLossSubLine = ({type, items, text, isOpen, onChangeValue}) => {
    const style = (text)?styles.borderBox:{width:40}
    return(
        (isOpen)?
            <View style={{flexDirection:"row"}}>
                <View style={style}>
                    <Text>{text}</Text>
                </View>
                <View style={{flex:1}}>
                {
                    items.map((el, idx)=>{
                        return(
                            (type == "sub")?
                                <ProfitBox 
                                    key={idx}
                                    text={el.CONA} 
                                    text2={el.AMT.toLocaleString()} 
                                    style={{flexDirection:"row", justifyContent:"space-between", height:25}} 
                                    onTapToEdit={(value)=>onChangeValue({plItCo:el.PLITCO, value:value})}
                                    fontSize={13}
                                />
                            :
                                <ProfitBox 
                                    key={idx}
                                    text={el.userNa} 
                                    text2={el.salary.toLocaleString()} 
                                    style={{flexDirection:"row", justifyContent:"space-between", height:25}} 
                                    fontSize={13}
                                />
                        )
                    })
                }
                </View>
            </View>
        :
            null
    )
}

function ProfitLossMainLine ({item, subItems, albaList, onChangeValue}) {
    const [isOpen, setIsOpen] = useState(false);
    const editable = ["0200"];
    const onTap = (editable.indexOf(item.PLITCO) > -1)?(value)=>onChangeValue({plItCo:item.PLITCO, value:value}):null;
    const isExistSub = (subItems && subItems.length > 0)?true:false
    const isExistAlba = (albaList && albaList.length > 0)?true:false
    //임시조치 인건비 null로 나오는 이슈 있음.
    return (
        <>
            <ProfitBox text={item.CONA} text2={item.AMT.toLocaleString()} 
                onTapToEdit={onTap} 
                isSub={isExistSub || isExistAlba}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
            {   (isExistSub)? <ProfitLossSubLine type={"sub"} isOpen={isOpen} items={subItems} onChangeValue={onChangeValue}/>:null   }
            {   (isExistAlba)? <ProfitLossSubLine type={"alba"} isOpen={isOpen} items={albaList} onChangeValue={onChangeValue}/> : null }
        </>
    )
}

export function ProfitLossPl({data, albaList, onChangeValue}){
    const mainData = data.filter((el)=>el.ORDBY % 100 == 0);
    return (
        <ScrollView contentContainerStyle={{padding:5}} style={[styles.card, {marginBottom:0, padding:0}]}>
            {
                (mainData.length > 0)?
                    mainData.map((item, idx)=>{
                        item.AMT = (item.AMT)?item.AMT:0;
                        const subItems = data.filter(el => el.ORDBY > item.ORDBY && el.ORDBY < item.ORDBY + 100);
                        if(item.CONA == "인건비"){
                            return <ProfitLossMainLine key={idx} item = {item} albaList={albaList} />               
                        }else{
                            return <ProfitLossMainLine key={idx} item = {item} subItems={subItems} onChangeValue={onChangeValue}/>                   
                        }
                    })
                :
                    <View style={{alignItems:"center"}}>
                        <Text style={table.contentText}>데이터가 없습니다.</Text>
                    </View>
            }
        </ScrollView>
    )
}

export function ProfitLossAlbaList({data}){
    const total = data.reduce((result, next)=>{
        return result + next.salary;
    }, 0)
    return (
        <View style={[styles.card, {paddingVertical:0, flex:1}]}>
            <View style={{flexDirection:"row", justifyContent:"space-between", padding:5, marginBottom:1, borderBottomWidth:1, borderBottomColor:"grey"}}>
                <Text style={{fontSize:18, fontWeight:"bold"}}>인건비 상세</Text>
                <Text style={{fontSize:16}}>합계 : {total.toLocaleString()}</Text>
            </View>
            <ScrollView >
                {
                    data.map((el, idx)=>{
                        return (
                            <ProfitBox key={idx} text={el.userNa} text2={el.salary.toLocaleString()} />
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

// onTapToEdit:function 이 있으면 터치로 텍스트 인풋을 열수있다.
// isSub:bool, isOpen:bool, setIsOpen:function 터치로 subLine을 열수있다. 
function ProfitBox({style={}, onTapToEdit, isSub, isOpen, setIsOpen, text, text2, fontSize=16}){
    const [isText, setIsText] = useState(true);
    const fontWeight = (text == "손익")?"bold":"normal";
    const Accodion = () => {
        const name = (isOpen)?"chevron-up":"chevron-down"
        return <FontAwesome5 style={{marginLeft:5}} name={name} size={fontSize} color="red"/>;
    }
    
    return(
        (isSub)?
            <TouchableOpacity activeOpacity={1} onPress={()=>setIsOpen(!isOpen)} style={[styles.borderBox, {flexDirection:"row", justifyContent:"space-between", height:40}, style]}>
                <Text style={{fontSize:fontSize, fontWeight:fontWeight}}>{text}</Text>
                <View style={[styles.row, {alignItems:"center"}]}>
                    <Text style={{fontSize:fontSize, fontWeight:fontWeight}}>{text2}</Text>
                    <Accodion />
                </View>
            </TouchableOpacity>
        :
        (onTapToEdit)?
            <TouchableOpacity onPress={()=>{setIsText(false);}} style={[styles.borderBox, {flexDirection:"row", justifyContent:"space-between", height:40,}, style]}>
                <Text style={{fontSize:fontSize, fontWeight:fontWeight}}>{text}</Text>
                {
                    (isText)?
                        <View>
                            <Text style={{fontSize:fontSize, fontWeight:fontWeight, marginRight:20}}>{text2}</Text>
                        </View>
                    :
                        <EidtNumberBox
                            initvalue={text2}
                            onTap={(value)=>{onTapToEdit(value);setIsText(true);}}
                            hasBox={false}
                        />
                }
                
            </TouchableOpacity>
        :
            <View style={[styles.borderBox, {flexDirection:"row", justifyContent:"space-between", height:40}, style]}>
                <Text style={{fontSize:fontSize, fontWeight:fontWeight}}>{text}</Text>
                <Text style={{fontSize:fontSize, fontWeight:fontWeight, marginRight:20}}>{text2}</Text>
            </View>
    )
}

export function PayDetailContainer({header, contents, ondeataTap, firstColTap}){
    return(
        <View style={{borderWidth:1, borderColor:"#DDD", borderRadius:10, overflow:"hidden"}}>
            <View style={[styles.row, {marginTop:0, marginBottom:-0.1}]}>
                {
                    header.map((label, idx)=>{
                        return <NameBox key={idx} text={label} fontSize={14} backgroundColor={"#999"} sep={(header.length != idx+1)?<Sep/>:null}/>
                    })
                }
            </View>
            <Sep />
            {
                (contents.length > 0)?
                <View>
                    {
                        contents.map((el, idx)=>{
                            return <PayDetailLine key={idx} item={el} onDeataTap={ondeataTap} underLine={contents.length > idx + 1} firstColTap={firstColTap}/>
                        })
                    }
                </View>
                :
                <View style={{alignItems:"center", borderWidth:0, margin:1, padding:3}}>
                    <Text style={table.contentText}>데이터가 없습니다.</Text>
                </View>
            }
        </View>
    )
}


const PayDetailLine = ({item, onDeataTap, firstColTap, underLine=false}) => {
    const [isEdit, setEdit] = useState(false);
    const spcWage = (item.spcWage > 0)?item.spcWage.toLocaleString():"0";
    return(
        <>
        <View style={[styles.row, {justifyContent:"space-between", marginVertical:-0.3}]}>
            <ContentBox text={item.week1+"주"} fontSize={14} onTap={()=>{firstColTap(item)}}/>
            <Sep />
            <ContentBox text={item.jobWage.toLocaleString()} subText={item.jobDure} alignItems='flex-end'/>
            <Sep />
            <ContentBox text={item.weekWage.toLocaleString()} alignItems='flex-end'/>
            <Sep />
            <ContentBox text={item.incentive.toLocaleString()} alignItems='flex-end'/>
            <Sep />
            {
                (false)?
                    (false && isEdit && item.spcDure > 0)?
                        <EidtNumberBox text={item.spcDure.toLocaleString()} onTap={(value)=>{onDeataTap({value, userId:item.userId, weekNumber:item.week1});setEdit(false);}} />
                    :
                    (item.spcDure > 0)?
                        <ContentBox text={spcWage.toLocaleString()} subText={item.spcDure.toLocaleString()} onTap={()=>setEdit(true)}  alignItems='flex-end'/>
                    :
                    <ContentBox text={spcWage.toLocaleString()} subText={item.spcDure.toLocaleString()}  alignItems='flex-end'/>
                :null
            }
            <ContentBox text={item.salary.toLocaleString()} alignItems='flex-end'/>
        </View>
        {(underLine)?<Sep />:null}
        </>
    )
}

export function PayContainer({header, contents, onNameTap, onIncentiveTap}) {
    return(
        <ScrollView stickyHeaderIndices={[0]} contentContainerStyle={{borderWidth:1, borderColor:"#DDD", borderRadius:10, overflow:"hidden"}}>
            <View>
                <View style={[styles.row, {marginTop:0, marginBottom:-0.1}]}>
                    {
                        header.map((label, idx)=>{
                            return <NameBox key={idx} text={label} fontSize={14} backgroundColor={"#999"} sep={(header.length != idx+1)?<Sep/>:null}/>
                        })
                    }
                </View>
            </View>
            <Sep />
            {
                (contents.length > 0)?
                <>
                    {
                        contents.map((el, idx)=>{
                            return <PayLine key={idx} item={el} onNameTap={onNameTap} onIncentiveTap={onIncentiveTap} underLine={contents.length > idx + 1}/>
                        })
                    }
                    
                    
                </>
                :
                <View style={{alignItems:"center", borderWidth:0, margin:1, padding:3}}>
                    <Text style={table.contentText}>데이터가 없습니다.</Text>
                </View>
            }
        </ScrollView>
    )
};

export function TotalContainer({contents}) {
    return(
        <View>
            <View style={[styles.row, {borderRadius:5, overflow:"hidden"}]}>
                {
                    contents.map((label, idx)=>{
                        const fontSize = 13;
                        if(Array.isArray(label)){
                            return <NameBox2 key={idx} list={label} alignItems={"flex-end"} fontSize={fontSize} backgroundColor='#333' paddingVertical={17} sep={<Sep style={{borderColor:"#555"}}/>}/>
                        }else{
                            const s = (label == "합계")?"center":"flex-end"
                            return <NameBox key={idx} text={label} alignItems={s}  fontSize={fontSize} backgroundColor='#333' paddingVertical={17} sep={<Sep style={{borderColor:"#555"}}/>}/>
                        }
                    })
                }
            </View>
        </View>
    )
};

const NameBox = ({text, alignItems = "center", fontSize=11, backgroundColor="#EBF3E8", paddingVertical=5, sep = null}) => {
    return (
        <>
        <View style={[styles.box, {alignItems:alignItems, paddingVertical:paddingVertical, paddingHorizontal:5, backgroundColor:backgroundColor, }]}>
            <Text style={[fonts.main, {fontSize:fontSize}]}>{text}</Text>
        </View>
        {
            (sep)?sep:null
        
        }
        </>
    )
}
const NameBox2 = ({list, alignItems = "center", fontSize=11, backgroundColor="#EBF3E8", paddingVertical=5, sep = null}) => {
    return (
        <>
        <View style={[styles.box, {alignItems:alignItems, paddingVertical:paddingVertical, paddingHorizontal:5, backgroundColor:backgroundColor}]}>
            <Text style={[fonts.main, {fontSize:fontSize}]}>{list[0]}</Text>
            <Text style={[fonts.subContnet, {fontSize:fontSize,}]}>{list[1]}</Text>
        </View>
        {
            (sep)?sep:null
        
        }
        </>
    )
}

const PayLine = ({item, onNameTap, onIncentiveTap, underLine=false}) => {
    const [isEdit, setEdit] = useState(false);
    const jobType = item.JOBTYPE
    const wage = (jobType == "H")?item.jobWage:item.BASICWAGE;
    return(
        <>
        <View style={[styles.row, {justifyContent:"space-between", height:40, marginTop:-0.3}]}>
            <ContentBox text={item.userNa} onTap={()=>onNameTap(item)}/>
            <Sep />
            <ContentBox text={(jobType == "H")?"시급":"월급"} />
            <Sep />
            <ContentBox text={wage}  subText={item.jobDure} alignItems='flex-end'/>
            <Sep />
            <ContentBox text={(jobType == "H")?item.weekWage:item.MEALALLOWANCE} subText={(jobType == "H")?item.weekWageNa:""}  alignItems='flex-end' />
            <Sep />
            {/*
                (isEdit)?
                <>
                    <EidtNumberBox text={item.incentive.toLocaleString()} onTap={(value)=>{onIncentiveTap({value, userId:item.userId});setEdit(false);}} />
                    <Sep />
                </>
                :
                <>
                    <ContentBox text={item.incentive.toLocaleString()} onTap={()=>setEdit(true)}  alignItems='flex-end' />
                    <Sep />
                </>
            */}
            <ContentBox text={(jobType == "H")?item.salary:(wage+item.MEALALLOWANCE)}  alignItems='flex-end'/>
        </View>
        {(underLine)?<Sep />:null}
        </>
    )
}

const EidtNumberBox = ({ initvalue="0", onTap, alignItems = "center", hasBox=true}) => {
    const ref = useRef();
    const [value, setValue] = useState(initvalue.replace(/,/g, ''))
    const onSave = () => {
        if (value == "" || (!isNaN(value) && value >= 0 && value == parseInt(value, 10))) {
            onTap(value);
        }else{
            alert("잘못된 값을 입력하셨습니다.")
            ref.current.focus();
        }
    }
    const inputStyle = {borderRadius:4, borderColor:"rgba(221, 221, 221, 1.0)", marginRight:3, padding:2}
    return(
        (hasBox)?
            <TouchableOpacity activeOpacity={(onTap)?0.2:1} style={[styles.box, {alignItems:alignItems, paddingHorizontal:5, flexDirection:"row"}]} onPress={onTap}>
                <TextInput autoFocus={true} style={[styles.input, inputStyle, {flex:1}]} ref={ref} value={value} keyboardType='number-pad' onChange={(e)=>setValue(e.nativeEvent.text)} 
                    onBlur={onSave}
                />
                <TouchableOpacity style={{ justifyContent:"center"}} onPress={onSave}>
                    <FontAwesome5 name="check-circle" size={16} color="black" />
                </TouchableOpacity>
            </TouchableOpacity>
        :
            <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                <TextInput autoFocus={true} style={[styles.input, inputStyle, {width:"50%", borderRadius:10}]} ref={ref} value={value} keyboardType='number-pad' onChange={(e)=>setValue(e.nativeEvent.text)} 
                    onBlur={onSave}
                />
                <TouchableOpacity style={{borderWidth:1, justifyContent:"center", borderColor:"grey"}} onPress={onSave}>
                    <FontAwesome5 name="check" size={16} color="black" />
                </TouchableOpacity>
            </View>
    )
}
const ContentBox = ({text, subText, onTap, alignItems = "center", fontSize = 12}) => {
    return(
        <TouchableOpacity activeOpacity={(onTap)?0.2:1} style={[styles.box, {alignItems:alignItems, paddingHorizontal:5}]} onPress={onTap}>
            <Text style={[fonts.content, {fontSize:fontSize}]}>{text}</Text>
            {
                (subText)?
                    <Text style={[fonts.subContnet, {fontSize:fontSize}]}>{subText}</Text>
                :null
            }
        </TouchableOpacity>
    )
}

const Sep = ({style}) => {
    return <View style={[styles.sep, style]} />
}


const fonts = StyleSheet.create({
    main:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        fontWeight: "700",
        color: "#FFFFFF"
    },
    content:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        fontWeight: "700",
        color: "#333333"
    },
    subContnet:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        fontWeight: "700",
        color: "#3479EF"
    }
})
const table = StyleSheet.create({
    contentText:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        fontWeight: "700",
        color: "#333333"
    }
})
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
        marginHorizontal:-1,
        borderWidth:0,
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
        width:"100%",
        
    },
    card:{
        borderWidth: 1, // 테두리 두께
        borderColor: 'black', // 테두리 색상
        borderRadius: 10, // 테두리 모서리 둥글게 
        padding:5,
        width:"100%",
        marginBottom:15,
    },
    title:{
        fontSize:20
    },
    borderBox:{
        margin:0.5,
        paddingHorizontal:10,
        paddingVertical:1,
        alignItems:"center",
        borderWidth:1,
        borderColor:"grey",
        justifyContent:"center",
        
    },
    sep:{
        zIndex:5,
        borderRightWidth: 1,
        borderBottomWidth:1,
        borderColor: "rgba(221, 221, 221, 1.0)"
    }
});