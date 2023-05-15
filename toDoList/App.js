import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from './color';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.btnText}>Work</Text>
        <Text style={styles.btnText}>Travel</Text>
      </View>
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
  }

});
