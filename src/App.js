/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, AsyncStorage, Alert } from 'react-native';

import { Root } from "native-base";

import SplashScreen from 'react-native-splash-screen';

import { Provider } from 'react-redux'
import configureStore from '../src/store/configureStore'
import HireApp from '../src/Navigations/AppNavigator'

import firebase from 'react-native-firebase'

const store = configureStore()

export default class App extends Component {


  componentDidMount() {
    this.checkPermission()
    this.createNotificationListeners(); //add this line
    SplashScreen.hide()
  }

  checkPermission() {
    firebase.messaging().hasPermission().then(hasPermission => {
      if (hasPermission) {
        //App already has permission to recieve notifications we just need to add recivers for the notifications
        this.getToken()
      } else {
        //App does not have permission to recieve notifications we first need to request for permission and then add recivers for the notifications
        firebase.messaging().requestPermission().then(() => {
          this.getToken()
        }).catch(error => {
          console.error(error);

        })
      }
    })
  }


  async getToken() {
    
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      // console.log('onNotification notification-->' + notification);
      // console.log('onNotification notification.data -->' + notification.data);
      // console.log('onNotification notification.notification -->' + notification.notification); 
      const { title, body } = notification;
        this.showAlert(body);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(body) {
    Alert.alert(
      "Notification", body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  

  render() {
    return (
      <Provider store={store}>
        <Root>
          <HireApp></HireApp>
        </Root>
      </Provider>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
