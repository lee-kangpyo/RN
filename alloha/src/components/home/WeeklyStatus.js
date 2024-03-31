
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import ProgressBar from '../common/ProgressBar';
import emphasizeKeywords from './../common/emphasizeKeywords';
import TodayStatus from './TodayStatus';

export default function WeeklyStatus() {
    
    const ColoredWord = ({text, word, style, emphasizeStyle={color:"red"}}) => {
        return (
            text.includes(word) ? (
                <View style={{flexDirection:"row", alignItems:"baseline"}}>
                    <Text style={style}>{text.split(word)[0]}</Text>
                    <Text style={[style, emphasizeStyle]}>{word}</Text>
                    <Text style={style}>{text.split(word)[1]}</Text>
                </View>
            ):(
                <Text style={style}>{text}</Text>
            )
        );
        
    };
      
    return (
        <View style={styles.container}>
            <View style={[styles.row, styles.spaceBetween, {paddingBottom:23}]}>
                <Text style={font.mainFont}>주간 현황</Text>
                <Image source={require('../../../assets/icons/link-arrow.png')} style={styles.linkArrow} />
            </View>

            <View style={styles.todoCards}>
                <View style={[styles.todoCard, styles.row]}>
                    <ColoredWord text={"다음주 근무 계획을 입력하세요."} word={"근무 계획"} style={font.todo} emphasizeStyle={font.todoKey}/>
                    <Image source={require('../../../assets/icons/link-arrow.png')} style={[styles.linkArrow, {marginLeft:8}]} />
                </View>
                <View style={[styles.todoCard, styles.row]}>
                    <ColoredWord text={"3/14일자 데일리 리포트가 생성되었습니다."} word={"3/14"} style={font.todo} emphasizeStyle={font.todoKey}/>
                    <Image source={require('../../../assets/icons/link-arrow.png')} style={[styles.linkArrow, {marginLeft:8}]} />
                </View>
                <View style={[styles.todoCard, styles.row]}>
                    <View>
                        <ColoredWord text={"확인하지 않은 근무시간이 있습니다."} word={"근무시간"} style={font.todo} emphasizeStyle={font.todoKey}/>
                        <ColoredWord text={"근무 시간을 확인하세요."} style={font.todo}/>
                    </View>
                    <Image source={require('../../../assets/icons/link-arrow.png')} style={[styles.linkArrow, {marginLeft:8}]} />
                </View>
                <View style={[styles.todoCard, styles.row]}>
                    <View>
                        <ColoredWord text={"이번주는 급여확정 주간입니다."} word={"지난달 급여"} style={font.todo} emphasizeStyle={font.todoKey}/>
                        <ColoredWord text={"지난달 급여를 생성하세요."} word={"지난달 급여"} style={font.todo} emphasizeStyle={font.todoKey}/>
                    </View>
                    <Image source={require('../../../assets/icons/link-arrow.png')} style={[styles.linkArrow, {marginLeft:8}]} />
                </View>
            </View>

            <View style={{marginBottom:24}}>
                <ColoredWord text={"이번주 누적 근무시간은 38.5시간이고"} word={"38.5시간"} style={font.weeklySummary} emphasizeStyle={font.emphasizeColor}/>
                <ColoredWord text={"계획 달성률은 89.1%입니다."} word={"89.1%"} style={font.weeklySummary} emphasizeStyle={font.emphasizeColor}/>
            </View>
            <TodayStatus/>
        </View>
    );
}
const font = StyleSheet.create({
    mainFont:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 18,
        color: "#111111",
        fontWeight: "800",
    },
    todo:{
        fontFamily: "SUIT-Regular",
        fontSize: 14,
        color: "#333333",
        fontWeight: "600",
    },
    todoKey:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 14,
        color: "#333333",
        fontWeight: "600",
    },
    weeklySummary:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 18,
        fontWeight: "800",
    },
    emphasizeColor:{
        color:"#3479EF"
    }
    
    
})
const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        paddingVertical:25,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        marginBottom:7
    },
    todoCards:{
        marginBottom:40,
    },
    todoCard:{
        marginBottom:8,
        justifyContent:"space-between",
        paddingHorizontal:20,
        paddingVertical:13,
        borderRadius: 10,
        backgroundColor: "#F6F8FD",
        borderWidth: 1,
        borderColor: "rgba(227, 234, 246, 1.0)"
    },
    linkArrow:{alignSelf:"center", width:10, height:14},
    row:{flexDirection:"row"},
    spaceBetween:{justifyContent:"space-between"}
});