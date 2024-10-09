import { kebabCase } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {View, StyleSheet, PanResponder, Animated, Text} from 'react-native';
// import { GestureDetector, Gesture,  GestureHandlerRootView } from 'react-native-gesture-handler';
//import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// const DragAndDropCard_new = ({ user, pos, setTrace, hide, setHide }) => {
//     const translateX = useSharedValue(0);
//     const translateY = useSharedValue(0);

//     const panGesture = Gesture.Pan()
//     .activateAfterLongPress(1000)
//     .onStart(() => {
//         console.log("드래그 가능");
//     })
//     .onUpdate((event) => {
//         console.log("onUpdate")
//         translateX.value = event.translationX; // 드래그 위치 업데이트
//         translateY.value = event.translationY;
//     })
//     .onChange(()=>console.log("위치 변경"))
//     .onTouchesUp(() => {  // onTouchesEnd를 onTouchesUp으로 변경
//       // 드래그 종료 시 처리
//       console.log("드래그 종료")
//       //isLongPressed.value = false; // 롱프레스 종료
//       translateX.value = 0; // 드래그 종료 시 원래 위치로 되돌리기
//       translateY.value = 0;
//     }).onEnd(()=>{
//         console.log("드래그 불가")
//     })
//     .runOnJS(true);
    
//     const animatedStyle = useAnimatedStyle(() => {
//         console.log(translateX)    
//         return {
//             transform: [
//                 { translateX: translateX.value },
//                 { translateY: translateY.value },
//             ],
//         }
//     });

//     return (
//         <GestureHandlerRootView style={styles2.container}>
//             <GestureDetector gesture={panGesture}>
//                 <Animated.View style={[styles.card, animatedStyle]}>
//                     <Text style={styles.heading}>{user.userNa}</Text>
//                     <Text style={styles.paragraph}>{user.sTime} ~ {user.eTime}</Text>
//                 </Animated.View>
//             </GestureDetector>
//         </GestureHandlerRootView>
//     );
// };


const styles2 = StyleSheet.create({
    container: {
      position:"absolute",
      zIndex:10,
      backgroundColor:"red",
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    box: {
      width: 100,
      height: 100,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
  });

const DragAndDropCard = ({ user, pos, setTrace, setHide}) => {
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
                        // 상태 변경을 조건부로 진행
                        setTrace((prev) => {
                            // 변화량 기준으로 업데이트
                            if (Math.abs(moveX - prev.x) > 25 || Math.abs(moveY - prev.y) > 25) {
                                return { x: moveX, y: moveY };
                            }

                            return prev; // 변화가 없으면 이전 상태를 반환
                        });
                    },
                }
            ),
            onPanResponderRelease: () => {
                setDragging(false);
                setHide(false);
                 // 드래그가 끝난 후의 위치를 오프셋으로 설정해 누적
                // position.flattenOffset();
                
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