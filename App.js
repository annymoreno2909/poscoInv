import React from 'react';
import {View, Text, TouchableOpacity, PermissionsAndroid} from 'react-native';
import ScanStack from './src/components/ScanStack';
import XLSX from 'xlsx';

const App = () => {
  return <ScanStack />;
};

export default App;
/*
const App = () => {
  var RNFS = require('react-native-fs');
  // function to handle exporting
  const exportDataToExcel = () => {
    // Created Sample data
    let sample_data_to_export = [
      {id: '1', name: 'First User'},
      {id: '2', name: 'Second User'},
      {id: '3', name: 'Tree User'},
    ];

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

    // Write generated excel to Storage
    RNFS.writeFile(RNFS.ExternalDirectoryPath + '/test1.xlsx', wbout, 'ascii')
      .then(r => {
        console.log('Success');
        console.log('1');
      })
      .catch(e => {
        console.log('Error', e);
        console.log('2');
      });
  };
  const importDataToExcel = () => {
    RNFS.readDir(RNFS.ExternalDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        console.log('GOT RESULT', result);

        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then(statResult => {
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], 'utf8');
        }

        return 'no file';
      })
      .then(contents => {
        // log the file contents
        console.log(contents);
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  };

  const handleClick = async () => {
    try {
      // Check for Permission (check if permission is already given or not)
      let isPermitedExternalStorage = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (!isPermitedExternalStorage) {
        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage permission needed',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our exportDataToExcel function)
         importDataToExcel();
          console.log('Permission granted');
        } else {
          // Permission denied
          console.log('Permission denied');
        }
      } else {
        // Already have Permission (calling our exportDataToExcel function)
        importDataToExcel();
      }
    } catch (e) {
      console.log('Error while checking permission');
      console.log(e);
      return;
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={() => handleClick()}
        style={{
          width: '50%',
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: 'blue',
          marginVertical: 20,
        }}>
        <Text style={{textAlign: 'center', color: 'white'}}>
          Export to Excel
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;*/
