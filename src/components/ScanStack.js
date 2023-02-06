import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Header, Input} from 'react-native-elements';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HomeScreen from '../res/HomeScreen';
import ScanScreen3 from '../res/ScanScreen3';
import Icon from 'react-native-vector-icons/FontAwesome';
import ArchivosScreen from '../res/ArchivosScreen';
import Storage from '../libs/storage';
const Stack = createNativeStackNavigator();

const removearchivo = async (navigation) => {
  try {
    const key = '@keyarchivo';
    let archivo = await Storage.instance.remove(key);
    if (archivo == true) {
      console.log('remove archivo ');
      navigation.replace('ArchivosScreen')
    }
  } catch (err) {
    console.log('remove archivo err', err);
  }
};
const createTwoButtonAlert = (navigation) => {
  Alert.alert(
    'Finalizar Archivo',
    'Importante, únicamente se guardan los rollos registrados',
    [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Finalizar', onPress: () => removearchivo(navigation)},
    ],
  );
};
const ScanStack = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#00008B',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#FFF',
        }}>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ScanScreen3"
          component={ScanScreen3}
          options={({navigation})=>({
            title: 'Scaneer Rollo',
            headerRight:  props => 
              <Icon
                {...props}
                onPress={() =>createTwoButtonAlert(navigation)}
                name="save"
                color="#fff"
                size={35}
              />
          })}
          /*{{
            title: 'Scaneer Rollo',
            headerRight: () => (
              <Icon
                onPress={navigation.navigate('ArchivosScreen')}
                name="save"
                color="#fff"
                size={35}
              />
            ),
          }}*/
        />
        <Stack.Screen
          name="ArchivosScreen"
          component={ArchivosScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ScanStack;
