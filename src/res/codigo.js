import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_1 = [
  {
    name: 'Tom',
    age: 20,
    traits: {
      hair: 'black',
      eyes: 'blue',
    },
  },
];

const USER_2 = [
  {
    name: 'Sarah',
    age: 21,
    hobby: 'cars',
    traits: {
      eyes: 'green',
    },
  },
  {
    name: 'Tom',
    age: 20,
    traits: {
      hair: 'black',
      eyes: 'blue',
    },
  },
];
class Codigo {
  static instance = new Codigo();

  mergeUsers = async () => {
    try {
      //save first user
      await AsyncStorage.setItem('@MyApp_user', JSON.stringify(USER_1));

      // merge USER_2 into saved USER_1
      await AsyncStorage.mergeItem('@MyApp_user', JSON.stringify(USER_2));

      // read merged item
      const currentUser = await AsyncStorage.getItem('@MyApp_user');

      console.log(currentUser);

      // console.log result:
      // {
      //   name: 'Sarah',
      //   age: 21,
      //   hobby: 'cars',
      //   traits: {
      //     eyes: 'green',
      //     hair: 'black'
      //   }
      // }
    } catch (e) {
      console.log('merge Error', e);
      return false;
    }
  };
}
export default Codigo;
