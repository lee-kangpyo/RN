import axios from 'axios';
import { URL, TASK_URL } from "@env";
import { Alert } from 'react-native';



export const HTTP = async (method, url, params, timeout=10000) => {
    const axiosConfig = {
        timeout: timeout, // 타임아웃 설정
    };
    
    if (method === 'GET') {
        return await axios.get(URL+url, {params:params, ...axiosConfig})
                .catch(error => {
                    if (axios.isCancel(error)) {
                        // 요청이 취소된 경우
                        console.log('Request canceled:', error.message);
                    } else if (error.code === 'ECONNABORTED') {
                        // 타임아웃 에러인 경우
                        console.log('Request timeout:', error.message);
                        //Alert.alert("오류", "서버에서 응답이 지연되고 있습니다.\n잠시후 다시 시도해 주세요");
                        // 여기에서 얼럿을 띄우는 코드를 추가할 수 있습니다.
                    } else {
                        // 그 외의 에러 처리
                        console.error('Request error:', error.message);
                        //Alert.alert("오류", "요청 중 오류가 발생했습니다.\n잠시후 다시 시도해 주세요");
                    }
                    throw error; 
                });
    } else if (method === 'POST') {
        return await axios.post(URL+url, params, axiosConfig)
                .catch(error => {
                    if (axios.isCancel(error)) {
                        // 요청이 취소된 경우
                        console.log('Request canceled:', error.message);
                    } else if (error.code === 'ECONNABORTED') {
                        // 타임아웃 에러인 경우
                        console.log('Request timeout:', error.message);
                        // 여기에서 얼럿을 띄우는 코드를 추가할 수 있습니다.
                    } else {
                        // 그 외의 에러 처리
                        console.error('Request error:', error.message);
                        //Alert.alert("오류", "요청 중 알수 없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                    }
                    throw error; 
                    
                });
    } else {
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
}

