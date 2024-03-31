
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProgressBar({progress, marginBottom}) {
    const width = progress * 100;
    return(
    <View style={[styles.container, {marginBottom:marginBottom}]}>
        <View style={styles.progressContainer} >
            <LinearGradient colors={["#43ABFC", "#3479EF"]} style={[styles.progress, {width:`${width}%`}]} start={{x:0, y:0.5}} end={{x:1, y:0.5}}/>
        </View>
    </View>
    )
}


const styles = StyleSheet.create({
    container: {
        height:16,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        paddingVertical: 8,
        borderRadius:15
      },
    progressContainer: {
        position: "relative",
        height: 16
      },
    progress: {
        height: 16,
        borderRadius: 15
      },
    
});