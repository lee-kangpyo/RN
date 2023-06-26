import React, { Component } from 'react';
import Postcode from '@actbase/react-daum-postcode';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function SearchAddress({navigation, route}){
    const url = useSelector((state) => state.config.url);
    const getAddressData = async (data) => {
        let defaultAddress='';
        let zoneCode = "";
        let result = {}
        if(data.buildingName==='')
        {
            defaultAddress='';
        }
        else if(data.buildingName==='N')
        {
            defaultAddress="("+data.apartment+")";
        }
        else{
            defaultAddress="("+data.buildingName+")";
        }
        const address = {address:data.address, zoneCode:data.zonecode}

        const params = Object.entries(address).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");

        await axios.get(url+`/api/v1/getLatLon`, params)
          .then(function (response) {
               result = {...response.data}
          }).catch(function (error) {
               console.log(error)
          });
        route.params.setAdress({...result, address:data.address, zoneCode:data.zonecode})
        navigation.goBack();
    }

    return (
        <Postcode
            style={{ width: '100%', height: '100%' }}
            jsOptions={{ animation: true }}
            onSelected={(data)=>getAddressData(data)}
        />
    )
}
