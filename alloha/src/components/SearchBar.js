import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import CustomBtn from './CustomBtn';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SearchBar = ({ searchText, onSearch, onButtonPress, iconName, iconColor="black", placeHolder="Search...", secondIconName, onSecondButtonPress}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeHolder}
        value={searchText}
        onChangeText={onSearch}
      />
      <View style={styles.sep} />
      {
        (secondIconName && onSecondButtonPress)?
          <TouchableOpacity onPress={onSecondButtonPress} style={{marginRight:10}}>
            <MaterialCommunityIcons name={secondIconName} size={35} color={iconColor} />
          </TouchableOpacity>
        :
          null
      }
      <TouchableOpacity onPress={onButtonPress}>
        <MaterialCommunityIcons name={iconName} size={35} color={iconColor} />
      </TouchableOpacity>
      
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    // borderWidth: 1,
    // borderRadius: 24,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(221, 221, 221, 1.0)"
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
  },
  sep:{
    borderColor:"#DDD",
    borderWidth:0.5,
    marginRight:15,
  }
};

export default SearchBar;