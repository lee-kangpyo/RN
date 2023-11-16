import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Touchable, TouchableOpacity, Keyboard } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

export function ProfitLossPl({data, onChangeValue}){
    const main = data.filter((el)=>el.ORDBY % 100 == 0);

    const SubLine = ({items, text}) => {
        return(
            <View style={{flexDirection:"row"}}>
                <View style={[styles.borderBox]}>
                    <Text>{text}</Text>
                </View>
                <View style={{flex:1}}>
                {
                    items.map((el, idx)=>{
                        return(
                            <ProfitBox 
                                key={text+"_"+idx}
                                text={el.CONA} 
                                text2={el.AMT.toLocaleString()} 
                                style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:20}} 
                                onTap={(value)=>onChangeValue({plItCo:el.PLITCO, value:value})}
                            />
                        )
                    })
                }
                </View>
            </View>
        )
    }

    

    return (
        <View style={styles.card}>
            {
                main.map((item, idx)=>{
                    const subItems = data.filter(el => el.ORDBY > item.ORDBY && el.ORDBY < item.ORDBY + 100)

                    const editable = ["0200"]  
                    const onTap = (editable.indexOf(item.PLITCO) > -1)?(value)=>onChangeValue({plItCo:item.PLITCO, value:value}):null

                    return (
                        <>
                        <ProfitBox key={idx} text={item.CONA} text2={item.AMT.toLocaleString()} onTap={onTap}/>
                        {
                            (subItems.length > 0)?
                                <SubLine text={"매출"} items={subItems}/>
                            :
                                null
                        }
                        </>
                    )
                })
            }
        </View>
    )
}
export function ProfitLossAlbaList({data}){
    const total = data.reduce((result, next)=>{
        return result + next.salary;
    }, 0)
    return (
        <View style={[styles.card, {paddingVertical:0, height:"50%"}]}>
            <ScrollView >
                {
                    data.map((el, idx)=>{
                        return (
                            <ProfitBox key={idx} text={el.userNa} text2={el.salary.toLocaleString()} />
                        )
                    })
                }
            </ScrollView>
            <View style={{flexDirection:"row", justifyContent:"space-between", padding:5, borderTopWidth:1, borderTopColor:"grey"}}>
                <Text style={{fontSize:16}}>총합계</Text>
                <Text style={{fontSize:16}}>{total.toLocaleString()}</Text>
            </View>
        </View>
    )
}
function ProfitBox({style={}, onTap, text, text2}){
    const [isText, setIsText] = useState(true);
    return(
        (onTap)?
        <TouchableOpacity onPress={()=>setIsText(false)} style={[styles.borderBox, {flexDirection:"row", justifyContent:"space-between"}, style]}>
            <Text>{text}</Text>
            {
                (isText)?
                    <Text>{text2}</Text>
                :
                    <View style={{width:"50%"}}>
                    <EidtNumberBox 
                        onTap={(value)=>{onTap(value);setIsText(true);}}
                        hasBox={false}
                    />
                    </View>
            }
            
        </TouchableOpacity>
        :
        <View style={[styles.borderBox, {flexDirection:"row", justifyContent:"space-between"}, style]}>
            <Text>{text}</Text>
            <Text>{text2}</Text>
        </View>
    )
}

export function PayDetailContainer({header, contents, ondeataTap}){
    return(
        <View>
            <View style={styles.row}>
                {
                    header.map((label, idx)=>{
                        return <NameBox key={idx} text={label} fontSize={14}/>
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
    const spcWage = (item.spcWage > 0)?item.spcWage.toLocaleString():"0";
    return(
        <View style={[styles.row, {justifyContent:"space-between"}]}>
            <ContentBox text={item.week1+"주"} fontSize={14}/>
            <ContentBox text={item.jobWage.toLocaleString()} subText={item.jobDure} alignItems='flex-end'/>
            <ContentBox text={item.weekWage.toLocaleString()} alignItems='flex-end'/>
            <ContentBox text={item.incentive.toLocaleString()} alignItems='flex-end'/>
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
            <ContentBox text={item.salary.toLocaleString()} subText={item.jobDure + item.spcDure} alignItems='flex-end'/>
        </View>
    )
}

export function PayContainer({header, contents, onNameTap, onIncentiveTap}) {
    return(
        <ScrollView stickyHeaderIndices={[0]}>
            <View>
                <View style={styles.row}>
                    {
                        header.map((label, idx)=>{
                            return <NameBox key={idx} text={label} fontSize={14}/>
                        })
                    }
                </View>
            </View>
                {
                    (contents.length > 0)?
                    <>
                        {
                            contents.map((el, idx)=>{
                                return <PayLine key={idx} item={el} onNameTap={onNameTap} onIncentiveTap={onIncentiveTap} />
                            })
                        }
                    </>
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
                        const fontSize = (label == "합계")?16:11;
                        if(Array.isArray(label)){
                            return <NameBox2  key={idx} list={label} alignItems={"flex-end"} fontSize={fontSize}/>
                        }else{
                            const s = (label == "합계")?"center":"flex-end"
                            return <NameBox key={idx} text={label} alignItems={s}  fontSize={fontSize}/>
                        }
                        
                    })
                }
            </View>
        </View>
    )
};

const NameBox = ({text, alignItems = "center", fontSize=11, backgroundColor="#EBF3E8"}) => {
    return (
        <View style={[styles.box, {alignItems:alignItems, paddingHorizontal:5, backgroundColor:backgroundColor}]}>
            <Text style={{fontSize:fontSize}}>{text}</Text>
        </View>
    )
}
const NameBox2 = ({list, alignItems = "center", fontSize=11, backgroundColor="#EBF3E8"}) => {
    return (
        <View style={[styles.box, {alignItems:alignItems, paddingHorizontal:5, backgroundColor:backgroundColor}]}>
            <Text style={{fontSize:fontSize}}>{list[0]}</Text>
            <Text style={{fontSize:fontSize}}>{list[1]}</Text>
        </View>
    )
}

const PayLine = ({item, onNameTap, onIncentiveTap}) => {
    const [isEdit, setEdit] = useState(false);
    return(
        <View style={[styles.row, {justifyContent:"space-between", height:40}]}>
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

const EidtNumberBox = ({ initvalue=0, onTap, alignItems = "center", hasBox=true}) => {
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
        (hasBox)?
            <TouchableOpacity activeOpacity={(onTap)?0.2:1} style={[styles.box, {alignItems:alignItems, paddingHorizontal:5}]} onPress={onTap}>
                <TextInput autoFocus={true} style={styles.input} ref={ref} value={value} keyboardType='number-pad' onChange={(e)=>setValue(e.nativeEvent.text)} 
                    onBlur={onSave}
                />
            </TouchableOpacity>
        :
            <TextInput autoFocus={true} style={styles.input} ref={ref} value={value} keyboardType='number-pad' onChange={(e)=>setValue(e.nativeEvent.text)} 
                onBlur={onSave}
            />
    )
}
const ContentBox = ({text, subText, onTap, alignItems = "center", fontSize = 12}) => {
    return(
        <TouchableOpacity activeOpacity={(onTap)?0.2:1} style={[styles.box, {alignItems:alignItems, paddingHorizontal:5}]} onPress={onTap}>
            <Text style={{fontSize:fontSize}}>{text}</Text>
            {
                (subText)?
                    <Text style={{fontSize:fontSize}}>{subText}</Text>
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
        
    }
});