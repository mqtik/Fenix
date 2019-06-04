import React, {Component} from 'react';
import {Platform, StyleSheet, AsyncStorage, Text, TextInput, View, Button, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, NetInfo, Dimensions, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';88888
import styles, { colors } from '../../styles/index.style';
import { mapStyle } from '../../styles/map.style';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getLang, Languages } from '../../static/languages';
import RenderBusiness from '../../components/renderBusiness';
import Placeholder, { Line, Media } from "rn-placeholder";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import BottomDrawer from '../../../libraries/drawer';
import API from '../../services/api';

const Remote = new API({ url: API_URL })
let ApplicationStorage = PouchDB(LOCAL_DB_NAME);

const TAB_BAR_HEIGHT = 49;

const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';
import {
    CachedImage,
    ImageCacheProvider
} from 'react-native-cached-image';
import Modal from 'react-native-modalbox';
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height



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
            isLoading: true,
            connection_Status : "online",
            modalVisible: false,
            smartLoading: true,
            refreshing: false,
            loadBusiness: false,
            businessList: null,
            search: '',
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
            markers: null
        };
        
        
    }
    componentDidMount(){
      // Create Index
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
            this.setState({businessList: res, loadBusiness: true})
            this.setState({markers: [...markers]})
           
            this.drawer.setDrawerState(0)
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
        this.drawer.setDrawerState(0)
      }
            let tempCoords = {
                latitude: Number(region.latitude),
                longitude: Number(region.longitude),
                latitudeDelta: 0.5,
                longitudeDelta: 0.5 * (ancho / alto)
            }
            this._map.animateToRegion(tempCoords, 100);
            //this._map.animateToCoordinate(tempCoords, 2000);
      //this.setState({ region });
    }
    updateSearch = search => {
      this.setState({ search });
    };
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
    renderContent = () => {
        return (

          <View style={{position: 'absolute', width: '100%', top: 0, zIndex: 1, padding: 10}}>
          <EntypoIcono name="dots-three-horizontal" style={{color: 'rgba(255,255,255,.4)', fontSize: 30, position: 'absolute', alignSelf: 'center', marginTop: -4, top: 0}} />
          <SearchBar
              placeholder="Search everywhere"
              
              platform="ios"
              cancelButtonTitle="Cancel"
              style={{position: 'absolute', top: 5, left: 5, right: 5}}
              inputStyle={{backgroundColor: 'rgba(255,255,255,.1)'}}
              containerStyle={{flex: 1, backgroundColor: 'transparent', borderWidth: 0, margin:0, padding:0, borderRadius: 5}}
              placeholderTextColor={'#666'}
              onChangeText={this.updateSearch}
              value={this.state.search}
            />
            <KeyboardSpacer />
                <Placeholder
                isReady={this.state.loadBusiness}
                animation="fade"
                lineNumber={5}
                renderLeft={() => <Media style={{width: 70, height: 70, backgroundColor: 'rgba(255,255,255,.4)'}} />}
                whenReadyRender={() => <RenderBusiness onRegionChange={this.onRegionChange.bind(this)} businessList={this.state.businessList}/>}
              >
                <Line width="70%" />
                <Line width="90%"/>
                <Line width="90%"/>
                <Line width="30%" />
              </Placeholder>

          </View>
        )
      }
 
    _renderOnline = () => {
   console.log("MAP STYLE!",mapStyle)

        return (
            <View style={styles.container}>
                
                     <MapView
                     //region={this.state.region}
                     ref={component => this._map = component}
                     style={styles.map}
                     customMapStyle={mapStyle}
                     showsUserLocation={ true }
                     loadingEnabled={true}
                     loadingBackgroundColor={'#333'}
                     provider={PROVIDER_GOOGLE}
                     onMapReady={(map) => console.log("The map is ready")}
                      >
                      { this.state.markers != null && this.state.markers.map((marker:any)  => (  
                            <Marker
                              key={marker.id}
                              coordinate={marker.coordinate}
                              title={marker.title}
                              description={marker.description}
                            />
                            ))
                        }

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
      return (
        <ActivityIndicator
            style={styles.indicator}
            color="#000"
            size="large"
          />
        )
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