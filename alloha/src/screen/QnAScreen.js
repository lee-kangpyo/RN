
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import React, {useState, useEffect} from 'react';
import sampleImage from '../../assets/community.png';
import { HTTP } from '../util/http';
import { useSelector } from 'react-redux';
import { TouchableOpacity, Keyboard  } from 'react-native';
import { AntDesign, FontAwesome  } from '@expo/vector-icons'; 
import { useRef } from 'react';

export default function QnAScreen({navigation}) {
    const scrollViewRef = useRef();
    const userId = useSelector((state) => state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const [chatList, setChatList] = useState([]);
    const [textInput, setTextInput] = useState("");
    const [isSend, setIsSend] = useState(false);

    useEffect(()=>{
        navigation.setOptions({title:"질문"})
    }, [navigation])
    
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>{
            scrollViewRef.current.scrollToEnd({ animated: false })
        });
        return () => keyboardDidShowListener.remove();;
    },);

    const getChatList = () => {
        const params = {cstCo:cstCo}
        QnACall("GET", params, (data)=>{
            setChatList(data.result);
            scrollViewRef.current.scrollToEnd({ animated: true });
        })
    }

    const saveChat = (contents) => {
        const params = {cstCo:cstCo, userId:userId, contents:contents}
        QnACall("POST", params, (data)=>{
            getChatList();
        })
    }

    useEffect(()=>{
        getChatList();
    }, [])

    const onSend = () =>{
        const txt = textInput;
        setTextInput("");
        saveChat(txt);
    }
    const QnACall = async (method, params, callback) => {
        await HTTP(method, "/api/v1/board/QnA", params)
        .then((res)=>{
            console.log("")
            if(res.data.resultCode == "00"){
                callback(res.data)
            }
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    };
    const onChangeInput = (event) => {
        const contents = event.nativeEvent.text;
        setTextInput(contents);
        const isSend = (contents == "")?false:true
        setIsSend(isSend);
    }
    return (
        <View style={styles.container}>
                {
                    (chatList.length == 0)?
                        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.centerContainer}><Text>알로하와 대화를 시작해보세요!!</Text></ScrollView>
                    :
                    <ScrollView 
                        ref={scrollViewRef}
                        style={styles.mainContainer} 
                        contentContainerStyle={{justifyContent:"flex-end"}}
                        onContentSizeChange={() => {
                            scrollViewRef.current.scrollToEnd({ animated: true });
                        }}
                    >
                        {
                            chatList.map((el, idx)=>{
                                return <ChatEl key={idx} contents={el.REPCONTENTS} isMyInputData={(el.WOWNER == userId)} />
                            })
                        }
                    </ScrollView>
                }
            <View style={styles.bottomInputContainer}>
                <TextInput 
                    style={styles.input} 
                    value={textInput} 
                    onChange={onChangeInput}
                    placeholder={"상담 할 내용을 입력해 주세요."}
                    multiline={true}
                />
                {
                    (isSend)?
                        <TouchableOpacity onPress={onSend} style={{marginRight:15}}>
                            <FontAwesome name="send-o" size={24} color="black" />
                        </TouchableOpacity>
                    :
                        null
                }
            </View>
        </View>
    );
}

const ChatEl = ({isMyInputData, contents})=>{
    const align = (isMyInputData)?"flex-end":"flex-start";
    const backColor = (isMyInputData)?"#0D82FE":"#E9E9EB";
    const color = (isMyInputData)?"white":"black";
    return(
        <View style={{alignItems:align}}>
            <View style={[styles.chatBox, {backgroundColor:backColor}]}>
                <Text style={{color:color}}>{contents}</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'space-between', alignItems: 'center'},
    centerContainer:{flex:1, justifyContent:"center"},
    mainContainer:{flexGrow: 1, width:"100%"},
    bottomInputContainer:{
        borderWidth:0, 
        borderColor:"grey", 
        width:"100%", 
        padding:10, 
        flexDirection:"row", 
        alignItems:"space-between",
        backgroundColor:"white",
        justifyContent:"space-between",
    },
    input:{fontSize: 16, flex:1},
    chatBox:{borderWidth:1, borderRadius:5, padding:10, marginBottom:8, marginHorizontal:10, maxWidth:"80%"}
});