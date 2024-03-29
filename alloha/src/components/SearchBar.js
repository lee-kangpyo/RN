import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import CustomBtn from './CustomBtn';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SearchBar = ({ searchText, onSearch, onButtonPress, iconName, placeHolder="Search...", secondIconName, onSecondButtonPress}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeHolder}
        value={searchText}
        onChangeText={onSearch}
      />
      {
        (secondIconName && onSecondButtonPress)?
          <TouchableOpacity onPress={onSecondButtonPress} style={{marginRight:10}}>
            <MaterialCommunityIcons name={secondIconName} size={35} color="black" />
          </TouchableOpacity>
        :
          null
      }
      <TouchableOpacity onPress={onButtonPress}>
        <MaterialCommunityIcons name={iconName} size={35} color="black" />
      </TouchableOpacity>
      
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
  },
};

export default SearchBar;