import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Touchable, TouchableOpacity } from 'react-native';

export function PayDetailContainer({header, contents,}){
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
                                return <PayDetailLine key={idx} item={el} />
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


const PayDetailLine = ({item}) => {
    console.log(item)
    return(
        <View style={[styles.row, {justifyContent:"space-between"}]}>
            <ContentBox text={item.week1+"주"}/>
            <ContentBox text={item.jobDure} subText={item.jobWage.toLocaleString()}/>
            <ContentBox text={item.spcDure}/>
            <ContentBox text={"-"} subText={item.weekWage}/>
            <ContentBox text={item.jobDure + item.spcDure} subText={item.salary}/>
            
        </View>
    )
}

export function PayContainer({header, contents, onNameTap, onIncentiveTap}) {
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
                                return <PayLine key={idx} item={el} onNameTap={onNameTap} onIncentiveTap={onIncentiveTap} />
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
    return(
        <View style={[styles.row, {justifyContent:"space-between"}]}>
            <ContentBox text={item.userNa} onTap={()=>onNameTap(item)}/>
            <ContentBox text={item.jobWage.toLocaleString()} />
            <ContentBox text={item.weekWage.toLocaleString()} subText={item.weekWageNa} />
            <ContentBox text={item.incentive.toLocaleString()} onTap={()=>onIncentiveTap(item)} />
            <ContentBox text={item.salary.toLocaleString()} />
        </View>
    )
}

const ContentBox = ({text, subText, onTap}) => {
    return(
        <TouchableOpacity activeOpacity={(onTap)?0.2:1} style={styles.box} onPress={onTap}>
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
    }
});