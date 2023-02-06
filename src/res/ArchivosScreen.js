'use strict';

import React, {Component} from 'react';
import {Header, Input, Button} from 'react-native-elements';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ArchivosItem from '../components/ArchivosItem';
import XLSX from 'xlsx';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

var RNFS = require('react-native-fs');

class ArchivosScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      archivos: [],
      loading: false,
    };
  }

  componentDidMount = () => {
    this.setState({loading: true});
    this.importDataToExcel();
  };

  handler = (param) => {
    this.setState({loading: true});
    this.importDataToExcel();
  }
  importDataToExcel = () => {
    RNFS.readDir(RNFS.ExternalDirectoryPath)
      .then(result => {
        console.log('GOT RESULT', result);
        console.log('Prueba 1');
        this.setState({archivos: result.reverse(), loading: false});
        // stat the first file
        //  return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        console.log('Prueba 2');
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  };
  render() {
    const {loading, archivos} = this.state;
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
            text: 'Archivos Rollo',
            style: {
              color: '#ffffff',
              fontSize: 20,
              marginTop: 8,
              fontWeight: 'bold',
            },
          }}
        />
        
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator
              style={styles.loader}
              color="#ffff"
              size="large"
            />
          ) : null}
          <FlatList
            data={archivos}
            renderItem={({item}) => <ArchivosItem item={item} handler={this.handler} />}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },

  tittleText: {
    color: '#fff',
    textAlign: 'center',
  },

  btn: {
    padding: 8,
    backgroundColor: 'blue',
    borderRadius: 8,
    margin: 16,
  },

  btnText: {
    color: 'white',
    textAlign: 'center',
  },

  loader: {
    marginTop: 60,
  },
});

export default ArchivosScreen;
