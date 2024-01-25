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
      nombrearchivo: '',
    };
  }

  //Verificar si hay archivo
  getarchivo = async () => {
    try {
      const key = '@keyarchivo';
      let archivo = await Storage.instance.get(key);
      console.log('Nombre del archivo1: ', archivo);
      if (archivo !== null) {
        console.log('se encontro archivo');
        this.setState({nombrearchivo: archivo});
        return true;
      } else {
        console.log('NO encontro archivo');
        this.exportDataToExcel();
        return false;
      }
    } catch (err) {
      console.log('get archivo err', err);
      return false;
    }
  };

  removearchivo = async () => {
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
  componentDidMount = async () => {
    if ((await this.getarchivo()) == true) {
      let path = RNFS.ExternalDirectoryPath + this.state.nombrearchivo;
      const bstr = await readFile(path, 'ascii');
      const workbook = XLSX.read(bstr, {type: 'binary'});
      let wsheet = workbook.Sheets[workbook.SheetNames[0]];
      let rowObject = XLSX.utils.sheet_to_json(wsheet);
      console.log('luis:', rowObject.length);

      if (rowObject.length >= 1) {
        Alert.alert(
          'Hay un archivo sin finalizar',
          'Nombre del archivo ' +
            '\n' +
            this.state.nombrearchivo +
            '\n' +
            '\nUltimo registro ' +
            '\nNrollo: ' +
            rowObject[rowObject.length - 1].Nrollo +
            '\nPosicion: ' +
            rowObject[rowObject.length - 1].Posicion +
            '\nPeso: ' +
            rowObject[rowObject.length - 1].Peso,
        );
      } else {
        Alert.alert(
          'Hay un archivo sin finalizar',
          'Nombre del archivo ' + '\n' + this.state.nombrearchivo,
        );
      }
    }
  };

  //crear archivo o verificar si existe un archivo sin finalizar

  //Metodo de scanner
  onSuccess = e => {
    console.log('Esto es de onsuccess', e.data);
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
  exportDataToExcel = async () => {
    //Data de los registros
    let sample_data_to_export = this.state.registros;
    //crea un nuevo libro de trabajo
    let wb = XLSX.utils.book_new();
    //genera una hoja de trabajo con la información de los registros
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export, {
      header: ['Nrollo', 'Posicion', 'Peso'],
    });
    //agrega una hoja de trabajo al libro de trabajo. La nueva hoja de trabajo se llamará "Registros"
    XLSX.utils.book_append_sheet(wb, ws, 'Registros');

    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
    let fechaarchivo = this.creacionFecha();
    //  console.log('Fechar de creacion de archivo: ' + fechaarchivo);
    // creacion de archivo excel
    RNFS.writeFile(RNFS.ExternalDirectoryPath + fechaarchivo, wbout, 'ascii')
      .then(r => {
        console.log('Exito se creo el archivo');
        this.savedata(fechaarchivo);
      })
      .catch(e => {
        console.log('Error', e);
      });
  };

  creacionFecha = () => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hours = new Date().getHours();
    let min = new Date().getMinutes();
    let sec = new Date().getSeconds();
    let fechaarchivo =
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
      '.xlsx';
    return fechaarchivo;
  };
  agregarfila = async () => {
    const key = '@keyarchivo';
    let archivo = await Storage.instance.get(key);
    let path = RNFS.ExternalDirectoryPath + archivo;
    const bstr = await readFile(path, 'ascii');
    const workbook = XLSX.read(bstr, {type: 'binary'});
    let wsheet = workbook.Sheets[workbook.SheetNames[0]];
    XLSX.utils.sheet_add_json(
      wsheet,
      [
        {
          A: this.state.nrollo.split(' ').join(''),
          B: this.state.posicion.split(' ').join(''),
          C: this.state.peso.split(' ').join(''),
        },
      ],
      {
        skipHeader: true,
        origin: -1,
      },
    );
    const wbout = XLSX.write(workbook, {type: 'binary', bookType: 'xlsx'});
    RNFS.writeFile(RNFS.ExternalDirectoryPath + archivo, wbout, 'ascii');
  };

  //Metodo para verificar si se selección una opción
  siguiente = async () => {
    if (this.state.verollo == true) {
      this.setState({visible: false});
      setTimeout(
        () => {
          this.Posicion1.current.focus();
        },
        700,
        this,
      );
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
      let posiciontempo =
        this.state.P0 +
        '0' +
        this.state.P1 +
        '-' +
        '0' +
        this.state.P2 +
        '-' +
        this.state.P3;
      this.setState({posicion: posiciontempo});
      return true;
    } else if (this.state.P1.length === 1) {
      let posiciontempo =
        this.state.P0 +
        '0' +
        this.state.P1 +
        '-' +
        this.state.P2 +
        '-' +
        this.state.P3;
      this.setState({posicion: posiciontempo});
      return true;
    } else if (this.state.P2.length === 1) {
      let posiciontempo =
        this.state.P0 +
        this.state.P1 +
        '-' +
        '0' +
        this.state.P2 +
        '-' +
        this.state.P3;
      this.setState({posicion: posiciontempo});
      return true;
    } else {
      let posiciontempo =
        this.state.P0 +
        this.state.P1 +
        '-' +
        this.state.P2 +
        '-' +
        this.state.P3;
      this.setState({posicion: posiciontempo});
      return true;
    }
  };

  //Metodo para el boton siguiente que guarda información y limpia los elementos de entrada
  seguir = async () => {
    if (this.verdata() == true) {
      await this.agregarfila();
      this.scanner.reactivate();
      this.setState({editable: true});
      this.setState({
        nrollo: '',
        P2: '',
        P3: '',
        peso: '',
        posicion: '',
        verollo: false,
      });
      this.input2.current.clear();
      Keyboard.dismiss();
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

  savedata = async fecha => {
    const storedarchivo = await Storage.instance.store('@keyarchivo', fecha);
    console.log('se guardo ', storedarchivo);
  };

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
                <Text style={styles.textBold}>VIN: </Text>
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
                <Text style={styles.textBold}>Comentarios:</Text>
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
              title={'Registrar'}
              onPress={this.seguir}
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
