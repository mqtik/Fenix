import React, { Component } from 'react'
import { CLIENT_SECRET, CLIENT_ID, LOCAL_DB_NAME } from 'react-native-dotenv'
import moment from 'moment';
import PouchDB from 'pouchdb-react-native'
import APIUpsert from 'pouchdb-upsert'
PouchDB.plugin(APIUpsert);
let ApplicationStorage = PouchDB(LOCAL_DB_NAME);

class API {
  constructor({url}){
    __DEV__ && console.log("Constructing API", url)
    this.url = url;
    this.endpoints = {};
    this.access_token = null;
  }

  /**
   * Log in
   * @param {username} string
   * @param {password} string
   **/
   Business(){
     return {
       list: () => {

         let data = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+this.access_token,
              'Content-Type': 'application/json',
            }
          }
          console.log("data business", data)
          return fetch(this.url +'/business', data)
                .then(response => response.json());
       }
     }
   }
   /**
   * Auth
   * @returns functions 
   **/
   Auth() {
    return {
      /**
       * Log in
       * @param {username} string
       * @param {password} string
       **/
      signIn: (email, password) => {
          let data = {
            method: 'POST',
            body: JSON.stringify({
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              grant_type: 'password',
              username: email,
              password: password
            }),
            headers: {
              'Content-Type': 'application/json',
            }
          }
          console.log("URL:", this.url +'/oauth/token')
          return fetch(this.url +'/oauth/token', data)
                  .then(response => response.json());
      },
      /**
       * Sign Up
       * @param {first_name} string
       * @param {last_name} string
       * @param {email} string
       * @param {password} string
       **/
      signUp: (first_name, last_name, email, password) => {
          let data = {
            method: 'POST',
            body: JSON.stringify({
              categories: '1,2',
              first_name: first_name,
              last_name: last_name,
              email: email,
              zip: '0000',
              timezone: 'America/Los_Angeles',
              email_confirmation: email,
              password: password,
              password_confirmation: password,
              registration_date: moment().format('YYYY-MM-DD')
            }),
            headers: {
              'Accept':       'application/json',
              'Content-Type': 'application/json',
            }
          }
          return fetch(this.url +'/oauth/register', data)
                  .then(response => response.json());
      },
      /**
       * Get information about user on API
       **/
      me: () => {
          let data = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+this.access_token,
              'Content-Type': 'application/json',
            }
          }
          console.log("data of", data)
          return fetch(this.url +'/me', data)
                  .then(response => response.json());
      },
      /**
       * Set access token
       * @param {response} object
       * @param {access_token} item
       * @param {token_type} item
       * @param {expires_in} item
       **/
      setAccessToken: (response) => {
        return ApplicationStorage.upsert('UserData', doc => {
                     this.access_token = response.access_token;
                      doc.token_type = response.token_type;
                      doc.expires_in = response.expires_in
                      doc.access_token = response.access_token;
                      return doc;
                    });
      },
      /**
       * Get information about user stored in app
       * @returns object
       **/
      getMeOffline: () => {
        return ApplicationStorage.get('UserData');
      },
      /**
       * Check if user is logged in
       * @returns boolean
       **/
      checkIfLoggedIn: () => {
        return ApplicationStorage.get('UserData')
        .then(res => {
          console.log("Check if logged in", res)
          this.access_token = res.access_token;
          return true;
        })
        .catch(err => {
          console.log("checkIfLoggedIn: Error: ", err)
          return false;
        })
      },
      /**
       * Save data
       * @param {data} object
       * @param {email} item/string
       * @param {last_name} item/string
       * @param {first_name} item/string
       * @param {identifier} item/integer
       * @param {type} item/string
       **/
      saveMe: (data) => {
        console.log("save me!", data)
        return ApplicationStorage.upsert('UserData', doc => {
                     
                      doc.email = data.email;
                      doc.first_name = data.name
                      doc.last_name = data.last_name;
                      doc.identifier = data.id;
                      doc.type = data.type;
                      return doc;
                    });
      },
      /**
       * Log out user from API
       * @returns boolean
       **/
      signOut: () => {
        return ApplicationStorage.destroy();
      },
      update: (toUpdate) =>  axios.put(url,toUpdate),
      create: (toCreate) =>  axios.put(url,toCreate),
      delete: ({ id }) =>  axios.delete(`${url}/${id}`)
    }
  }

}

export default API;