import { StatusBar } from 'expo-status-bar';
import { Text, ScrollView } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { URL } from "@env";

export default function TermsDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const termId = route.params?.termId;
    const [contents, setContents] = useState("");

    useEffect(()=>{
        (async () => {
            await axios.get(URL+"/api/v1/getTermsDetail", {params:{termId:termId}})
            .then((res)=>{
                setContents(res.data.result[0].CONTS)
                navigation.setOptions({
                    title: res.data.result[0].TITLE,
                });
            })
            .catch((err)=>{console.log(err)});
        })();
        
    }, [])
    return(
        <ScrollView>
            <Text>{contents}</Text>
        </ScrollView>
    );
}