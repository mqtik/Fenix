/**
 * Signed Out Component
 * Login & Register
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableHighlight, TextInput, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ActivityIndicator, Dimensions} from 'react-native';
import Icon from 'react-native-fa-icons';

import Icono from 'react-native-vector-icons/Ionicons';
import PouchDB from 'pouchdb-react-native'
import APIUpsert from 'pouchdb-upsert'
import Toast, {DURATION} from 'react-native-easy-toast'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { createStackNavigator, createAppContainer, NavigationActions, StackActions } from 'react-navigation';
import { API_URL, PORT_API_DIRECT, PORT_API, SETTINGS_LOCAL_DB_NAME, DB_BOOKS, LOCAL_DB_NAME } from 'react-native-dotenv'
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';
import { getLang, Languages } from '../static/languages';
import { BlurView, VibrancyView } from "../../libraries/blur";
import API from '../services/api';
import {Column as Col, Row} from 'react-native-flexbox-grid';
import Modal from "react-native-modal";
PouchDB.plugin(APIUpsert);
const Remote = new API({ url: API_URL })
let ApplicationStorage = PouchDB(LOCAL_DB_NAME);

let ancho = Dimensions.get('window').width; //full width
let alto = Dimensions.get('window').height; //full height

type Props = { navigation: Function }

const slides = [
                  {
                    key: 'somethun',
                    title: 'Native',
                    text: 'Build true native apps for your audience.',
                    icon: 'ios-bonfire',
                    colors: ['#63E2FF', '#B066FE'],
                  },
                  {
                    key: 'somethun1',
                    title: 'Cross platform',
                    text: 'Every user can have access to your business.',
                    icon: 'ios-partly-sunny',
                    colors: ['#A3A1FF', '#3A3897'],
                  },
                  {
                    key: 'somethun2',
                    title: 'Community',
                    text: 'You will have thousands of maintained packages for your next project',
                    icon: 'ios-play-circle',
                    colors: ['#29ABE2', '#4F00BC'],
                  },
                ];

export default class SignedOut extends Component<Props> {
  constructor() {
      super()
      this.state = {
         introText: '',
         username: "mfort@keetup.com",
         password: "nodejs64",
         auth: null,
         placeholder: Languages.Username[getLang()],
         showPassword: false,
         color: 'red',
         exist: 'false',

         first_name: null,
         last_name: null,
         isLoading: true,
         statusTab: 'login',
         isOpen: false,
         buttonState: 'upload',
         heightContainer: 290
      }
      Remote.Auth().checkIfLoggedIn().then(bool => {
        console.log("Respuesta check if", bool)
        if(bool == true){
          this.onContinueAs();
        }
      })
      

   }


   componentDidMount() {
      // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
       this.setState({isLoading: false})
    }
            

   onContinueAs = () => {
        
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'SignedIn', params: {
                          onLogout: this._onLogout,
                          user: this.state.username
                        } })],
        });
      this.props.navigation.dispatch(resetAction);
   }

   onNext = () => {
      this.setState({introText: 'My Changed Text'})
   }
   _renderItem = props => (
      <View
        style={[styles.mainContent, {
          width: props.width,
          height: 500,
        }]}
      >
        <Icono style={{ backgroundColor: 'transparent' }} name={props.icon} size={150} color="white" />
        <View style={{marginTop: -440}}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.text}>{props.text}</Text>
        </View>
       
      </View>
  );
   _onPress = () => {
     


   }
   _onLogin = () => {
     console.log("On login!", this.state.username, this.state.password)
    /*Snackbar.show({
            title: 'Please agree to this.',
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
              title: 'AGREE',
              onPress: () => Snackbar.show({ title: 'Thank you!' }),
              color: 'green',
            },
          })*/
     Snackbar.show({ title: 'Signing you in...' })
     Remote.Auth().signIn(this.state.username, this.state.password)
     .then(res => {
       console.log("logged in mti!", res)
       if(res.token_type == 'Bearer' && res.expires_in != null && res.access_token != null){

         Snackbar.show({ title: 'Welcome!' });
         Remote.Auth().setAccessToken(res).then(resAcc => {
           Remote.Auth().me().then(resMe => {
             Remote.Auth().saveMe(resMe.data).then(resSaveMe => {
               console.log("saveMe()", resSaveMe);
               this.onContinueAs();
             })
           })
         });


       }
     }).catch(err => {
       console.log("on error login in", err)
     })
   }
   _onRegister = () => {
     console.log("On register!", this.state)
    Snackbar.show({ title: 'Creating your account...' })
     Remote.Auth().signUp(this.state.first_name, this.state.last_name,this.state.email, this.state.password)
     .then(res => {
       Snackbar.show({ title: 'Oops!' })
       console.log("registered in mti!", res)
     }).catch(err => {
       console.log("on error login in", err)
     })
   }

   _onRenderForgotPassword = () => {
     return (
       <View style={styles.flexElement}>
       <View style={styles.linesView}>
         <Text style={styles.headline}>LOST PASSWORD</Text>
         <Text style={styles.subline}>Input your e-mail{"\n"}to reset your password</Text>
       </View>
       <View style={{marginTop: 10}}>
         <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "E-mail or username"
               placeholderTextColor = "#666"
               autoCapitalize = "none"
               onChangeText={(text) => this.setState({email: text})}/>
       </View>
       <View style = {{marginTop: 3}}>
         <TouchableHighlight style={{borderRadius: 10, margin: 10, height: 50, backgroundColor: 'rgba(0,0,0,.4)', width: ancho - 20}}>
               <Text style={styles.headlineAuth, {color: '#fff', justifyContent: 'center', alignSelf: 'center', margin: 13, fontSize: 18}}>
               Reset password
               </Text>
         </TouchableHighlight>
       </View>
      </View>
      );
   }
   _onRenderLogin = () => {
     return (
       <View style={styles.flexElement}>
       <View style={styles.linesView}>
         <Text style={styles.headline}>SIGN IN</Text>
         <Text style={styles.subline}>Welcome back.{"\n"}Enter your data below.</Text>
       </View>
       <View style={{marginTop: 10}}>
         <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Username"
               placeholderTextColor = "#666"
               autoCapitalize = "none"
               onChangeText={(text) => this.setState({username: text})}/>
       </View>
       <View style = {{marginTop: 8}}>
         <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               placeholderTextColor = "#666"
               autoCapitalize = "none"
               onChangeText={(text) => this.setState({password: text})}/>
       </View>
       <View style = {{marginTop: 3}}>
         <TouchableHighlight 
         onPress={() => this._onLogin()}
         style={{borderRadius: 10, margin: 10, height: 50, backgroundColor: 'rgba(0,0,0,.4)', width: ancho - 20}}>
               <Text style={styles.headlineAuth, {color: '#fff', justifyContent: 'center', alignSelf: 'center', margin: 13, fontSize: 18}}>Sign In</Text>
         </TouchableHighlight>
       </View>
       <View style = {{marginTop: 8}}>
         <Button color="rgba(255,255,255,.4)"
               onPress={() => this.setState({statusTab: 'forgot', heightContainer: 290})}
               title="Forgot password?"/>
       </View>
      </View>
      );
   }
   _onRenderRegister = () => {
     return (
       <View style={styles.flexElement}>
       <View style={styles.linesView}>
         <Text style={styles.headline}>SIGN UP TODAY</Text>
         <Text style={styles.subline}>Get access to marvelous features{"\n"}that will help you through</Text>
       </View>
       <View style={{marginTop: 8}}>
         <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "First name"
               placeholderTextColor = "#666"
               autoCapitalize = "none"
               onChangeText={(text) => this.setState({first_name: text})}/>
       </View>
       <View style={{marginTop: 8}}>
         <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Last name"
               placeholderTextColor = "#666"
               autoCapitalize = "none"
               onChangeText={(text) => this.setState({last_name: text})}/>
       </View>
       <View style={{marginTop: 0}}>
         <TextInput style = {[styles.input, {marginTop: 10}]}
               underlineColorAndroid = "transparent"
               placeholder = "E-mail"
               placeholderTextColor = "#666"
               autoCapitalize = "none"
               onChangeText={(text) => this.setState({email: text})}/>
       </View>
       <View style = {{marginTop: 10}}>
         <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               placeholderTextColor = "#666"
               autoCapitalize = "none"
               onChangeText={(text) => this.setState({password: text})}/>
       </View>
       <View style = {{marginTop: 3}}>
         <TouchableHighlight 
           onPress={() => this._onRegister()}
           style={{borderRadius: 10, margin: 10, height: 50, backgroundColor: 'rgba(0,0,0,.4)', width: ancho - 20}}>
               <Text style={styles.headlineAuth, {color: '#fff', justifyContent: 'center', alignSelf: 'center', margin: 13, fontSize: 18}}>Register</Text>
         </TouchableHighlight>
       </View>
       <View style = {{marginTop: 8}}>
         <Button color="rgba(255,255,255,.4)"
               title="Forgot password?"
               onPress={() => this.setState({statusTab: 'forgot', heightContainer: 290})}
               />
       </View>
      </View>
      );
   }

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
    return (
      <LinearGradient
        style={[styles.mainContent, {
          width: ancho,
          height: alto,
        }]}
        colors={['#333', '#222']}
        start={{x: 0, y: .1}} end={{x: .1, y: 1}}
      >
      
      <View style={styles.container}>

      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        paginationStyle={{bottom: 0}}
        showSkipButton={false}
        showPrevButton={false}
        showNextButton={false}
        showDoneButton={false}
      />


        <TouchableOpacity 
        onPress={() => this.setState({isOpen: true, statusTab: 'login'})}
        style={[styles.twoColumnsButton, {left: 8, bottom: 50, backgroundColor: '#000'}]}>
              <Text 
              style={styles.twoColumnsText}
              >Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={() => this.setState({isOpen: true, statusTab: 'register'})}
        style={[styles.twoColumnsButton, {right: 8, bottom: 50}]}>
              <Text style={styles.twoColumnsText}>Register</Text>
        </TouchableOpacity>
       </View>
        
          
      <Modal 
        style={[styles.sessionContainer, {height: alto}]} 
        isVisible={this.state.isOpen}
        animationIn={'fadeIn'}
        hasBackdrop={false}
        onSwipeComplete={() => this.setState({ isOpen: false })}
        swipeDirection="down"
        swipeThreshold={90} >
          <View style={{zIndex: 99, flex: 1, marginTop: this.state.statusTab == 'register' ? alto / 4 : alto / 3}}>

            {this.state.statusTab == 'login' && this._onRenderLogin()}
            {this.state.statusTab == 'register' && this._onRenderRegister()}
            {this.state.statusTab == 'forgot' && this._onRenderForgotPassword()}
           <Row size={12} style={{position:'absolute', bottom: 0, left:0, right:0}}>
            <Col sm={6} md={4} lg={3}>
              <TouchableHighlight onPress={() => this.setState({statusTab: 'login', heightContainer: 290})} style={{justifyContent: 'center', alignSelf: 'center', backgroundColor: this.state.statusTab == 'login' ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.1)', width: '95%', borderRadius: 8}}>
               <Text style={[styles.headlineAuth, {color: '#fff', margin: 10}]}>Sign in</Text>
               </TouchableHighlight>
            </Col>
            <Col sm={6} md={4} lg={3}>
              <TouchableHighlight onPress={() => this.setState({statusTab: 'register', heightContainer: 600})} style={{justifyContent: 'center', alignSelf: 'center', backgroundColor: this.state.statusTab == 'register' ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.1)', width: '95%', borderRadius: 8}}>
               <Text style={[styles.headlineAuth, {color: '#fff', margin: 10}]}>Register</Text>
               </TouchableHighlight>

            </Col>
          </Row> 
          </View>
          
          <BlurView
          style={{height: alto, width: ancho, position: 'absolute'}}
          blurType="light"
          blurAmount={10}
        />
        
      </Modal>

      <Toast
                    ref="toast"
                    style={{backgroundColor:this.state.color}}
                    position='center'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />


       
      </LinearGradient>


    );
    }
  }
}

module.exports = SignedOut;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  flexElement: {
    flex: 1,
    alignItems: 'center'
  },
  input: {
      margin: 0,
      height: 50,
      borderColor: 'rgba(255,255,255,.1)',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderWidth: 1,
      width: ancho - 20,
      padding: 10,
      borderRadius: 10,
      fontSize: 16
   },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    fontSize: 17,
    paddingRight: 20,
    paddingLeft: 20
  },
  title: {
    fontSize: 26,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
   btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },
  sessionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  headlineAuth: {
    fontSize: 17,
    justifyContent: 'center', alignSelf: 'center'
  },
  twoColumnsButton: {
    height: 60, 
    width: (ancho / 2) - 10, 
    position: 'absolute',
    backgroundColor: '#dc2c72', 
    borderRadius: 8, 
    alignItems: 'center'
  },
  twoColumnsText: {
    color: '#fff', 
    justifyContent: 'center', alignSelf: 'center',
    marginLeft: 0, 
    marginTop: 18, 
    fontSize: 20, 
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 4
  },
  forgotPassword: {
    color: '#fff'
  },
  buttonSend: {
    color: '#fff',
    backgroundColor: '#111',
    borderRadius: 10
  },
  headline: {
    fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        color: '#fff'
  },
  subline: {
    fontSize: 12,
    letterSpacing: 0.5,
    fontSize: 13,
    color: 'rgba(255,255,255,.4)'
  },
  linesView: {
    textAlign: 'left',
    width: '90%',
    alignItems: 'stretch'

  }
});
