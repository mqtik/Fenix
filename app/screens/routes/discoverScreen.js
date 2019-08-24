import React, {Component} from 'react';
import {Platform, StyleSheet, AsyncStorage, Text, TextInput, View, Button, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, NetInfo, Dimensions, RefreshControl, Animated, PanResponder } from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';

import { sliderWidth, itemWidth } from '../../styles/SliderEntry.style';
import SliderEntry from '../../components/SliderEntry';
import styles, { colors } from '../../styles/index.style';

import { getLang, Languages } from '../../static/languages';
//import * as Progress from 'react-native-progress';
import SearchScreen from './searchScreen.js';

import Placeholder, { Line, Media } from "rn-placeholder";

const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';
import {
    CachedImage,
    ImageCacheProvider
} from 'react-native-cached-image';
import Modal from 'react-native-modalbox';
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME, {auto_compaction: true});
const SLIDER_1_FIRST_ITEM = 1;

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

   
export default class DiscoverScreen extends Component<Props> {
  
   constructor (props) {
        super(props);

        const {height, width} = Dimensions.get('window');

    const initialPosition = {x: 0, y: height - 70}
    const position = new Animated.ValueXY(initialPosition);

    const parentResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e, gestureState) => {
        return false
      },
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (e, gestureState) =>  {
        if (this.state.toTop) {
          return gestureState.dy > 6
        } else {
          return gestureState.dy < -6
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (evt, gestureState) => {
        let newy = gestureState.dy
        if (this.state.toTop && newy < 0 ) return
        if (this.state.toTop) {
          position.setValue({x: 0, y: newy});
        } else {
          position.setValue({x: 0, y: initialPosition.y + newy});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.toTop) {
          if (gestureState.dy > 50) {
            this.snapToBottom(initialPosition)
          } else {
            this.snapToTop()
          }
        } else {
          if (gestureState.dy < -90) {
            this.snapToTop()
          } else {
            this.snapToBottom(initialPosition)
          }
        }
      },
    });

    this.offset = 0;
    this.parentResponder = parentResponder;

        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            indexName: null,
            docs: null,
            isLoading: true,
            booksOffline: null,
            connection_Status : "online",
            modalVisible: false,
            smartLoading: true,
            refreshing: false,
            position, 
            toTop: false
        };
        this._onDocPress = this._onDocPress.bind(this);
        this._renderDocs = this._renderDocs.bind(this);
    }
    componentDidMount(){
      // Create Index

      this._syncDocs();
      this._renderDocs();
      this.setState({smartLoading: false});
      _this = this;
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

    snapToTop = () => {
        Animated.timing(this.state.position, {
          toValue: {x: 0, y: 0},
          duration: 300,
        }).start(() => {});
        this.setState({ toTop: true })
      }

      snapToBottom = (initialPosition) => {
        Animated.timing(this.state.position, {
          toValue: initialPosition,
          duration: 150,
        }).start(() => {});
        this.setState({ toTop: false })
      }

      hasReachedTop({layoutMeasurement, contentOffset, contentSize}){
        return contentOffset.y == 0;
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

    _syncDocs = event => {
      APIBooks.replicate.to(APILocal, {
        filter: function (doc) {
          return doc.public === true && doc.language == getLang();
        }
      }).then(res => {
          APILocal.allDocs({
            include_docs: true,
            attachments: true
          }).then(result => {
            var doks = result.rows.map(function (row) { return row.doc; });  
            
            /*AsyncStorage.getAllKeys((err, keys) => {
                  AsyncStorage.multiGet(keys, (error, stores) => {
                    stores.map((result, i, store) => {
                      console.log({ [store[i][0]]: store[i][1] });
                      return true;
                    });
                  });
                });*/

            this._renderDocs();
          }).catch(err => {
            //console.log(err);
          
          });
          
      });
      
      
    }



    _onRefresh = () => {
      this.setState({refreshing: true});
      this._renderDocs();
    }
    _renderDocs = event => {

         APILocal.allDocs({
            include_docs: true,
            attachments: true
          }).then(result => {
            let doks = result.rows.map(function (row) { return row.doc; });  
            let tags = "";
            let covers = [];
            for(let x = 0; x < doks.length; x++){
              covers.push(doks[x].cover);
              tags += doks[x].tags+', ';
            }
            
            this.setState({covers: covers})
            let booksOffline = _.filter(doks, function(item){
                            if(item.offline){
                                             return item.offline == true;
                                         }
                         });

            let counts = tags.split(', ').reduce(function(map, word){
                            if(word != null && word != 'undefined' && word != ''){

                              map[word] = (map[word]||0)+1;
                            }
                            return map;
                          }, Object.create(null));
            this.setState({ docs: doks, offlineBooks: booksOffline, smartLoad: counts, smartLoadCounts: _.keys(counts).length, isLoading: false, refreshing: false})
            

          
          }).catch(err => {
            //console.log(err);
              return null;
          });
        /*APIBooks.createIndex({
                  index: {
                    ddoc: 'BooksIndex',
                    fields: ['_id', 'title', 'description', 'public', 'author', 'language', 'published_at', 'created_at', 'updated_at', 'path', 'cover']
                  }
                }).then(result => {
                  console.log("index result", result.id)
                   APIBooks.find({
                        selector: {_id: {"$gte": null}, public: {'$exists': true}},
                        fields: ['_id', 'title', 'description', 'public', 'author', 'language', 'published_at', 'created_at', 'updated_at', 'path', 'cover'],
                        use_index: result.id
                    }).then(res => {
                        //console.log('find - result ' + result);
                        //console.log(JSON.stringify(res));

                       // console.log('JSON' + JSON.stringify(result, undefined, 2));

                        //console.log(res);
                        this.setState({docs: res.docs})

                    }).catch(err => {
                        console.log('find - err ', err);
                    });

                  
                }).catch(errIndex => {
                  // ouch, an error
                  console.log("The index had a problem creating", errIndex);
                }); */
    }


    _onDocPress  = () => {
      this.props.navigation.navigate('Settings');
    }


    _renderPerBook = (item, index) => {
        return (
            <SliderEntry key={index} data={item} even={(index + 1) % 2 === 0} navigation={this.props.navigation} />
            );
    }

    _renderItemWithParallax = ({item, index}, parallaxProps) => {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallaxProps={parallaxProps}
              navigation={this.props.navigation}
            />
        );
    }

    mainExample (books, number, title) {
        const { slider1ActiveSlide, docs } = this.state;
        const isEven = number % 2 === 0;
        if(books && books.length){
                //console.log("Docs!", docs)
                //console.log("docs length", this.state.docs.length)
              
        return (
            <View style={[styles.exampleContainer, isEven ? styles.exampleContainerDark : styles.exampleContainerLight]} key={title}>
                <Text style={[styles.title, isEven ? {} : styles.titleDark]}>{`${title}`}</Text>
                <Text style={[styles.subtitle, isEven ? {} : styles.subtitleDark]}>{books.length} {Languages.booksFound[getLang()]}</Text>
                 {/*<Carousel
                  ref={c => this._slider1Ref = c}
                  data={books}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={false}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={20}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={true}
                  autoplay={false}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />*/}

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollViewBooks}>
                    {books.map((key, i) => {
                          for(let k in key){
                            //console.log("Books map", key, i)
                            return (
                              this._renderPerBook(key, i)
                              )
                          }
                        })}
                </ScrollView>
              
                {/*<Pagination
                  dotsLength={this.state.docs.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />*/}
            </View>
        );
      }
    }

    get gradient () {
        return (
            <LinearGradient
              colors={[colors.background1, colors.background1, colors.background2]}
              startPoint={{ x: 1, y: 0 }}
              endPoint={{ x: 0, y: 1 }}
              style={styles.gradient}
            />
        );
    }
    _renderOffline = () => {
      if(this.state.offlineBooks != null){
        if(this.state.smartLoading == true) {
                            this.setState({smartLoading: false});
                          }
        return this.mainExample(this.state.offlineBooks, '1', 'Offline');
      }

    }
    _renderOnline = () => {
 
        let x = 0;
        let example = [];
        for(let key in this.state.smartLoad){
          if(this.state.smartLoad[key] > 5){
            let docresult = _.filter(this.state.docs, function(doc){
              if(doc.tags){
                return doc.tags.toLowerCase().includes(key.trim().toLowerCase()) == true;
              }
             });
            example.push({[key.trim()]:docresult});
          }    
        }

        return (
          <View>
          {this.state.offlineBooks != null && this.mainExample(this.state.offlineBooks, '0', Languages.continueReading[getLang()])}
          <View style={{backgroundColor: '#fff', flex: 1, color: '#000'}}>
            {this.mainExample(this.state.docs, '1', Languages.lastBooks[getLang()])}
            </View>

          {example.map((key, i) => {
                          for(let k in key){
                            return (

                            this.mainExample(key[k], i, k)
                            )
                          }
                          if(this.state.smartLoading == true) {
                            this.setState({smartLoading: false});
                          }
                          
                        })}


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

     const {height} = Dimensions.get('window');

    if (this.state.isLoading == true && this.state.docs != null) {
      return (
        <Placeholder
          isReady={false}
          animation="fade"
          renderLeft={() => <Media hasRadius />}
          renderRight={() => <Media />}
        >
          <Line width="70%" />
          <Line />
          <Line />
          <Line width="30%" />
        </Placeholder>
        )
    } else {
        return (
            
               
                    <ScrollView
                      style={styles.scrollview}
                      scrollEventThrottle={200}
                      directionalLockEnabled={true}
                      refreshControl={
                          <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                          />
                        }
                    >
                      
                      {this.state.connection_Status === 'online' && this._renderOnline()}
                      {this.state.connection_Status === 'offline' && this._renderOffline()}
                        {this.state.connection_Status === 'offline' && 
                          <View style={{margin: 20}}>
                            <Icono name="ios-radio" style={{color: '#fff', fontSize: 40, textAlign: 'left', marginTop: 10}} />
                            <Text style={{fontSize: 20, color: '#fff', textAlign: 'left', marginLeft: 50, marginTop: -40}}>{Languages.noInternetConnection[getLang()]}</Text>
                            <Text style={{fontSize: 16, color: '#999', textAlign: 'left', marginLeft: 50, marginTop: 0}}>{Languages.noInternetConnectionSubtitle[getLang()]}</Text>
                         </View>
                        }
          
                       
                    </ScrollView>
               
        );
    }
    }
}