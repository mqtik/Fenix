/**
 * Dependences
 * Typings v0.1
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {Platform, AppRegistry, ActivityIndicator, StyleSheet, Animated, Easing} from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native';
import {  API_URL, 
          PORT_API_DIRECT, 
          PORT_API, 
          DB_BOOKS, 
          INDEX_NAME, 
          LOCAL_DB_NAME, 
          API_STATIC, 
          SETTINGS_LOCAL_DB_NAME 
  } from 'react-native-dotenv'
import { createStackNavigator, createAppContainer, NavigationActions } from 'react-navigation';
import { fadeIn } from 'react-navigation-transitions';
import API from './services/api';
const Remote = new API({ url: API_URL })
let ApplicationStorage = PouchDB(LOCAL_DB_NAME);

/**
 * Screens
 * Navigation
 *
 * @format
 * @flow
 */
import SignedOut from './screens/signedOut.js';
import SignedIn from './screens/signedIn.js';



let initRoute;



const Routes = createStackNavigator({
    SignedOut:{
        screen: SignedOut,
        navigationOptions: {
                 header: null//Will hide header for LoginStack 
           }
    },
    SignedIn:{
        screen: SignedIn,
        navigationOptions: {
              header: null
             /*headerLeft: null,
             title: 'Typings',
             gesturesEnabled: false,
             headerStyle: {
              backgroundColor: '#333',
               },
             headerTintColor: '#fff',
             headerTitleStyle: {
               fontWeight: '200',
              },*/
       }
    }
}, { initialRouteName: initRoute, transitionConfig: () => fadeIn(), });

const AppNavigator = createAppContainer(Routes);
module.exports = Routes;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = { navigation: Function }



export default class App extends Component<Props> {
  constructor(props) {
      super(props)
      this.state = {
         isLoading: true,
         isLoggedIn: false
      }


   }
   componentDidMount() {
     console.log("Mounting app")
     Remote.Auth().checkIfLoggedIn().then(bool => {
        console.log("Respuesta check if", bool)
        if(bool == true){
          this.setState({ isLoading: false, isLoggedIn: true });
        } else {
          this.setState({ isLoading: false });
        }
      }).catch(err => {
        console.log("There was an error!", err)
        this.setState({ isLoading: false });
      })
   }
   onNext = () => {
      this.setState({introText: 'My Changed Text'})
   }



      /*<Text style={styles.instructions}>To get started, edit App.js</Text>*/
        /*<Text style={styles.instructions}>{instructions}</Text>*/

  render() {
    if (this.state.isLoading == true) {
      return (
        <ActivityIndicator
            style={styles.indicator}
            color="#000"
            size="large"
          />
        )
      } else {
        if(this.state.isLoggedIn == true) {
          console.log("is logged in!")
          return (
            <SignedIn style={{marginTop: 0, paddingTop: 0}} 
            navigation={this.props.navigation}/>
          );
        } else {
          console.log("is not logged in!")
          return (
            <AppNavigator style={{marginTop: 0, paddingTop: 0}} navigation={this.props.navigation}/>
          );
        }
    }
  }
}

module.exports = App;

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
});

AppRegistry.registerComponent('Navigation', () => Navigation);