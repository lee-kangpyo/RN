import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './color';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons'; 

const STORAGE_KEY = "@toDos";
const TAP_KEY = "@tap";

export default function App() {
  const [tap, setTap] = useState(1);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({})
  const travel = async () => {
    setTap(2)
    await AsyncStorage.setItem(TAP_KEY, "2");
  };
  const work = async () => {
    setTap(1)
    await AsyncStorage.setItem(TAP_KEY, "1");
  };
  const onChangeText = (payLoad) => setText(payLoad);
  const saveToDos = async (todos) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s) setToDos(JSON.parse(s));
  }
  const loadTap = async () => {
    const s = await AsyncStorage.getItem(TAP_KEY);
    if (s) setTap(Number(s));
  }

  useEffect(() => {
    loadToDos();
    loadTap();
  }, []);
  const addToDo = async () => {
    if(text === "") return;
    //const newToDos = Object.assign({}, toDos, {[Date.now()]:{text, sep:tap}}) 2가지 방식이있음.
    const newToDos = {...toDos, [Date.now()]:{text, sep:tap}};
    console.log(newToDos)
    await saveToDos(newToDos)
    setToDos(newToDos);
    setText("");
  }
  const deleteTodo = async (key) => {
    Alert.alert(
        "삭제", 
        "제거 하시겠습니까?",
        [
          {text:"취소"},
          {text:"확인", onPress: async () => {
            const newToDos = {...toDos}
            delete newToDos[key]
            await saveToDos(newToDos)
            setToDos(newToDos);
          }}
        ]
      )
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color:(tap === 1)?"white":theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color:(tap === 2)?"white":theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput 
        value={text}
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        placeholder={(tap === 1)?"할 일을 추가하세요":"어디에 가고 싶습니까?"} 
        returnKeyType='done'
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key, idx) => 
          (toDos[key].sep === tap)?
            <View key={idx} style={styles.toDo}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" size={16} color="red" />
              </TouchableOpacity>
            </View>
          :
            null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    flexDirection: "row",
    justifyContent:'space-between',
    marginTop: 100,
  },
  btnText:{
    color:"white",
    fontWeight: 600,
    fontSize: 35,
  },
  input:{
    backgroundColor:"white",
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius:30,
    marginTop:20,
    fontSize:16,
    marginBottom:20
  },
  toDo:{
    backgroundColor:theme.grey,
    marginBottom: 10,
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius: 15,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  toDoText:{
    color:"white",
    fontSize:16,
    fontWeight:"500"
  },  
});
