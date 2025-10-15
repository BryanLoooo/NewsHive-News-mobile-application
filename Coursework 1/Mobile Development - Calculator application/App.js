import { StatusBar } from 'expo-status-bar';
import { StyleSheet, 
         Text, 
         View,
         TouchableOpacity,
         Dimensions,
         SafeAreaView } from 'react-native';

import * as ScreenOrientation from 'expo-screen-orientation';

import { useState } from 'react';
import { useEffect } from 'react';

const buttonWidth = Dimensions.get('window').width / 4; 
const toRadians = (deg) => deg * (Math.PI / 100);

export default function App() {

useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);

  //  Declare variables
  const [answerValue, setAnswerValue] = useState('0');
  const [memoryValue, setMemoryValue] = useState(null);
  const [operatorValue, setOperatorValue] = useState(null);
  const [readyToReplace, setReadyToReplace] = useState(true);

  const buttonPressed = (value) => {
    if(!isNaN(value)) {
      handleNumber(value);

    } else if (value === 'C') {
      setAnswerValue('0');
      setMemoryValue(null);
      setOperatorValue(null);
      setReadyToReplace(true);

    } else if (value === '+/-') {
      setAnswerValue((prev) => (-parseFloat(prev) * -1).toFixed(2).toString());

    } else if (value === '%') {
      setAnswerValue((prev) => (parseFloat(prev) * 0.01).toFixed(2),toString());
    
    } else if (value=== '=') {
        if (operatorValue && memoryValue !== null) {
          const result = calculateEquals();
          setAnswerValue(result.toString());
          setMemoryValue(null);
          setOperatorValue(null);
          setReadyToReplace(true);
        }
    }else if (value === 'sin')  {
      try{
        const result = Math.sin(toRadians(parseFloat(answerValue)));
        setAnswerValue(isFinite(result) ? result.toFixed(2).toString() : 'Error');
        setReadyToReplace(true);
      } catch {
        setAnswerValue('Error');
      }
    }else if (value === 'cos') {
      try{
        const result = Math.cos(toRadians(parseFloat(answerValue)));
        setAnswerValue(isFinite(result) ? result.toFixed(2).toString() : 'Error');
        setReadyToReplace(true);
      } catch {
        setAnswerValue('Error');
      }
    }else if (value === 'tan') {
      try{
        const result = Math.tan(toRadians(parseFloat(answerValue)));
        setAnswerValue(isFinite(result) ? result.toFixed(2).toString() : 'Error');
        setReadyToReplace(true);
      } catch {
        setAnswerValue('Error');
      }
    }else if(value === 'π') {
      setAnswerValue(Math.PI.toFixed(2),toString());
      setReadyToReplace(true);
    }else if(value === '√') {
      setAnswerValue(Math.sqrt(parseFloat(answerValue)).toFixed(2).toString());
      setReadyToReplace(true);
    }else if(value === 'x²') {
      try{
        const result = Math.pow(parseFloat(answerValue), 2);
        setAnswerValue(isFinite(result) ? result.toFixed(2).toString() : 'Error');
        setReadyToReplace(true);
      } catch {
        setAnswerValue('Error');
      }
    }else if(value === 'log') {
      try{
        const result = Math.log10(parseFloat(answerValue));
        setAnswerValue(isFinite(result) ? result.toFixed(2).toString() : 'Error');
        setReadyToReplace(true);
      } catch {
        setAnswerValue('Error');
      }
    }else if(value === 'ln')  {
      try{
        const result = Math.log(parseFloat(answerValue));
        setAnswerValue(isFinite(result) ? result.toFixed(2).toString() : 'Error');
        setReadyToReplace(true);
      } catch {
        setAnswerValue('Error');
      }
    }else if (value === '.')  {
      if(readyToReplace) {
        setAnswerValue('0.');
        setReadyToReplace(false);
      } else if (!answerValue.includes('.')){
        setAnswerValue((prev) => prev + '.');
      }
    }
    
    else  {
        if (operatorValue !== null && memoryValue !== null && !readyToReplace) {
          const result = calculateEquals();
          setMemoryValue(result);
          setAnswerValue(result.toString());
        
        }else{
          setMemoryValue(parseFloat(answerValue));
        }
        setOperatorValue(value);
        setReadyToReplace(true);
    }
  };

  const handleNumber = (num) => {
    if(readyToReplace || answerValue === '0') {
      setAnswerValue(num.toString());
      setReadyToReplace(false);
    
    }else{
      setAnswerValue((prev) => prev + num.toString());
    
    }
  };

  const calculateEquals = () => {
    const prev = parseFloat(memoryValue);
    const current = parseFloat(answerValue);
    let result = 0;

    switch(operatorValue) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case 'x':
        result = prev * current;
        break;
      case '/':
        result = current !== 0 ? prev / current : 'Error';
        break;
    }
    return result;
  };

  const renderButton = (value, type = 'default', extraStyle = {}) => (
    <TouchableOpacity
      onPress={() => buttonPressed(value)}
      style={[
        styles.button,
        type === 'gray' && styles.grayButton,
        type === 'blue' &&  styles.blueButton,
        type === 'sci' && styles.sciButton,
        value === '0' && styles.longButton,
        extraStyle,
      ]}
    >
      <Text style={styles.buttonText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{answerValue}</Text>
      </View>
      <View style={styles.buttonRow}>
        {renderButton(answerValue==='0'?'AC':'C','gray')}
        {renderButton('+/-', 'gray')}
        {renderButton('%', 'gray')}
        {renderButton('/', 'blue')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('sin', 'sci')}
        {renderButton('cos', 'sci')}
        {renderButton('tan', 'sci')}
        {renderButton('π', 'sci')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('log', 'sci')}
        {renderButton('ln', 'sci')}
        {renderButton('√', 'sci')}
        {renderButton('x²', 'sci')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('7')}
        {renderButton('8')}
        {renderButton('9')}
        {renderButton('x', 'blue')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('4')}
        {renderButton('5')}
        {renderButton('6')}
        {renderButton('-', 'blue')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('1')}
        {renderButton('2')}
        {renderButton('3')}
        {renderButton('+', 'blue')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('0', 'default', styles.longButton)}
        {renderButton('.')}
        {renderButton('=', 'blue')}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-end',
  },
  resultContainer: {
    alignItems: 'flex-end',
    padding: 20,
  },
  resultText: {
    fontSize: 80,
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#333333',
    width: buttonWidth - 15,
    height: buttonWidth - 15,
    borderRadius: (buttonWidth - 15) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  longButton: {
    width: buttonWidth * 2 - 25,
    alignItems: 'flex-start',
    paddingLeft: 30,
  },
  grayButton: {
    backgroundColor: '#a5a5a5',
  },
  blueButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
  },
  sciButton: {
    backgroundColor: '#555555',
  },
});
