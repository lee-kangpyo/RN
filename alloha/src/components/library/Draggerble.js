import { kebabCase } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {View, StyleSheet, PanResponder, Animated,Text} from 'react-native';

const DragAndDropCard = ({ heading, paragraph, user, pos, setTrace, hide, setHide }) => {
    const position = useRef(new Animated.ValueXY(pos)).current;
    const [dragging, setDragging] = useState(false);

    // Create a pan responder to handle touch events
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                // 이전 드래그가 종료된 이후 위치를 오프셋으로 설정 (누적된 값 반영)
                position.extractOffset();
                setDragging(true);
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    {
                        dx: position.x,
                        dy: position.y,
                    },
                ],
                { 
                    useNativeDriver: false,
                    listener: (event, gestureState) => {
                        // 드래그 중에 currentPos를 업데이트
                        const { dx, dy, moveX, moveY } = gestureState;
                        // console.log(moveX, moveY)
                        // 상태 변경을 조건부로 진행
                        setTrace((prev) => {
                            // 변화량 기준으로 업데이트
                            if (Math.abs(moveX - prev.x) > 30 || Math.abs(moveY - prev.y) > 30) {
                                return { x: moveX, y: moveY };
                            }

                            return prev; // 변화가 없으면 이전 상태를 반환
                        });
                    },
 

                }
            ),
            onPanResponderRelease: () => {
                setDragging(false);
                 // 드래그가 끝난 후의 위치를 오프셋으로 설정해 누적
                // position.flattenOffset();
                setHide(false);
            },
        })
    ).current;
    return (
        <Animated.View
            style={[
                styles.card,
                {
                    transform: [
                        { translateX: position.x },
                        { translateY: position.y },
                    ],
                    opacity: dragging ? 0.8 : 1,
                },
            ]}
            {...panResponder.panHandlers}
        >
            <Text style={styles.heading}>{user.userNa}</Text>
            <Text style={styles.paragraph}>{user.sTime} ~ {user.eTime}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    cardContainer: {
        marginTop: 20,
    },
    card: {
        width:150,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 5,
    },
    heading: {
        fontSize: 16,
        fontFamily:"Suit-Bold",
    },
    paragraph: {
        fontSize: 13,
        fontFamily:"Suit-SemiBold",
    },
});

export default DragAndDropCard;