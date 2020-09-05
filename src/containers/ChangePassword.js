import React from 'react'

import { View, StyleSheet, Text, Image, AsyncStorage, TouchableOpacity, TextInput } from 'react-native'
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';

import { TextField } from 'react-native-material-textfield'
import { Icon, Toast } from 'native-base';
import { connect } from 'react-redux';
import { login } from '../actions/LoginActions';

import { Loader } from '../components/Loader'
import Colors from '../Colors/Colors';
import { forgotPassword } from '../services/requests';

const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

class ChangePassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            number: '',
            password: '',
            password2: '',
            loading: false,
        }
    }

    signIn() {
        let number = this.state.number
        let password = this.state.password
        let password2 = this.state.password2

        if (password === '' || password2 == '' || number === '') {
            Toast.show({
                text: 'Please enter details',
                buttonText: 'okay', duration: 3000
            })

            return;
        }

        if (number.length<10) {
            Toast.show({
                text: 'Invalid Number',
                buttonText: 'okay', duration: 3000
            })
            return;
        }

        if (password != password2) {
            Toast.show({
                text: "Password didn't match",
                buttonText: 'okay', duration: 3000
            })
            return;
        }

        this.setState({ loading: true })

        forgotPassword(number).then((res) => {
            console.log("RESPONSE : " + JSON.stringify(res))
            if (res.status == "1") {
                this.setState({ loading: false })
                Toast.show({ text: "An otp has been sent to your registered number", buttonText: 'okay', duration: 3000 })
                this.props.navigation.replace("ConfirmPassword", { 
                    //mobile: number, 
                    password: password, mobile: res.data })
            }
            else {
                this.setState({ loading: false })
            }
        }).catch((err) => this.setState({ loading: false }))

    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: '#fff' }}>

                {this.state.isLoading && <Loader></Loader>}

                <Image style={{ width: 140, marginTop: 50, alignSelf: 'center' }}
                    resizeMode='contain'
                    source={require('../assets/title.png')}></Image>

                <Text style={{ marginLeft: 10, marginTop: 50, fontSize: 18, color: Colors.Darkgrey, fontWeight: 'bold' }}>FORGOT PASSWORD</Text>
                <Text style={{ marginLeft: 10, color: Colors.Grey }}>Please enter required details</Text>

                <View style={{ marginLeft: 10, marginRight: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                    {/* <TextField
                        autoCapitalize='none'
                        label='Enter Email'
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                    /> */}

                    <Image style={{ width: 20, height: 20 }}
                        source={require('../assets/phone.png')}></Image>

                    <TextInput
                        style={{ marginLeft: 10, height: 40, borderBottomWidth: 1, borderBottomColor: Colors.appColor, flex: 1 }}
                        placeholder="Mobile Number"
                        keyboardType='numeric'
                        onChangeText={(number) => this.setState({ number })}
                        value={this.state.number}
                    />
                </View>


                <View style={{ marginLeft: 10, marginRight: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                    {/* <TextField
                        autoCapitalize='none'
                        label='Password'
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
                    /> */}

                    <Image style={{ width: 20, height: 20 }}
                        source={require('../assets/lock.png')}></Image>

                    <TextInput
                        style={{ marginLeft: 10, height: 40, borderBottomWidth: 1, borderBottomColor: Colors.appColor, flex: 1 }}
                        placeholder="Password"
                        autoCapitalize='none'
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                    />
                </View>

                <View style={{ marginLeft: 10, marginRight: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                    {/* <TextField
                        autoCapitalize='none'
                        label='Confirm Password'
                        value={this.state.password2}
                        onChangeText={(password2) => this.setState({ password2 })}
                    /> */}

                    <Image style={{ width: 20, height: 20 }}
                        source={require('../assets/lock.png')}></Image>

                    <TextInput
                        style={{ marginLeft: 10, height: 40, borderBottomWidth: 1, borderBottomColor: Colors.appColor, flex: 1 }}
                        placeholder="Confirm Password"
                        autoCapitalize='none'
                        secureTextEntry={true}
                        onChangeText={(password2) => this.setState({ password2 })}
                        value={this.state.password2}
                    />
                </View>




                <View style={{ marginTop: 50, margin: 10, }}>
                    <TouchableOpacity
                        onPress={this.signIn.bind(this)}
                        style={{ backgroundColor: Colors.appColor, borderRadius: 4, padding: 10 }}>
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', alignSelf: 'center' }}>{" CONTINUE "}</Text>
                    </TouchableOpacity>

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 40 }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{ flexDirection: 'row' }}>
                        <Icon style={{ padding: 10, alignSelf: 'center', }} name='arrow-back' />
                        <Text style={{ alignSelf: 'center' }}>Go back</Text>
                    </TouchableOpacity>
                </View>


            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    modal: {
        borderRadius: 5,
        marginLeft: 50, marginRight: 50, marginTop: 60, marginBottom: 60,
        backgroundColor: '#fff', padding: 15, paddingLeft: 20, paddingRight: 20


    },
});

export default ChangePassword