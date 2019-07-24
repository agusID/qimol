import * as firebase from 'firebase/app'
import 'firebase/database'

// const firebaseConfig = {
//   apiKey: 'AIzaSyCpPOYISxSTRudgw1P6ttXTyMZDrpGWp6A',
//   authDomain: 'bandungjs-c3782.firebaseapp.com',
//   databaseURL: 'https://bandungjs-c3782.firebaseio.com',
//   projectId: 'bandungjs-c3782',
//   appId: '1:1085804661670:web:e9dbd4949057ccf2',
// }

// firebase.initializeApp(firebaseConfig)
const firebaseConfig = {
  apiKey: "AIzaSyBT67-cThnTNj9V6LNhyPhWU1lf1l4VCK4",
  authDomain: "qimol-ralali.firebaseapp.com",
  databaseURL: "https://qimol-ralali.firebaseio.com",
  projectId: "qimol-ralali",
  appId: "1:352043315675:web:ecbf291dd1d8f8be"
};

firebase.initializeApp(firebaseConfig);

export const database = firebase.database()
