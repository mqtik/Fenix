/**
 * Typings SignedIn
 * typings.co
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Header, StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, Animated, Easing, NativeModules } from 'react-native';
import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import PouchDB from 'pouchdb-react-native'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, LOCAL_DB_DRAFTS, LOCAL_DB_CHAPTERS, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import styles, { colors } from '../styles/index.style';
import { createBottomTabNavigator, createStackNavigator, createAppContainer, HeaderBackButton, NavigationActions, StackActions } from 'react-navigation';

// Routes
import DocScreen from './routes/docScreen.js';
import ReaderScreen from './routes/readerScreen.js';
import ExploreScreen from './routes/exploreScreen.js';
import CreatorsScreen from './routes/creatorsScreen.js';
import ChaptersScreen from './routes/creators/chaptersScreen.js';
import ChapterDetailsScreen from './routes/creators/chapterDetailsScreen.js';
import SettingsScreen from './routes/settingsScreen.js';
import HeaderFX from '../components/header.js';
import NavbarBottom from '../components/navbar.js';

// Get API class
import API from '../services/api';

// Languages
import { getLang, Languages } from '../static/languages';

const Remote = new API({ url: API_URL })
let ApplicationStorage = PouchDB(LOCAL_DB_NAME);

const IS_ANDROID = Platform.OS === 'android';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = { navigation: Function }


/*  db.sync('https://'userID':'userPASS'@'serverIP':6984/DBname', {
      live: true
    }).on('change', function (change) {
      console.log(change);
    }).on('error', function (err) {
      console.log(err);
    }).on('complete', function (info) {
      console.log(info);
    });
  }*/

export default class SignedIn extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
         isTabBarVisible: true,
      }
      this.hideTabBar = this.hideTabBar.bind(this);
   }
   hideTabBar() {
      this.setState({ isTabBarVisible: false })
   }

    _onLogout = () => {
          Remote.Auth().signOut().then(res => {
                this.props.navigation.navigate('SignedOut');
                const resetAction = StackActions.reset({
                                      index: 0,
                                      actions: [NavigationActions.navigate({ routeName: 'SignedOut' })]
                                  });
                this.props.navigation.dispatch(resetAction);
          }).catch(err => {
            console.log("Something went wrong", err)
          })
    }
    render() {
      const HomeNavigator = createStackNavigator({
                        Explore:{
                            screen: ExploreScreen,
                            navigationOptions: {
                              header: props => <HeaderFX {...props} />,
                                 headerLeft: null,
                                 title: 'Fénix',
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           }
                        },
                        Details:{
                            screen: DocScreen,
                            navigationOptions: {
                                 title: Languages.Details[getLang()],
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           },
                           headerBackTitle: null
                        },
                        Reader:{
                            screen: ReaderScreen,
                            navigationOptions: {
                                 gesturesEnabled: true,
                                 headerStyle: {
                                    backgroundColor: '#333',
                                    ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
                                 },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                                   headerBackTitle: null
                           }
                        }
                    }, {initialRouteName: 'Explore', headerMode: 'float'});

      const CreatorsNavigator = createStackNavigator({
                        Create:{
                            screen: CreatorsScreen,
                            navigationOptions: {
                              header: props => <HeaderFX {...props} />,
                                 headerLeft: null,
                                 title: Languages.bottomBarCreators[getLang()],
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           }
                        },
                        Chapters:{
                            screen: ChaptersScreen,
                            navigationOptions: {
                              header: props => <HeaderFX {...props} />,
                                 title: Languages.Chapters[getLang()],
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: 'transparent',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           }
                        },
                        ChapterDetails:{
                            screen: ChapterDetailsScreen,
                            navigationOptions: {
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           }
                        }
                    }, {initialRouteName: 'Create'});

      const SettingsNavigator = createStackNavigator({
                        Account:{
                            screen: SettingsScreen,
                            navigationOptions: {
                                 headerLeft: null,
                                 title: Languages.bottomBarSettings[getLang()],
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           },

                        }
                    }, {initialRouteName: 'Account'});

        const TabNavigation = createBottomTabNavigator({
            Library: {
             screen: HomeNavigator,
                 navigationOptions: {
                    tabBarLabel: Languages.bottomBarExplore[getLang()],
                    tabBarIcon: ({ tintColor }) => (
                       <Icono name="ios-git-branch" size={20} style={{color: tintColor}} />
                    )
                  }
             },
            Creators: { 
              screen: CreatorsNavigator,
              navigationOptions: {
                    tabBarLabel:Languages.bottomBarCreators[getLang()],
                    tabBarIcon: ({ tintColor }) => (
                       <EntypoIcono name="flow-cascade" size={20} style={{color: tintColor}} />
                    )
                  }
             },
            Settings: { 
              screen: SettingsNavigator,
              navigationOptions: {
                    tabBarLabel:Languages.bottomBarSettings[getLang()],
                    tabBarIcon: ({ tintColor }) => (
                       <Icono name="ios-git-compare" size={20} style={{color: tintColor}} />
                    )
                  }, 
             }
        },{
            swipeEnabled: true,
            animationEnabled: true,
            tabBarComponent: NavbarBottom,
            tabBarOptions: {
              activeBackgroundColor: 'transparent',
              inactiveBackgroundColor: 'transparent',
              activeTintColor: '#fff',
              inactiveTintColor: '#ccc',
              style: {
                backgroundColor: 'transparent',
              }
            }
        });
        const MainNavigator = createAppContainer(TabNavigation);
        // return (
        //     <View style={styles.container}>
        //       <MainNavigator/>
        //     </View>
        // );

        return <MainNavigator screenProps={{ onLogout: this._onLogout }}/>
    }
}

module.exports = SignedIn;

