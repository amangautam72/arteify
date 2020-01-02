import React from 'react'

import { Image, AsyncStorage } from 'react-native'
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation'

import Home from '../containers/Home'
import RealHome from '../containers/RealHome';
import CreatePost from '../containers/CreatePost';
import NotificationPanel from '../containers/NotificationPanel';
import Profile from '../containers/Profile';


const TabBarComponent = (props) => (<BottomTabBar {...props} />);


export default bottomTabs = createBottomTabNavigator({
    // HomeStart: {
    //     screen: HomeStart,
    // },
   
    Home: {
        screen: RealHome,
        navigationOptions: {
            tabBarIcon: <Image style={{ height: 25, width: 25 }} source={require('../assets/house.png')}></Image>,
            // headerStyle: {
            //     backgroundColor: 'red',
            //   },
            //title: null
        }
    },
    Explore: {
        screen: Home,
        navigationOptions: {
            tabBarIcon: <Image style={{ height: 25, width: 25 }} source={require('../assets/artist.png')}></Image>,
            //tabBarVisible: isLogIn()
        }
    },
    Add: {
        screen: CreatePost,
        navigationOptions: {
            tabBarIcon: <Image style={{ height: 25, width: 25 }} source={require('../assets/add.png')}></Image>,
            //title: null
        }
    },

    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarIcon: <Image style={{ height: 25, width: 25 }} source={require('../assets/man.png')}></Image>,
        }
    },

    // Notifications: {
    //     screen: NotificationPanel,
    //     navigationOptions: {
    //         tabBarIcon: <Image style={{ height: 25, width: 25 }} source={require('../assets/notification.png')}></Image>,
    //         //title: null
    //     }
    // },


},
    {   
        navigationOptions:{
            gesturesEnabled: false,
        },
        tabBarOptions: {
            activeTintColor: '#e91e63',

            style: {
                backgroundColor: 'blue',
            },
        },
        tabBarComponent: props =>
            <TabBarComponent 
            //props={props.props}
                {...props}
                style={{ borderTopColor: '#000' }}
            />,


    }
)

