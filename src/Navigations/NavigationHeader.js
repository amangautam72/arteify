import React from 'react'

import {View,
    Text, SafeAreaView, ScrollView,
    Image, AsyncStorage, Alert, TouchableOpacity
} from 'react-native'
import { DrawerItems } from 'react-navigation'
import firebase from 'react-native-firebase'

var name = ''
var usertype = ''
export const NavigatorHeader = (props) => {

    AsyncStorage.getItem('USERNAME').then((value) => {
        name = value

    }).catch((err) => console.log(err))

    AsyncStorage.getItem('USERTYPE').then((value) => {
        usertype = value

    }).catch((err) => console.log(err))



    return (
        <SafeAreaView style={{ flex: 1, }}>
            <TouchableOpacity
                // onPress={() => props.navigation.navigate('Profile')}
                style={{ paddingTop:20,paddingBottom:10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDF1FF' }}>
                {/* <Image source={{ uri: 'https://scontent.fdel1-1.fna.fbcdn.net/v/t1.0-9/14720411_1138434889577739_7740067452510121205_n.jpg?_nc_cat=110&_nc_ht=scontent.fdel1-1.fna&oh=0342716ef3778b60a8687ba9901ffce0&oe=5D95E553' }}
                    // resizeMode='contain'
                    style={{ width: 80, height: 80, borderRadius: 40 }}></Image> */}
                <Image source={require('../assets/logo.png')}
                                resizeMode='contain'
                                style={{ width: 80, height: 80, borderRadius: 30, margin: 15 }}></Image>
                {/* <Text style={{
                    alignSelf: 'stretch',
                    fontSize: 15, textAlign: 'center',
                    color: '#000', margin: 10, fontWeight: 'bold'
                }}>{name + " "}
                </Text> */}
            </TouchableOpacity>
            <ScrollView >
                <DrawerItems
                    itemStyle={{borderTopWidth:0.5, borderTopColor:'#ddd'}}
                    {...props}
                    getLabel={(scene) => (
                        usertype != "2" && props.getLabel(scene) == "Booking Requests  " || props.getLabel(scene) == "Search " ?
                        null : props.getLabel(scene) == "Booking Requests  " 
                        ?
                        <View style={{flexDirection:'row',paddingLeft:18, paddingTop:15,paddingBottom:15}}>
                            <Image 
                            style={{width:20, height:20}}
                            source={require('../assets/bookings.png')}></Image>
            
                            <Text style={{paddingLeft:18, fontWeight:'bold', fontSize:15}}>{props.getLabel(scene)}</Text>
                            
                        </View> 
                        :
                        <View style={{ paddingTop:15,paddingBottom:15}}>
                            
                            <Text style={{fontWeight:'bold', fontSize:15}}>{props.getLabel(scene)}</Text>
                        
                        </View>
                    )}
                    onItemPress={
                        (route) => {
                            if (route.route.routeName !== "Logout ") {
                                props.onItemPress(route);
                                // this.props.navigation.navigate(route.route.routeName)
                                return;
                            } else {
                                console.log("logged out")
                                Alert.alert(
                                    '',
                                    'Do you really want to logout from the app?',
                                    [

                                        {
                                            text: 'Yes',
                                            onPress: () => {
                                                console.log('Cancel Pressed')
                                                AsyncStorage.clear()
                                                firebase.iid().deleteToken()
                                                props.navigation.replace('LoginPage')
                                            },
                                            style: 'cancel',
                                        },
                                        { text: 'No', onPress: () => console.log('OK Pressed') },
                                    ],
                                    { cancelable: false },
                                );

                            }

                        }
                    }
                />
            </ScrollView>
        </SafeAreaView>
    )
}


async function getUsername() {
    return await AsyncStorage.getItem("USERNAME")
}
