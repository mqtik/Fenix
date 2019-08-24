import React, {Component} from 'react';
import {Platform, StyleSheet, AsyncStorage, Text, TextInput, View, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, NetInfo, Dimensions, RefreshControl } from 'react-native';
import { SearchBar, Button } from 'react-native-elements';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, GOOGLE_API_KEY } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import MapViewNavigation, { NavigationModes, TravelModeBox, TravelIcons, Geocoder, TravelModes, DirectionsListView, ManeuverView, DurationDistanceView } from 'react-native-maps-navigation';
import styles, { colors } from '../styles/index.style';
import { mapStyle, mapNavigation } from '../styles/map.style';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getLang, Languages } from '../static/languages';
import RenderBusiness from './renderBusiness';
import Placeholder, { Line, Media } from "rn-placeholder";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import BottomDrawer from '../../libraries/drawer';
import API from '../services/api';
import {Column as Col, Row} from 'react-native-flexbox-grid';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

const Remote = new API({ url: API_URL })
let ApplicationStorage = PouchDB(LOCAL_DB_NAME);

export default class NavThroughMap extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
          const { params = {} } = navigation.state;
          var value = null;
        return {
          //Default Title of ActionBar
            //Background color of ActionBar
            
            


          //Text color of ActionBar
        };
      };
  constructor(props){
    super(props);
    this.state = {
      navigationMode: NavigationModes.IDLE,
      travelMode: TravelModes.DRIVING,
      isFlipped: false,
            isNavigation: false,
            route: false,
            step: false,
    }
  }
  componentDidMount(){
    console.log("Nav through map prop", this.props)
    console.log("Key map through", this.props.navigation.state.params._key)
    console.log("Region map through", this.props.navigation.state.params._region)
  }
  render() {
    return (
          <View>
          <Row size={12} style={{marginTop: 15}}>
          <Col sm={2} md={2} lg={2} style={{justifyContent: 'center'}}>
              <Button
                  style={{width: '95%', alignSelf: 'center'}}
                  buttonStyle={{borderWidth: 0, backgroundColor: 'transparent'}}
                  onPress={() => this.props.navigation.goBack()}
                  type="outline"
                  icon={
                    <EntypoIcono
                      name="chevron-left"
                      size={30}
                      color="white"
                      style={{marginRight: 10}}
                    />
                  }
                />
            </Col>
            <Col sm={5} md={5} lg={5} style={{justifyContent: 'center'}}>
              <Button
                style={{width: '95%', alignSelf: 'center'}}
                buttonStyle={{borderColor: '#ffffff', color: '#ffffff'}}
                titleStyle={{color: '#ffffff'}}
                onPress={() => this.props.screenProps.goDisplayRoute( this.props.navigation.state.params._key.address)}
                type="outline"
                icon={
                  <EntypoIcono
                    name="address"
                    size={15}
                    color="white"
                    style={{marginRight: 10}}
                  />
                }
                title="Show route"
              />
            </Col>
            <Col sm={5} md={5} lg={5} style={{justifyContent: 'center'}}>
              <Button
                  style={{width: '95%', alignSelf: 'center'}}
                  buttonStyle={{borderColor: '#fff', backgroundColor: '#333'}}
                  onPress={() => this.props.screenProps.goNavigateRoute()}
                  icon={
                    <EntypoIcono
                      name="drive"
                      size={15}
                      color="white"
                      style={{marginRight: 10}}
                    />
                  }
                  title="Drive"
                />
            </Col>

          </Row> 

                    <Row size={12} style={{marginTop: 15}}>
            <Col sm={3} md={3} lg={3} style={{justifyContent: 'center'}}>
              <Transition key={this.props.navigation.state.params._key.logo.small} shared={this.props.navigation.state.params._key.logo.small}>
              <Image
                style={{height: 50, width: 60, borderRadius: 10, alignSelf: 'center'}}
                source={{uri: this.props.navigation.state.params._key.logo.small}}
              />
            </Transition>
            </Col>
            <Col sm={6} md={6} lg={6} style={{justifyContent: 'center'}}>
               <Text style={{fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'}}>
               {this.props.navigation.state.params._key.name}
               </Text>
            </Col>

          </Row> 
          
          
          {this.props.screenProps._returnDirections()}        
          </View>
        )
  }
}