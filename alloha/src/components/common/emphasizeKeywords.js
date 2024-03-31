import React from 'react';
import { Text } from 'react-native';

const emphasizeText = (text) => {
  return <Text style={{ fontWeight: 'bold' }}>{text}</Text>;
};

const emphasizeKeywords = (text) => {
  const parts = text.split(/({[^{}]+})/);
  return parts.map((part, index) => {
    if (part.startsWith("{") && part.endsWith("}")) {
      return emphasizeText(part.substring(1, part.length - 1));
    }
    return part;
  });
};

export default emphasizeKeywords;
