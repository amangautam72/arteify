import React from 'react'

import { Text, Image, AsyncStorage } from 'react-native'
import { createDrawerNavigator, createAppContainer } from 'react-navigation'

import BottomNavigator from './BottomNavigator'
import Search from '../containers/Home'
import { NavigatorHeader } from '../Navigations/NavigationHeader'
import Bookings from '../containers/Bookings';
import GigRequests from '../containers/GigRequests';



export default createDrawerNavigator({
    "Home  ": {
        screen: BottomNavigator,
        navigationOptions: {
            drawerIcon: () => (
                <Image style={{ width: 20, height: 20,  }}
                    resizeMode='contain'
                    source={require('../assets/house.png')}></Image>
            ),
        }
    },
    // "Bookings ": {
    //     screen: Bookings,
    //     navigationOptions: {
    //         drawerIcon: () => (
    //             <Image style={{ width: 20, height: 20,  }}
    //                 // resizeMode='contain'
    //                 source={require('../assets/bookings.png')}></Image>
    //         ),
    //     }
    // },
    // "Booking Requests  ": {
    //     screen: GigRequests,
    //     navigationOptions: {
    //         // drawerIcon: () => <Image style={{ width: 20, height: 20 }}
    //         // resizeMode='contain'
    //         // source={require('../assets/bookings.png')}></Image>,
    //         // drawerLabel: () => {
    //         //     return <Text>WOW</Text>
                
    //         // }
           
    //     }
    // },
    "Logout ": {
        screen: "Logout",
        navigationOptions: {
            drawerIcon: () => (
                <Image style={{ width: 20, height: 20,marginLeft:5  }}
                    resizeMode='contain'
                    source={require('../assets/logout.png')}></Image>
            ),
        }
    },
   

},
    {
        unmountInactiveRoutes: true,
        contentComponent: NavigatorHeader,
    }
);
