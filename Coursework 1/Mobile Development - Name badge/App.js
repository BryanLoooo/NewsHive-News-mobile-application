import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.welcomeText}>Hello</Text>
        <Text style={styles.subtitleText}>my name is</Text>
      </View>
      <View style={styles.nameTagContainer}>
        <Text style={styles.nameText}>Bryan 💻 (he/him)</Text>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 90,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  subtitleText: {
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center'
  },
  nameTagContainer:{
    width: '90%', 
    height: '55%', 
    backgroundColor: 'white', 
    borderRadius: 10, 
    justifyContent: 'center'
  },
  nameText: {
    fontSize: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'purple'
  },
});
