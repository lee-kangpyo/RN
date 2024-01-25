import { StyleSheet, TouchableOpacity, Text, TextInput, View } from 'react-native';
import { URL } from "@env";
import { useState } from 'react';
import axios from 'axios';
export default function AxiosTest() {
    const [url1, setUrl1] = useState("");
    const [data, setData] = useState("");
    const [errormsg, setError] = useState("");
    const [errorDetail, setErrorDetail] = useState("");
    const [url2, setUrl2] = useState("");
    const onTest = async () => {
        setData("");
        setError("");
        alert(URL + url1);
        await axios.post(URL + url1, {}, {timeout:5000})
        .then( function  (response) {
            setData(response.data.result)
        }).catch(function (error) {
            console.log("%%%%%%")
            setError(error.name + " " + error.message)
        });    
    
        
    }
    const onTest2 = async () => {
        setData("");
        setError("");
        alert(url2);
        await axios.post(url2, {}, {timeout:5000})
        .then( function  (response) {
            setData(response.data.result)
        }).catch(function (error) {
            setErrorDetail(JSON.stringify(error.toJSON()))
            setError(error.name + " " + error.message)
            
        });    
        
    }
    return (
    <View style={styles.container}>
        <Text>{URL} 사용</Text>
        <View style={styles.row}>
            <View style={[styles.box, {width:"50%"}]}>
                <TextInput value={url1} onChangeText={(text)=>setUrl1(text)}/>
            </View>
            <TouchableOpacity onPress={onTest} style={styles.box}>
                <Text>테스트</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.row}>
            <View style={[styles.box, {width:"50%"}]}>
                <TextInput value={url2} onChangeText={(text)=>setUrl2(text)}/>
            </View>
            <TouchableOpacity onPress={onTest2} style={styles.box}>
                <Text>테스트2</Text>
            </TouchableOpacity>
        </View>

        <View>
            <Text>{data}</Text>
        </View>
        <View>
            <Text>{errormsg}</Text>
        </View>
        <TouchableOpacity onPress={()=>alert(errorDetail)}>
            <Text>에러상세</Text>
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    container:{margin:10, width:"100%", justifyContent:"center"},
    box:{borderWidth:1,},
    row:{flexDirection:"row"}
});
  