'use strict';

import React, {Component} from 'react';
import {Header} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Header
          statusBarProps={{
            barStyle: 'light-content',
            backgroundColor: '#000000',
          }}
          ViewComponent={LinearGradient} // Don't forget this!
          linearGradientProps={{
            colors: ['#00008B', '#0000CD'],
            start: {x: 0, y: 0.5},
            end: {x: 1, y: 0.5},
          }}
          centerComponent={{
            text: 'Scaneer Rollo',
            style: {
              color: '#ffffff',
              fontSize: 20,
              marginTop: 8,
              fontWeight: 'bold',
            },
          }}
        />

        <View style={{alignContent:'center'}}>
          <Text style={styles.centerText}>Elige una opción</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#34495E',
                borderRadius: 20,
                height: 200,
                width: 150,
                justifyContent: 'center',
              }}
              onPress={() => this.props.navigation.navigate('ScanScreen3')}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '500',
                }}>
                Iniciar scanner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#34495E',
                borderRadius: 20,
                height: 200,
                width: 150,
                justifyContent: 'center',
              }}
              onPress={() => this.props.navigation.navigate('ArchivosScreen')}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '500',
                }}>
                Archivos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    fontSize: 30,
    fontWeight: '500',
    padding: 32,
    color: '#000000',
    textAlign: 'center',
  },
  textBold: {
    fontWeight: '500',
    fontSize: 18,
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
  },
});

export default HomeScreen;
