'use strict';

import React, {Component} from 'react';
import {Header, Input, Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
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

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {color} from 'react-native-elements/dist/helpers';
import RadioButtonRN from 'radio-buttons-react-native';
import Dialog from 'react-native-dialog';
import XLSX from 'xlsx';
import FileViewer from 'react-native-file-viewer';
import Share from 'react-native-share';
import {Icon} from 'react-native-elements';
import IconInput from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import {readFile} from 'react-native-fs';
import Storage from '../libs/storage';
var RNFS = require('react-native-fs');
const countries = ['A', 'B', 'C', 'D'];
let retroceder = '';

class ScanScreen2 extends Component {
  constructor(props) {
    super(props);
    this.input2 = React.createRef();
    this.Posicion1 = React.createRef();
    this.Posicion2 = React.createRef();
    this.Posicion3 = React.createRef();
    this.inputpeso = React.createRef();
    this.dropdownRef0 = React.createRef();
    this.state = {
      nrollo: '',
      peso: '',
      posicion: '',
      P0: 'A',
      P1: '',
      P2: '',
      P3: '',
      visible: false,
      literna: false,
      editable: true,
      data: [],
      registros: [],
      verollo: false,
    };
  }

  //crear archivo o verificar si existe un archivo sin finalizar

  //Metodo de scanner
  onSuccess = e => {
    console.log(e.data);
    let x = e.data.split('{|T');
    console.log(x);
    console.log(x.length);

    if (x.length > 1) {
      let a = [];
      for (let i = 1; i < x.length - 1; i++) {
        a.push({label: x[i].slice(1)});
      }
      this.setState({data: a});
      this.setState({visible: true});
    } else {
      this.setState({nrollo: e.data});
      this.Posicion1.current.focus();
    }
    this.setState({editable: false});
  };
  //Metodo genera el archivo excel
  exportDataToExcel = () => {
    //Data de los registros
    let sample_data_to_export = this.state.registros;
    //crea un nuevo libro de trabajo
    let wb = XLSX.utils.book_new();
    //genera una hoja de trabajo con la información de los registros
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export);
    //agrega una hoja de trabajo al libro de trabajo. La nueva hoja de trabajo se llamará "Registros"
    XLSX.utils.book_append_sheet(wb, ws, 'Registros');

    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();

    // creacion de archivo excel
    RNFS.writeFile(
      RNFS.ExternalDirectoryPath +
        '/' +
        date +
        '-' +
        month +
        '-' +
        year +
        '-' +
        hours +
        '-' +
        min +
        '-' +
        sec +
        '.xlsx',
      wbout,
      'ascii',
    )
      .then(r => {
        console.log('Exito se creo el archivo');
      })
      .catch(e => {
        console.log('Error', e);
      });
  };

  agregarfila = () => {
    RNFS.readDir(RNFS.ExternalDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        console.log('GOT RESULT', result);

        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then(statResult => {
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], 'ascii');
        }

        return 'no file';
      })
      .then(contents => {
        // log the file contents
        XLSX.read(contents, {type: 'binary', bookType: 'xlsx'});

        return;
        //console.log(contents)
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
    /*
    let path=  (RNFS.ExternalDirectoryPath +"/30-3-2022-13-22-21.xlsx")
    const bstr =  RNFS.readFile(path, 'ascii')
    console.log(bstr) 
    bstr is a binary string */
    // const workbook = XLSX.read(bstr, {type: 'binary', bookType: 'xlsx'});
    //console.log("hola"+workbook)
  };
  //Metodo para guardar la informacion en un archivo
  guardar = () => {
    console.log(this.state.registros);
    if (
      this.state.registros == 0 &&
      (this.state.nrollo == '' ||
        this.state.peso == '' ||
        this.state.P2 == '' ||
        this.state.P3 == '')
    ) {
      Alert.alert('Falta información');
      //Alert.alert("No hay registros para guardar")
    } else {
      if (
        this.state.nrollo == '' &&
        this.state.peso == '' &&
        this.state.P2 == '' &&
        this.state.P3 == ''
      ) {
        this.state.registros.push({
          Rollo: this.state.nrollo,
          Posicion: '',
          Peso: this.state.peso,
        });
      } else if (this.state.P1.length === 1 && this.state.P2.length === 1) {
        this.state.registros.push({
          Rollo: this.state.nrollo,
          Posicion:
            this.state.P0 +
            '0' +
            this.state.P1 +
            '-' +
            '0' +
            this.state.P2 +
            '-' +
            this.state.P3,
          Peso: this.state.peso,
        });
        console.log(this.state.registros);
      } else if (this.state.P1.length === 1) {
        this.state.registros.push({
          Rollo: this.state.nrollo,
          Posicion:
            this.state.P0 +
            '0' +
            this.state.P1 +
            '-' +
            this.state.P2 +
            '-' +
            this.state.P3,
          Peso: this.state.peso,
        });
        console.log(this.state.registros);
      } else if (this.state.P2.length === 1) {
        this.state.registros.push({
          Rollo: this.state.nrollo,
          Posicion:
            this.state.P0 +
            this.state.P1 +
            '-' +
            '0' +
            this.state.P2 +
            '-' +
            this.state.P3,
          Peso: this.state.peso,
        });
        console.log(this.state.registros);
      } else {
        this.state.registros.push({
          Rollo: this.state.nrollo,
          Posicion:
            this.state.P0 +
            this.state.P1 +
            '-' +
            this.state.P2 +
            '-' +
            this.state.P3,
          Peso: this.state.peso,
        });
      }

      this.exportDataToExcel();
      this.scanner.reactivate();
      this.setState({editable: true});
      this.setState({
        nrollo: '',
        P0: 'A',
        P1: '',
        P2: '',
        P3: '',
        peso: '',
        registros: [],
        verollo: false,
        literna: false,
      });
      this.input2.current.clear();
      this.dropdownRef0.current.reset();
      Keyboard.dismiss();
      this.props.navigation.navigate('ArchivosScreen');
    }
  };

  //Metodo para verificar si se selección una opción
  siguiente = () => {
    if (this.state.verollo == true) {
      this.setState({visible: false});
      this.Posicion1.current.focus();
    } else {
      Alert.alert('Eliga una opción');
    }
  };

  //Metodo verifica si falta información
  verdata = () => {
    if (
      this.state.nrollo == '' ||
      this.state.peso == '' ||
      this.state.P0 == '' ||
      this.state.P1 == '' ||
      this.state.P2 == '' ||
      this.state.P3 == ''
    ) {
      Alert.alert('Falta información');

      return false;
    } else if (this.state.P1.length === 1 && this.state.P2.length === 1) {
      this.state.registros.push({
        Rollo: this.state.nrollo,
        Posicion:
          this.state.P0 +
          '0' +
          this.state.P1 +
          '-' +
          '0' +
          this.state.P2 +
          '-' +
          this.state.P3,
        Peso: this.state.peso,
      });
      console.log(this.state.registros);

      return true;
    } else if (this.state.P1.length === 1) {
      this.state.registros.push({
        Rollo: this.state.nrollo,
        Posicion:
          this.state.P0 +
          '0' +
          this.state.P1 +
          '-' +
          this.state.P2 +
          '-' +
          this.state.P3,
        Peso: this.state.peso,
      });
      console.log(this.state.registros);

      return true;
    } else if (this.state.P2.length === 1) {
      this.state.registros.push({
        Rollo: this.state.nrollo,
        Posicion:
          this.state.P0 +
          this.state.P1 +
          '-' +
          '0' +
          this.state.P2 +
          '-' +
          this.state.P3,
        Peso: this.state.peso,
      });
      console.log(this.state.registros);

      return true;
    } else {
      this.state.registros.push({
        Rollo: this.state.nrollo,
        Posicion:
          this.state.P0 +
          this.state.P1 +
          '-' +
          this.state.P2 +
          '-' +
          this.state.P3,
        Peso: this.state.peso,
      });
      console.log(this.state.registros);

      return true;
    }
  };

  //Metodo para el boton siguiente que guarda información y limpia los elementos de entrada
  seguir = async() => {
    if (this.verdata() == true) {
      this.scanner.reactivate();
      this.setState({editable: true});
      this.setState({
        nrollo: '',
        P2: '',
        P3: '',
        peso: '',
        verollo: false,
      });
      this.input2.current.clear();
      Keyboard.dismiss();
      this.savedata();
    }
  };

  modoliterna = () => {
    if (this.state.literna == false) {
      this.setState({literna: true});
    } else {
      this.setState({literna: false});
    }
  };

  //Limpiar el input de rollo
  verIcon = () => {
    this.setState({nrollo: '', editable: true, verollo: false});
    this.scanner.reactivate();
  };

  handleKeyPress = event => {
    console.log('evento: ' + event.nativeEvent.key);
    if (this.state.P2.length == 0 && event.nativeEvent.key == 'Backspace') {
      this.Posicion1.current.focus();
    }
  };

  handleKeyPress2 = event => {
    console.log('evento: ' + event.nativeEvent.key);
    if (this.state.P3.length == 0 && event.nativeEvent.key == 'Backspace') {
      this.Posicion2.current.focus();
    }
  };
  keyPress = event => {
    this.setState({P1: event});

    if (event.length == 2) {
      this.Posicion2.current.focus();
    }
    console.log(event.length);
  };
  keyPress2 = event => {
    this.setState({P2: event});

    if (event.length == 2) {
      this.Posicion3.current.focus();
    }
    console.log(event.length);
  };

/*  savedata = async () => {
    const dataregistros = this.state.registros;
    const storeddata = await Storage.instance.store("1", dataregistros);
  };
*/
  render() {
    const {nrollo, editable, verollo, literna} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <QRCodeScanner
          ref={node => {
            this.scanner = node;
          }}
          onRead={this.onSuccess}
          flashMode={
            literna
              ? RNCamera.Constants.FlashMode.torch
              : RNCamera.Constants.FlashMode.off
          }
          // cameraStyle={{height: 10, width: 20}}
          containerStyle={{backgroundColor: 'white'}}
        />
        <Icon
          raised
          name="bolt"
          type="font-awesome"
          color={literna ? '#F1EB11' : '#999999'}
          containerStyle={{alignSelf: 'center'}}
          onPress={this.modoliterna}
        />

        <View style={{backgroundColor: 'white', borderRadius: 30}}>
          <View style={{marginLeft: 12}}>
            <View style={styles.row}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.textBold}>N° de rollo: </Text>
              </View>
              <Input
                ref={this.input3}
                defaultValue={nrollo}
                editable={editable}
                containerStyle={{flex: 1}}
                onChangeText={nrollo => this.setState({nrollo})}
                onSubmitEditing={() => {
                  this.Posicion1.current.focus();
                }}
                inputStyle={{
                  fontSize: 16,
                  margin: 0,
                  padding: 0,
                  textAlignVertical: 'bottom',
                }}
                rightIcon={
                  editable ? (
                    <IconInput name="angle-left" size={1} color="#ffff" />
                  ) : (
                    <IconInput
                      name="times"
                      size={24}
                      color="#95A5A6"
                      onPress={this.verIcon}
                    />
                  )
                }
                errorStyle={{height: 0, width: 0}}
              />
            </View>

            <View style={styles.row}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.textBold}>Posición:</Text>
              </View>
              <View style={{flexDirection: 'row', flex: 1, marginRight: 5}}>
                <SelectDropdown
                  ref={this.dropdownRef0}
                  buttonStyle={{flex: 1}}
                  data={countries}
                  defaultButtonText={this.state.P0}
                  onSelect={(selectedItem, index) => {
                    //    console.log(selectedItem, index);
                    this.state.P0 = selectedItem;
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                />
                <TextInput
                  ref={this.Posicion1}
                  blurOnSubmit={false}
                  defaultValue={this.state.P1}
                  //onKeyPress={this.keyPress}
                  onChangeText={this.keyPress}
                  onSubmitEditing={() => {
                    this.Posicion2.current.focus();
                  }}
                  //onKeyPress={this.handleKeyPress2}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    backgroundColor: '#EFEFEF',
                    fontSize: 18,
                    marginLeft: 2,
                  }}
                  textAlign="center"
                  maxLength={2}
                />
                <Text
                  style={{
                    textAlignVertical: 'center',
                    fontSize: 25,
                    marginHorizontal: 3,
                    fontWeight: '500',
                  }}>
                  -
                </Text>
                <TextInput
                  ref={this.Posicion2}
                  blurOnSubmit={false}
                  defaultValue={this.state.P2}
                  onChangeText={this.keyPress2}
                  onKeyPress={this.handleKeyPress}
                  onSubmitEditing={() => {
                    this.Posicion3.current.focus();
                  }}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    backgroundColor: '#EFEFEF',
                    fontSize: 18,
                    marginLeft: 2,
                  }}
                  textAlign="center"
                  maxLength={2}
                  /*  style={styles.input}
                  onChangeText={onChangeText}
                  value={text}*/
                />
                <Text
                  style={{
                    textAlignVertical: 'center',
                    fontSize: 25,
                    marginHorizontal: 3,
                    fontWeight: '500',
                  }}>
                  -
                </Text>
                <TextInput
                  ref={this.Posicion3}
                  defaultValue={this.state.P3}
                  onKeyPress={this.handleKeyPress2}
                  onChangeText={P3 => this.setState({P3})}
                  onSubmitEditing={() => {
                    this.input2.current.focus();
                  }}
                  blurOnSubmit={false}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    backgroundColor: '#EFEFEF',
                    fontSize: 18,
                    marginLeft: 2,
                  }}
                  textAlign="center"
                  maxLength={1}
                  /*  style={styles.input}
                  onChangeText={onChangeText}
                  value={text}*/
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.textBold}>Peso:</Text>
              </View>
              <Input
                ref={this.input2}
                placeholder="Ej. 200 "
                containerStyle={{flex: 1}}
                onChangeText={peso => this.setState({peso})}
                keyboardType="numeric"
                inputStyle={{
                  fontSize: 16,
                  margin: 0,
                  padding: 0,
                  textAlignVertical: 'bottom',
                }}
                errorStyle={{height: 0, width: 0}}
              />
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Button
              title={'Guardar'}
              onPress={this.guardar}
              containerStyle={{
                width: 150,
                marginHorizontal: 10,
                marginVertical: 10,
              }}
              buttonStyle={{
                backgroundColor: '#34495E',
                borderRadius: 3,
              }}
            />
            <Button
              title={'Seguir'}
              onPress={this.agregarfila}
              containerStyle={{
                width: 150,
                marginHorizontal: 10,
                marginVertical: 10,
              }}
              buttonStyle={{
                backgroundColor: '#58D68D',
                borderRadius: 3,
              }}
            />
          </View>
          <View>
            <Dialog.Container visible={this.state.visible}>
              <Dialog.Title>Eliga una opción</Dialog.Title>
              <RadioButtonRN
                data={this.state.data}
                selectedBtn={e =>
                  this.setState({nrollo: e.label, verollo: true})
                }
              />
              <Dialog.Button label="Siguiente" onPress={this.siguiente} />
            </Dialog.Container>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 16,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    fontSize: 16,
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

export default ScanScreen2;
