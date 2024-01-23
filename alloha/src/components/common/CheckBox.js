import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Checkbox = ({ label, style, isChecked, setChecked }) => {
  //const [isChecked, setChecked] = useState(false);

  const toggleCheckbox = () => {
    setChecked((prev) => !prev);
  };
  
  return (
    <TouchableOpacity activeOpacity={1}  onPress={toggleCheckbox} style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {isChecked ? (
          <FontAwesome name="check-circle" size={24} color="orange" />
        ) : (
          <FontAwesome name="circle-thin" size={24} color="black" />
        )}
        <Text style={{ marginLeft: 8 }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Checkbox;
