import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Platform, Image, ScrollView } from "react-native";
import TapContainer from "../components/common/TapContainer";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { HTTP } from './../util/http';
import Message, { CONFIRM_POSITION, Confirm } from './../components/common/Message';
import { useSelector } from 'react-redux';
import { convertTime } from "../util/moment";

export default function QuestionScreen () {
    const userId = useSelector((state)=>state.login.userId);
    const [tapNum, setTapNum] = useState(0);
    return (
        <>
            <TapContainer data={["문의하기", "문의내역확인"]} onTap={(idx)=>{setTapNum(idx)}}/>
            <View style={styles.container}>
                {
                    (tapNum == 0)?<Question userId={userId} />
                    :(tapNum == 1)?<QuestionView userId={userId} />
                    :null
                }
            </View>
        </>
    )
}

// 문의하기
const Question = ({userId}) => {
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const question = async () => {
        if(title.length > 0 && content.length > 0){
            Confirm("문의하기", "입력하신 내용을 전달 하시겠습니까?", {confirmPosOrder:CONFIRM_POSITION.RIGHT ,confirm:async ()=>{
                await HTTP("POST", "/qna/v1/question", {title, content, userId})
                .then((res)=>{
                    if(res.data.resultCode == "00"){
                        setTitle("");
                        setContent("");
                        Message("성공", "문의하기 요청이 완료되었습니다.");
                    }else{
                        Message("오류 발생", "문의하기 요청중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
                    }
                    
                }).catch(function (error) {
                    console.log(error);
                    alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
                })
            }})
        }else{
            Message("", "제목과 문의내용을 입력해주세요");
        }
    }
    return (
        <KeyboardAwareScrollView style={{paddingHorizontal:16, paddingTop:16}} contentContainerStyle={{flexGrow:1}} >
            <Text style={fonts.title}>제목</Text>
            <TouchableOpacity activeOpacity={1} onPress={()=>titleRef.current.focus()} style={styles.textBox}>
                <TextInput ref={titleRef} placeholder="제목을 입력 해주세요." value={title} onChange={(e)=>setTitle(e.nativeEvent.text)}/>
            </TouchableOpacity>
            <Text style={fonts.title}>문의내용</Text>
            <TouchableOpacity activeOpacity={1} onPress={()=> contentRef.current.focus()} style={[styles.textBox, {flex:1, minHeight:250}]}>
                <TextInput multiline ={true} ref={contentRef} placeholder="문의할 내용을 입력해 주세요" value={content} onChange={(e)=>setContent(e.nativeEvent.text)}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> question()} style={styles.sendBtn}>
                <Text style={fonts.sendBtnText}>문의 하기</Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    )
}

// 문의내역확인
const QuestionView = ({userId}) => {
    const [questionNo, setQuestionNo] = useState(0);
    return (
        <>
        {
            (questionNo == 0)?
                <QuestionList userId={userId} setQuestionNo={setQuestionNo}/>
            :
                <QuestionDetail userId={userId} questionNo={questionNo} setQuestionNo={setQuestionNo}/>
        }
        </>
        
    )
}

// 문의 내역 리스트
const QuestionList = ({userId, setQuestionNo}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questionList, setQuestionList] = useState([]);
    const getQuestionList = async () => {
        await HTTP("GET", "/qna/v1/question", {userId})
        .then((res)=>{
            setQuestionList(res.data.questionList);
            setIsLoading(false);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    useEffect(()=>{
        getQuestionList();
    }, [])
    return (
        <>
        {
            (isLoading)?
                <View style={questionView.center}>
                    <ActivityIndicator />
                </View>
            :
                <ScrollView contentContainerStyle={{padding:16}}>
                    {
                        (questionList.length > 0)?
                            questionList.map(el => {
                                const pillColor = (el.STAT == "Y")?"#3479EF":"#EEE";
                                const fontColor = (el.STAT == "Y")?"#FFF":"#999";
                                const text = (el.STAT == "Y")?"답변완료":"문의등록";
                                return(
                                    <TouchableOpacity style={questionView.card} onPress={()=>{setQuestionNo(el.QUESTIONNO)}}>
                                        <View style={{flex:1}}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={fonts.questionList_title}>{el.TITLE}</Text>
                                            <Text style={fonts.questionList_date}>작성일 : {convertTime(el.IYMDHMD)}</Text>
                                        </View>
                                        <View style={[questionView.pill, {backgroundColor:pillColor}]}>
                                            <Text style={[fonts.questionList_date, {color:fontColor}]}>{text}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        :
                            <View style={questionView.center}>
                                <Text>문의 내역이 없습니다.</Text>
                            </View>
                    }
                </ScrollView>
        }
        </>
    )
}

// 문의 내역 상세보기
const QuestionDetail = ({userId, questionNo, setQuestionNo}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [question, setQuestion] = useState({});
    const [answer, setAnswer] = useState([]);
    const getQuestionDetail = async () => {
        await HTTP("GET", "/qna/v1/question/"+questionNo, {userId})
        .then((res)=>{
            setQuestion(res.data.result);
            setAnswer([res.data.answerList[0]]);
            setIsLoading(false);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    useEffect(()=>{
        getQuestionDetail();
    }, [])
    return(
        (isLoading)?
            <View style={questionView.center}>
                <ActivityIndicator />
            </View>
        :
            <View style={{flex:1}}>
                <View style={{padding:16}}>
                    <TouchableOpacity onPress={()=>setQuestionNo(0)} style={{flexDirection:"row", alignItems:"center", paddingVertical:8}}>
                        <Image source={require('../../assets/icons/goBack.png')} style={{width:13, height:22, marginRight:20}} />
                        <Text style={fonts.goBackText}>문의내역 리스트로 돌아가기</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.questionDetailCard, {marginBottom:16}]}>
                    <View style={[styles.questionDetailTitle, {marginBottom:8}]}>
                        <Text style={fonts.title}>{question.TITLE}</Text>
                        <Text style={fonts.questionList_date}>{convertTime(question.IYMDHMD)}</Text>
                    </View>
                    <Text style={fonts.content}>{question.CONTENT}</Text>
                </View>
                {
                    //(question.STAT == "R")?
                    (answer.length == 0)?
                        <Text style={fonts.noComment}>아직 답변이 등록되지 않았습니다.</Text>
                    :
                        answer.map(el => <Answer item={el} />)
                }
            </View>
    )
}

// 문의 내역 상세보기에 있는 답변 콤포넌트
const Answer = ({item}) => {
    console.log(item);
    return (
        <View style={[styles.questionDetailCard, {marginBottom:8}]}>
            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                <View style={{flexDirection:"row", alignItems:"baseline"}}>
                    <Text style={fonts.title}>{item.ANSWERNA}</Text>
                    <Text style={[fonts.questionList_date]}>의 답변입니다.</Text>
                </View>
                <Text style={fonts.questionList_date}>{convertTime(item.IYMDHMD)}</Text>
            </View>
            <Text style={fonts.content}>{item.CONTENT}</Text>
        </View>
    )
}

const fonts = StyleSheet.create({
    title:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#111111",
        marginBottom:10
    },
    sendBtnText:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#FFFFFF"
    },
    questionList_title:{
        marginBottom:8,
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#111111"
    },
    questionList_date:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#777777"
    },
    goBackText:{
        fontFamily: "SUIT-Bold",
        fontSize: 16,
        color: "#111111"
    },
    content:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        color: "#111111"
    },
    noComment:{
        fontFamily: "SUIT-Regular",
        fontSize: 15,
        color: "#999999"
    }
})

const questionView = StyleSheet.create({
    center:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    card:{
        flexDirection:"row", 
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:8,
        padding:16,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        ...Platform.select({
            ios:{
                shadowColor: "rgba(0, 0, 0, 0.05)",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 10,
                shadowOpacity: 1
            },
            android:{
                elevation:2,
            }
        })
    },
    pill:{
        paddingHorizontal:8,
        paddingVertical:4,
        borderRadius: 20,
        backgroundColor: "#EEEEEE"
    },
    linkArrow:{alignSelf:"center", width:10, height:14},
})

const styles = StyleSheet.create({
    container:{
        //paddingTop:16,
        //paddingHorizontal:16,
        flex:1,
        backgroundColor:"#f6f6f8",
    },
    textBox:{
        padding:15,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)",
        marginBottom:24,
    },
    sendBtn:{
        alignItems:"center",
        padding:16,
        borderRadius: 10,
        backgroundColor: "#3479EF",
        marginBottom:16,
    },
    questionDetailCard:{
        backgroundColor:"#fff",
        padding:16
    },
    questionDetailTitle:{
        flexDirection:"row",
        justifyContent:"space-between"
    },
    sep:{
        borderWidth:1,
        borderColor:"#999",
    }
})