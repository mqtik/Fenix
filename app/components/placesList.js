import React, {Component} from 'react';
import {Platform, StyleSheet, AsyncStorage, Text, TextInput, View, Button, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, NetInfo, Dimensions, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements';
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

const Remote = new API({ url: API_URL })
let ApplicationStorage = PouchDB(LOCAL_DB_NAME);

export default class PlacesList extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      search: '',
      loadBusiness: false,
      businessList: null
    }
  }
  componentDidMount() {
    console.log("Properties for placeslist ", this.props)
    Remote.Auth().checkIfLoggedIn().then(bool => {
            Remote.Business().list().then(res => {
              
            this.setState({businessList: res, loadBusiness: true})
            this.drawer.setDrawerState(0)
            //this.drawer.toggleDrawerState()
          })
        })
  }
  updateSearch = search => {
      this.setState({ search });
    };
  render() {
    return (
          <View>
          <TouchableOpacity style={{marginTop: 15}}>
          <SearchBar
              placeholder="Search everywhere"
              
              platform="ios"
              cancelButtonTitle="Cancel"
              style={{position: 'absolute', top: 100, left: 5, right: 5}}

              inputStyle={{backgroundColor: 'transparent', height:50}}
              containerStyle={{flex: 1, height: 50, backgroundColor: 'transparent', borderWidth: 0, margin:0, padding:0, borderRadius: 5}}
              placeholderTextColor={'#666'}
              onChangeText={this.updateSearch}
              value={this.state.search}
            />
          </TouchableOpacity>
            <KeyboardSpacer />
              <Placeholder
                isReady={this.state.loadBusiness}
                animation="fade"
                lineNumber={5}
                renderLeft={() => <Media style={{width: 70, height: 70, backgroundColor: 'rgba(255,255,255,.4)', marginTop: 15, marginLeft: 15}}/>}
                whenReadyRender={() => <RenderBusiness 
                  onScrolling={this.props.screenProps.onScrolling.bind(this)} 
                  onRegionChange={this.props.screenProps.onRegionChange.bind(this)} 
                  businessList={this.state.businessList}
                  navigation={this.props.navigation}
                  goNavigateRoute={this.props.goNavigateRoute}
                  goDisplayRoute={this.props.goDisplayRoute}
                  _lowerDrawer={this.props._lowerDrawer}
                  _upperDrawer={this.props._upperDrawer}
                  _returnDirections={this.props._returnDirections}
                  />
                }
              >
                <Line width="70%" style={{marginTop: 15}}/>
                <Line width="90%"/>
                <Line width="90%"/>
                <Line width="30%" />
              </Placeholder>
          </View>
        )
  }
}