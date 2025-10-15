import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';

const Symbol = ({ value }) => (
  <Text style={[styles.symbol, value === 'O' ? styles.circleColor : styles.crossColor]}>
    {value}
  </Text>
);

export default function App() {

  useEffect(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }, []);

  return (
    <SafeAreaView style={ styles.container }>

      <View style={styles.row}>
        <View style={[styles.cell, styles.borderBottom, styles.borderRight]}>
          <Symbol value="O" />
        </View>
        <View style={[styles.cell, styles.borderBottom, styles.borderRight]}>
          <Symbol value="O" />
        </View>
        <View style={[styles.cell, styles.borderBottom]}>
          <Symbol value="X" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.cell, styles.borderBottom, styles.borderRight]}>
          <Symbol value="X" />
        </View>
        <View style={[styles.cell, styles.borderBottom, styles.borderRight]}>
          <Symbol value="O" />
        </View>
        <View style={[styles.cell, styles.borderBottom]}>
          <Symbol value="O" />
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={[styles.cell, styles.borderRight]}>
          <Symbol value="X" />
        </View>
        <View style={[styles.cell, styles.borderRight]}>
          <Symbol value="X" />
        </View>
        <View style={styles.cell}>
          <Symbol value="O" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 8
  },
  symbol:{
     fontSize:100,
    textAlign:'center'
  },
  row: {
    flexDirection: 'row',
    width:'80%',
    justifyContent:'center', 
    alignItems:'center',
    marginLeft: 10,
    marginRight: 10

  },
  borderBottom:{
    borderBottomColor:'blue',
    borderBottomWidth:4
  },
  borderRight:{
    borderRightColor:'blue',
    borderRightWidth:4
  },
  circleColor: {
    color: 'green'
  },
  crossColor: {
    color: 'red'
  },
  cell:{
    height: '100%',
    flex:1
  }
});
