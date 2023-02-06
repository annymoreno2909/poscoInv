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
var RNFS = require('react-native-fs');
const countries = ['A', 'B', 'C', 'D'];

class ScanScreen2 extends Component {
  constructor(props) {
    super(props);
    this.input2 = React.createRef();
    this.dropdownRef0 = React.createRef();
    this.state = {
      nrollo: '',
      peso: '',
      posicion: '',
      P0: 'A',
      P1: '',
      P2: '',
      P3: '',
      P4: '',
      P5: '',
      P6: '',
      visible: false,
      literna: false,
      editable: true,
      data: [],
      registros: [],
      verollo: false,
    };
  }

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
    }
    this.setState({editable: false});
  };

  exportDataToExcel = () => {
    let sample_data_to_export = this.state.registros;
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export);
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

  guardar = () => {
    console.log(this.state.registros);
    if (
      this.state.registros == 0 &&
      (this.state.nrollo == '' || this.state.peso == '')
    ) {
      Alert.alert('Falta información');
      //Alert.alert("No hay registros para guardar")
    } else {
      if (
        this.state.P1 == '' &&
        this.state.P2 == '' &&
        this.state.P3 == '' &&
        this.state.P4 == '' &&
        this.state.P5 == '' &&
        this.state.P6 == ''
      ) {
        this.state.registros.push({
          Rollo: this.state.nrollo,
          Posicion:"",
          Peso: this.state.peso,
        });
      }else{
        this.state.registros.push({
          Rollo: this.state.nrollo,
          Posicion:
            this.state.P0 +
            this.state.P1 +
            this.state.P2 +
            '-' +
            this.state.P3 +
            this.state.P4 +
            '-' +
            this.state.P5 +
            this.state.P6,
          Peso: this.state.peso
        });
      }

      this.exportDataToExcel();
      this.scanner.reactivate();
      this.setState({editable: true});
      this.setState({
        nrollo: '',
        posicion: '',
        P0: 'A',
        P1: '',
        P2: '',
        P3: '',
        P4: '',
        P5: '',
        P6: '',
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

  siguiente = () => {
    if (this.state.verollo == true) {
      this.setState({visible: false});
    } else {
      Alert.alert('Eliga una opción');
    }
  };

  verdata = () => {
    if (
      this.state.nrollo == '' ||
      this.state.peso == '' ||
      this.state.P0 == '' ||
      this.state.P1 == '' ||
      this.state.P2 == '' ||
      this.state.P3 == '' ||
      this.state.P4 == '' ||
      this.state.P5 == '' ||
      this.state.P6 == ''
    ) {
      Alert.alert('Falta información');

      return false;
    } else {
      this.state.registros.push({
        Rollo: this.state.nrollo,
        Posicion:
          this.state.P0 +
          this.state.P1 +
          this.state.P2 +
          '-' +
          this.state.P3 +
          this.state.P4 +
          '-' +
          this.state.P5 +
          this.state.P6,
        Peso: this.state.peso,
      });
      console.log(this.state.registros);

      return true;
    }
  };

  seguir = () => {
    if (this.verdata() == true) {
      this.scanner.reactivate();
      this.setState({editable: true});
      this.setState({
        nrollo: '',
        posicion: '',
        P1: '',
        P2: '',
        P3: '',
        P4: '',
        P5: '',
        P6: '',
        peso: '',
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
              <View style={{flexDirection: 'row', flex: 1, marginRight: 3}}>
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
                  defaultValue={this.state.P1}
                  onChangeText={P1 => this.setState({P1})}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    backgroundColor: '#EFEFEF',
                    fontSize: 18,
                    marginLeft: 2,
                  }}
                  textAlign="center"
                  maxLength={1}
                />
                <TextInput
                  defaultValue={this.state.P2}
                  onChangeText={P2 => this.setState({P2})}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    backgroundColor: '#EFEFEF',
                    fontSize: 18,
                    marginLeft: 2,
                  }}
                  textAlign="center"
                  maxLength={1}
                  /*style={styles.input}
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
                  defaultValue={this.state.P3}
                  onChangeText={P3 => this.setState({P3})}
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
                <TextInput
                  defaultValue={this.state.P4}
                  onChangeText={P4 => this.setState({P4})}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    backgroundColor: '#EFEFEF',
                    fontSize: 18,
                    marginLeft: 2,
                  }}
                  textAlign="center"
                  maxLength={1}
                  /* style={styles.input}
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
                  defaultValue={this.state.P5}
                  onChangeText={P5 => this.setState({P5})}
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
                <TextInput
                  defaultValue={this.state.P6}
                  onChangeText={P6 => this.setState({P6})}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    backgroundColor: '#EFEFEF',
                    fontSize: 18,
                    marginLeft: 2,
                    marginLeft: 2,
                  }}
                  textAlign="center"
                  maxLength={1}
                  //  style={styles.input}
                  //  onChangeText={onChangeText}
                  //value={text}
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
