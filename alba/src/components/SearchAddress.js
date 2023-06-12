import React, { Component } from 'react';
import Postcode from '@actbase/react-daum-postcode';

export default function SearchAddress({navigation, setAdress}){
    const getAddressData = (data) => {
        let defaultAddress='';
        let zoneCode = "";
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
        setAdress({address:data.address, zoneCode:data.zoneCode})
        navigation.goBack();
        //this.props.navigation.navigate('Drawers',{screen:'Deliver', params:{zonecode:data.zonecode, address:data.address, defaultAddress:defaultAddress}});
    }
    return (
        <Postcode
            style={{ width: '100%', height: '100%' }}
            jsOptions={{ animation: true }}
            onSelected={(data)=>getAddressData(data)}
        />
    )
}
