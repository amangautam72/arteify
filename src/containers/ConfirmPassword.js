import React from 'react'
import { StyleSheet, Text, View, AsyncStorage, TouchableOpacity, TextInput } from 'react-native'

import { Header, Left, Icon, Button, Right, Toast } from 'native-base'

import NetInfo from "@react-native-community/netinfo";

import Colors from '../Colors/Colors';
import { registerRequest, confirmPassword } from '../services/requests'


var radio_props = [
    { label: 'Pay 10 %', value: 0 },
    { label: 'Pay Full Amount', value: 1 }
];

class ConfirmPassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            otp: '',
            //email: this.props.navigation.getParam('email'),
            password: this.props.navigation.getParam('password'),
            mobile: this.props.navigation.getParam('mobile'),
        }

    }

    SignUp() {
        let otp = this.state.otp
        let password = this.state.password
        let mobile = this.state.mobile
        
        if (this.state.otp === '') {
            Toast.show({
                text: 'Please enter OTP',
                buttonText: 'okay', duration: 3000
            })

            return;
        }

        NetInfo.isConnected.fetch().done((isConnected) => {
            if (isConnected) {
                confirmPassword(mobile, otp, password).then(res => {

                    console.log("RESPONSE === " + JSON.stringify(res))

                    if (res.status == '1') {
                        Toast.show({ text: 'Password has been changed successfully', buttonText: 'okay', duration: 3000 })
                        this.props.navigation.goBack()
                    } else {
                        Toast.show({ text: res.message, buttonText: 'okay', duration: 3000 })
                        // alert(res.message)
                    }

                })
                    .catch((err) => console.log("ERROR : " + err))
            }
            else {
                Toast.show({ text: 'No internet connection found!- Internet connection required to use this app', buttonText: 'okay', duration: 3000 })
                //dispatch(noInternet())
            }
        })

    }

    storeValues(usertype,userid,username) {
        console.log("STOREDDDD")

        AsyncStorage.setItem("LOGGEDIN", 'true')
        AsyncStorage.setItem("USERTYPE", usertype.toString())
        AsyncStorage.setItem("USERID", userid.toString())
        AsyncStorage.setItem("USERNAME", username)


    }


    render() {
        return (
            <View
                style={{ flex: 1, }}>
                <Header androidStatusBarColor={Colors.Darkgrey} style={{ backgroundColor:'#DDDDDD'}}>
                    <Left style={{ flexDirection: "row" }}>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon style={{ color: Colors.Darkgrey }} name='arrow-back' />

                        </Button>
                        <Text style={{ fontSize: 18, padding: 10, color: Colors.Darkgrey, fontWeight: 'bold' }}>{'Verify '}</Text>
                    </Left>

                    <Right></Right>
                </Header>

                <Text style={{ fontWeight: 'bold', fontSize: 12, padding: 10 }}>Enter OTP</Text>
                <TextInput
                    autoCapitalize="none"
                    value={this.state.otp}
                    onChangeText={(otp) => this.setState({ otp })}
                    multiline={false}
                    placeholder="OTP"
                    style={{ padding: 0, margin: 5, padding: 5, paddingLeft: 10, borderWidth: 1, borderColor: "#DDDDDD" }}

                ></TextInput>


                <TouchableOpacity
                    onPress={this.SignUp.bind(this)}
                    style={{ borderWidth: 2, borderColor: Colors.appColor, padding: 10, flexDirection: 'row', margin: 5, marginTop: 15 }}>
                    <Text style={{ flex: 1, color: Colors.appColor, fontWeight: 'bold', fontSize: 16 }}>{" Verify "}</Text>
                    <Icon style={{ color: '#909090', fontSize: 20, paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        backgroundColor: '#fff', shadowColor: "#ddd",
        borderRadius: 3, borderColor: '#ddd',
        borderWidth: 1, padding: 10,
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    }
})


export default ConfirmPassword