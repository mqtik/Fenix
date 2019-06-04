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

const Remote = new API({ url: API_URL })
let ApplicationStorage = PouchDB(LOCAL_DB_NAME);

export default class RenderBusiness extends Component<Props>{
    constructor (props) {
        super(props);
    }
    componentDidMount() {

    }
    
    render(){
       
        return(
            <ScrollView style={{height:350}}>
            <TouchableOpacity activeOpacity={1}>
            {this.props.businessList.data.map((key, i) => {
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
            <Col sm={3} md={3} lg={3}>
              <Image
                style={{height: 50, width: 60, borderRadius: 10}}
                source={{uri: key.logo.small}}
              />
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
              <TouchableOpacity onPress={() => this.props.onRegionChange(region)}>
               <Icono name="ios-navigate" style={{color: 'rgba(255,255,255,.5)', fontSize: 30, textAlign: 'right', marginTop: 3}} />
              </TouchableOpacity>
            </Col>
          </Row> 
         </View>
                            )
                          }
                         
                          
                        })}
              </TouchableOpacity>
            </ScrollView>
        );
    }
    
}