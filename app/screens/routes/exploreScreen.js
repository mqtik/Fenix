import React, {Component} from 'react';
import {Platform, StyleSheet, AsyncStorage, Text, TextInput, View, Button, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, NetInfo, Dimensions, RefreshControl, Animated, Easing } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, GOOGLE_API_KEY } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import { createBottomTabNavigator, createStackNavigator, createAppContainer, HeaderBackButton, NavigationActions, StackActions } from 'react-navigation';
import MapViewNavigation, { NavigationModes, TravelModeBox, TravelIcons, Geocoder, TravelModes, DirectionsListView, ManeuverView, DurationDistanceView } from '../../../libraries/navigation';
import styles, { colors } from '../../styles/index.style';
import { mapStyle, mapNavigation } from '../../styles/map.style';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getLang, Languages } from '../../static/languages';
import RenderBusiness from '../../components/renderBusiness';
import PlacesList from '../../components/placesList';
import NavThroughMap from '../../components/navThroughMap';
import Placeholder, { Line, Media } from "rn-placeholder";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import BottomDrawer from '../../../libraries/drawer';
import API from '../../services/api';
import HeaderFX from '../../components/header.js';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import MapboxGL from "../../../libraries/maps";

MapboxGL.setAccessToken("pk.eyJ1IjoibXF0aWsiLCJhIjoiY2p3dHF3eTA2MDBhaTN5bjFlZGFqaTA5YSJ9.qAJov0scyli5soiyi6-YUg");

const Remote = new API({ url: API_URL })
let ApplicationStorage = PouchDB(LOCAL_DB_NAME);

const TAB_BAR_HEIGHT = 49;
const USE_METHODS = true;
const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';
import {
    CachedImage,
    ImageCacheProvider
} from 'react-native-cached-image';
import Modal from 'react-native-modalbox';
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

const NavigatorScreen = FluidNavigator({
           Places: {screen: PlacesList},
           Go: {screen: NavThroughMap}
          });
const NavigationContainer = createAppContainer(NavigatorScreen);

export default class ExploreScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
          const { params = {} } = navigation.state;
          var value = null;
        return {
          //Default Title of ActionBar
            //Background color of ActionBar
            
            


          //Text color of ActionBar
        };
      };
   constructor (props) {

        super(props);

        this.state = {
            isLoading: false,
            connection_Status : "online",
            modalVisible: false,
            smartLoading: true,
            refreshing: false,
            businessList: null,
            region: {
                latitude: -31.634424,
                longitude: -60.694297,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
            markers: null,

            origin: {latitude: -31.634393, longitude: -60.694383},

            home: {latitude: -31.634494, longitude: -60.694395}, // chacabuco cowork
            currentLocation: {latitude: -31.639645, longitude: -60.685771}, // velez sarsfield & boulevard galvez
            school: {latitude: -31.625888, longitude: -60.681192}, // avellaneda school // costenera
            homeMarker: { 
                  id: 'Home', 
                  title: 'Mi casa', 
                  description: 'Chacabuco 1880', 
                  coordinate: {
                    latitude: -31.634494,
                    longitude: -60.694395
                  }
                },
            currentMarker: { 
                  id: 'Here', 
                  title: 'Aquí estás', 
                  description: '', 
                  coordinate: {
                    latitude: -31.639645, 
                    longitude: -60.685771
                  }
                },

             schoolMarker: { 
                  id: 'school', 
                  title: 'Escuela', 
                  description: 'El FARO', 
                  coordinate: {
                    latitude: -31.625888, 
                    longitude: -60.681192
                  }
                },
            destination: '132 Wilmot St, San Francisco, CA 94115',
            navigationMode: NavigationModes.IDLE,
            travelMode: TravelModes.DRIVING,
            isFlipped: false,
            isNavigation: false,
            route: false,
            step: false,
            isContentLoaded: false
        };
        

        
    }
    componentDidMount(){
      // Create Index
    /*this.watchID = navigator.geolocation.watchPosition((position) => {
      // Create the object to update this.state.mapRegion through the onRegionChange function
      let region = {
        latitude:       position.coords.latitude,
        longitude:      position.coords.longitude,
        latitudeDelta:  0.00922*1.5,
        longitudeDelta: 0.00421*1.5
      }
      this.setState({origin: {latitude: position.coords.latitude, longitude: position.coords.longitude}})
      this.onRegionChange(region, region.latitude, region.longitude);
    }, (error)=>console.log(error));*/
      MapboxGL.setTelemetryEnabled(false);
      Remote.Auth().checkIfLoggedIn().then(bool => {
            Remote.Business().list().then(res => {
              let markers = res.data.map(function (row) { 
                let marker = { id: row.id, 
                  title: row.name, 
                  description: row.address, 
                  coordinate: {
                    latitude: row.latitude, 
                    longitude: row.longitude
                  }
                } 
                return marker; 
              });
              console.log("markers!", markers)
            this.setState({businessList: res, loadBusiness: true, isLoading: true})
            this.setState({markers: [...markers]})
           
            //this.drawer.setDrawerState(0)
            //this.drawer.toggleDrawerState()
          })
        })

       NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
     
        );
       
        NetInfo.isConnected.fetch().done((isConnected) => {
          if(isConnected == true)
          {
            this.setState({connection_Status : "online"})
          }
          else
          {
            this.setState({connection_Status : "offline"})
          }
     
        });
    }

  componentWillUnmount() {
     NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
      );
  }

   _handleConnectivityChange = (isConnected) => {
      if(isConnected == true)
        {
          this.setState({connection_Status : "online"})
        }
        else
        {
          this.setState({connection_Status : "offline"})
        }
    };
    onRegionChange = region => {
      console.log("bottom drawe", this.drawer.getCurrentPosition())

      if(this.drawer.getCurrentPosition() == 1){
        //this.drawer.setDrawerState(0)
      }
            let tempCoords = {
                latitude: Number(region.latitude),
                longitude: Number(region.longitude),
                latitudeDelta: 0.5,
                longitudeDelta: 0.5 * (ancho / alto)
            }
            //this._map.animateToRegion(tempCoords, 100);
            //this._map.animateToCoordinate(tempCoords, 2000);
      //this.setState({ region });
    }
    onScrolling = () => {
      if(this.drawer.getCurrentPosition() == 0){
        this.drawer.setDrawerState(1)
      }
            //this._map.animateToCoordinate(tempCoords, 2000);
      //this.setState({ region });
    }
    _onMapDragging = () => {
      if(this.drawer.getCurrentPosition() == 1){
        this.drawer.setDrawerState(0)
      }
            //this._map.animateToCoordinate(tempCoords, 2000);
      //this.setState({ region });
    }
    
    _onRefresh = () => {
      this.setState({refreshing: true});
    }
    
    _renderOffline = () => {
      if(this.state.offlineBooks != null){
        if(this.state.smartLoading == true) {
                            this.setState({smartLoading: false});
                          }
      }

    }
    _fireIfItsReady = () => {
      this.setState({isContentLoaded: true});
      this.drawer.setDrawerState(0)
    }
    _lowerDrawer = () => {
      this.drawer.setDrawerState(0)
    }
    _upperDrawer = () => {
      this.drawer.setDrawerState(1)
    }
    _getStepNavigation = () => {
      return this.state.step;
    }
    renderContent = () => {
      if(this.state.isLoading != false){
        return (
          <View style={{width: '100%', height: '100%', zIndex: 99, backgroundColor: 'transparent'}}>
          <MaterialIcons name="drag-handle" style={{color: 'rgba(255,255,255,.4)', fontSize: 20, position: 'absolute', alignSelf: 'center', marginTop: -3, top: 0}} />
            <NavigationContainer 
              style={{width: '100%', height: alto, backgroundColor: 'transparent'}}
              screenProps={{ 
                loadBusiness: this.state.loadBusiness, 
                goDisplayRoute: this.goDisplayRoute.bind(this), 
                goNavigateRoute: this.goNavigateRoute.bind(this), 
                onScrolling: this.onScrolling.bind(this), 
                businessList: this.state.businessLists,
                onRegionChange: this.onRegionChange.bind(this),
                _lowerDrawer: this._lowerDrawer.bind(this),
                _upperDrawer: this._upperDrawer.bind(this),
                _returnDirections: this._returnDirections.bind(this)
              }}
           />
          </View>
        ) 
      } else {
        return (
          <ActivityIndicator
              style={[styles.indicator, {zIndex: 99}]}
              color="#fff"
              size="large"
            />
        )
      }
         
      }

    /**
     * goDisplayRoute
     * @void
     */
    goDisplayRoute = (destination) => {
      this.setState({destination: destination})
         if(!this.validateRoute()) return;

        // There are two ways to display a route - either through the method
        // displayRoute or by setting the props.
        // The difference is that you get instant feedback when using methods vs props.

        if(USE_METHODS) {

            this.refNavigation.displayRoute(
                this.state.origin,
                this.state.destination,
                {
                    mode: this.state.travelMode
                }
            ).then(route => {
                console.log(route);
            });

        } else {

            this.setState({
                navigationMode: NavigationModes.ROUTE,
            });
        }
    }

    /**
     * goNavigateRoute
     * @void
     */
    goNavigateRoute = () => {
      
        if (!this.validateRoute()) return;

        // There are two ways to navigate a route - either through the method
        // navigateRoute or by setting the props.
        // The difference is that you get instant feedback when using methods vs props.

        if (USE_METHODS) {

            this.refNavigation.navigateRoute(
                this.state.origin,
                this.state.destination,
                {
                    mode: this.state.travelMode
                }
            ).then(route => {
                this.setState({
                    isNavigation: true
                })
            });

        } else {

            this.setState({
                navigationMode: NavigationModes.NAVIGATION,
            });
        }
    }
     
      /**
     * validateRoute
     * @returns {boolean}
     */
    validateRoute = () => {
        if(this.state.destination.length >= 3) return true;

        Alert.alert('Address required', 'You need to enter an address first');

        return false;
    }

    _returnDirections = () => {
      return (
        <View>
                    <TravelModeBox
                          onChange={travelMode => this.setState({travelMode})}
                          inverseTextColor={'#000'}
                          color={'#fff'}
                          backgroundColor={'rgba(255,255,255,.4)'}
                          borderWidth={1}
                      />
                       <ManeuverView
                              step={this.state.step}
                          />
                          </View>
        );
    }
    _renderOnline = () => {
   console.log("MAP STYLE!",mapStyle)

   // https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
   //https://medium.com/@113408/turn-by-turn-navigation-using-react-native-and-mapbox-eb42c79a0a77

   //https://github.com/flyandi/react-native-maps-navigation#readme
        return (
            <View style={styles.container}>
                     <MapView
                     //region={this.state.region}
                     ref={component => this._map = component}
                     style={styles.map}
                     customMapStyle={mapStyle}
                     showsUserLocation={ true }
                     loadingEnabled={true}
                     loadingBackgroundColor={'#fff'}
                     showsCompass={true}
                     onPress={() => this._onMapDragging()}
                     onPanDrag={console.log('')}
                     provider={PROVIDER_GOOGLE}
                     initialRegion={this.state.region}
                     //onMapReady={(map) => this.onRegionChange({latitude: this.state.origin.latitude, longitude: this.state.origin.longitude})}
                      >
                        <MapViewNavigation
                                  origin={this.state.home}
                                  destination={this.state.school}
                                  navigationMode={this.state.navigationMode}
                                  travelMode={this.state.travelMode}
                                  ref={ref => this.refNavigation = ref}
                                  map={() => this._map}
                                  apiKey={GOOGLE_API_KEY}
                                  simulate={false}
                                  onRouteChange={route => this.setState({route})}
                                  onStepChange={(step, nextStep) => this.setState({step, nextStep})}
                                  displayDebugMarkers={false}
                                  onNavigationStarted={route => console.log("Navigation Started")}
                                  onNavigationCompleted={route => this.setState({isNavigation: false})}
                              />
                      </MapView>

                      <View>
                    <BottomDrawer
                          ref={ref => this.drawer = ref}
                          containerHeight={400}
                          downDisplay={300}
                          startUp={true}
                          offset={TAB_BAR_HEIGHT}
                          shadow={false}
                          panResponder={false}
                          style={{position: 'absolute', bottom: 100, left: 0, right: 0,}}
                        >
                          {this.renderContent()}
                        </BottomDrawer>
                        </View>
                </View>
          )
    }
    
    render () {
            
     if(this.state.connection_Status == 'offline'){

        NetInfo.isConnected.fetch().done((isConnected) => {
          if(isConnected == true)
          {
            this.setState({connection_Status : "online"})
          }
        });

     }
     
    if (this.state.isLoading == true && this.state.docs != null) {
      
    } else {
        return (
          <View style={styles.safeArea}>
                <View style={styles.container}>
                  {this.state.connection_Status === 'online' && this._renderOnline()}
                        {this.state.connection_Status === 'offline' && this._renderOffline()}
                        {this.state.connection_Status === 'offline' && 
                          <View style={{margin: 20}}>
                          <Icono name="ios-radio" style={{color: '#fff', fontSize: 40, textAlign: 'left', marginTop: 10}} />
                          <Text style={{fontSize: 20, color: '#fff', textAlign: 'left', marginLeft: 50, marginTop: -40}}>{Languages.noInternetConnection[getLang()]}</Text>
                          <Text style={{fontSize: 16, color: '#999', textAlign: 'left', marginLeft: 50, marginTop: 0}}>{Languages.noInternetConnectionSubtitle[getLang()]}</Text>
                         </View>
                        }
                    <StatusBar
                      translucent={true}
                      backgroundColor={'#333'}
                      barStyle={'light-content'}
                    />
                    
                    
                                       
                </View>
                
            </View>
        );
    }
    }  
}

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};