import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
//import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {Icon} from 'react-native-elements';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';
import Storage from '../libs/storage';

var RNFS = require('react-native-fs');

const ArchivosItem = ({item, handler}) => {
  const actualizararchivos = () => {
    handler();
  };

  const removearchivo = async () => {
    try {
      const key = '@keyarchivo';
      let archivo = await Storage.instance.remove(key);
      if (archivo == true) {
        console.log('remove archivo ');
      }
    } catch (err) {
      console.log('remove archivo err', err);
    }
  };

  const getarchivo = async () => {
    try {
      const key = '@keyarchivo';
      let archivo = await Storage.instance.get(key);
      console.log('Nombre del archivo1: ', archivo);
      if (archivo !== null) {
        if (archivo == '/' + item.name) {
          removearchivo();
        }
        return true;
      } else {
        console.log('NO encontro archivo');
        return false;
      }
    } catch (err) {
      console.log('get archivo err', err);
      return false;
    }
  };
  const onSharefile = () => {
    Share.open({
      title: 'Compartir archivo',
      url: 'file://' + item.path,
      // mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      type: 'application/xlsx',
    });
  };
  const deletedfile =  () => {
    return (
      RNFS.unlink(item.path)
        .then(() => {
          console.log('FILE DELETED');
          getarchivo();
          actualizararchivos();
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch(err => {
          console.log(err.message);
        })
    );
  };

  const alertdeleted = () => {
    Alert.alert('Seguro de eliminar el archivo', '', [
      {
        text: 'Si',
        onPress: () => {
          deletedfile();
        },
        style: 'default',
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };
  const importDataToExcel = () => {
    FileViewer.open(item.path, {showOpenWithDialog: true});
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{flexDirection: 'row', alignSelf: 'center'}}
        onPress={importDataToExcel}>
        <Icon name="file-excel-o" type="font-awesome" size={35} color="green" />
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Icon
          raised
          name="trash-o"
          type="font-awesome"
          //backgroundColor="#267233"
          color="#A40909"
          onPress={alertdeleted}
        />
        <Icon
          raised
          name="share-alt"
          type="font-awesome"
          //backgroundColor="#267233"
          color="#267233"
          onPress={onSharefile}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    borderColor: 'black',
    borderBottomWidth: 0.7,
    justifyContent: 'space-between',
  },

  row: {
    flexDirection: 'row',
  },
  nameText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ArchivosItem;
/**
 * 
 * 
 *     <View style={{flexDirection: 'row', alignSelf:'center'}}>
          <Icon
            name="file-excel-o"
            type='font-awesome'
            size={35}
            color="green"
          />
          <View style={{alignSelf:'center'}}>
            <Text style={styles.nameText}>{item.name}</Text>
          </View>
        </View>
        
        <Icon
          name="share-alt"
          size={35}
          backgroundColor="#055"
          color="#267233"
          onPress={onSharefile}
          style={{marginRight:5}}
        /> */
