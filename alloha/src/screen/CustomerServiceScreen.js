
import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { FontAwesome } from '@expo/vector-icons';

export default function CustomerServiceScreen({navigation}) {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        setMessages([
        {
            _id: 2,
            text: '안녕하세요 알로하입니다.',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'React Native',
            },
        },
        {
            _id: 0,
            text: '부적절하거나 불쾌감을 줄 수 있는 대화는 삼가 부탁드립니다. 회원제재를 받을 수 있습니다.',
            createdAt: new Date().getTime(),
            system: true,
          }
        ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
        )
    }, [])
    const renderSend = (props) => {
        return (
            <Send
                {...props}
            >
                <View style={{marginRight: 10, marginBottom: 5}}>
                    <FontAwesome name="send" size={24} color="black" />
                </View>
            </Send>
        );
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
                name: '이강표',
            }}
            placeholder='상담 내용을 입력해주세요'
            showUserAvatar={true}
            renderSend={renderSend}
        />
    )
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center'},
    sampleImage:{width:"100%", height:"100%"}
});