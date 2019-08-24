import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActivityIndicator, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView , Dimensions, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';
import PouchDB from 'pouchdb-react-native'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/docScreen.style';
import { getLang, Languages } from '../static/languages';
import { StretchyHeader } from '../../libraries/stretchy';
import {Column as Col, Row} from 'react-native-flexbox-grid';
import API from '../services/api';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

const Remote = new API({ url: API_URL })
let ApplicationStorage = PouchDB(LOCAL_DB_NAME);
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height
export default class RenderBusiness extends Component<Props>{
    constructor (props) {
        super(props);
    }
    componentDidMount() {
      console.log("Render Business Props", this.props)

    }
    goBusiness = (key, region) => {
      console.log("goBusiness")
      this.props.onRegionChange(region)
      this.props.navigation.navigate('Go', {
        goDisplayRoute: this.props.goDisplayRoute,
        goNavigateRoute: this.props.goNavigateRoute,
        _returnDirections: this.props._returnDirections,
        _region: region,
        _key: key
      })
    }
    render(){
       
        return(
            <ScrollView 
            style={{ height: 400, width:'100%', alignSelf:'stretch' }}
             onScroll={e => this.props.onScrolling()}>
            <TouchableOpacity activeOpacity={1}>
            { this.props.businessList != null && this.props.businessList.data.map((key, i) => {
                          for(let k in key){
                            let region = { 
                              latitude: key.latitude,
                              longitude: key.longitude,
                              latitudeDelta: 0.0922,
                              longitudeDelta: 0.0421,
                            };
                            return (
         <View key={key.name} style={{flex: 1, marginTop: 10, width: '100%'}}>
           <Row size={12}>
            <Col sm={3} md={3} lg={3} style={{justifyContent: 'center'}}>
            <Transition key={key.logo.small} shared={key.logo.small}>
              <Image
                style={{height: 50, width: 60, borderRadius: 10, alignSelf: 'center'}}
                source={{uri: key.logo.small}}
              />
            </Transition>
            </Col>
            <Col sm={7} md={7} lg={7} style={{paddingLeft: 10}}>
               <Text style={{marginTop: 0, fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'left'}}>{key.name}</Text>
        <Text style={{marginTop: 2, fontSize: 13,
        color: '#fff',
        textAlign: 'left'}}>{key.address}</Text>
            </Col>
            <Col sm={2} md={2} lg={2} style={{paddingLeft: 10}}>
              <TouchableOpacity onPress={() => this.goBusiness(key, region)}>
               <Icono name="ios-navigate" style={{color: 'rgba(255,255,255,.5)', fontSize: 30, textAlign: 'right', marginTop: 3, alignSelf: 'center'}} />
              </TouchableOpacity>
            </Col>
          </Row> 
         </View>
                            )
                          }
                         
                          
                        }) }
              </TouchableOpacity>
            </ScrollView>
        );
    }
    
}