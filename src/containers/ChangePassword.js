import React from 'react'

import { View, StyleSheet, Text, Image, AsyncStorage, TouchableOpacity, BackHandler } from 'react-native'
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
            email: '',
            password: '',
            password2:'',
            loading: false,
        }
    }

    signIn() {
        let email = this.state.email
        let password = this.state.password
        let password2 = this.state.password2

        if (password === '' || password2 == '' || email === '') {
            Toast.show({
                text: 'Please enter details',
                buttonText: 'okay', duration: 3000
            })

            return;
        }

        if (reg.test(email) === false) {
            Toast.show({
                text: 'Invalid email',
                buttonText: 'okay', duration: 3000
            })
            return;
        }

        if(password != password2){
            Toast.show({
                text: "Password didn't match",
                buttonText: 'okay', duration: 3000
            })
            return;
        }

        this.setState({loading:true})

        forgotPassword(email).then((res) => {
            console.log("RESPONSE : " + JSON.stringify(res))
            if(res.status == "1"){
                this.setState({loading:false}) 
                this.props.navigation.replace("ConfirmPassword", {email: email,password:password,mobile:res.data})
            }
            else{
                this.setState({loading:false}) 
            }
        }).catch((err) => this.setState({loading:false}) )

    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: '#fff' }}>

                {this.state.isLoading && <Loader></Loader>}   

                <Image style={{ width: 80, height: 80, marginTop: 10, alignSelf: 'center' }}
                    source={require('../assets/applogo.png')}></Image>

                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <TextField
                        autoCapitalize='none'
                        label='Enter Email'
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                    />
                </View>


                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <TextField
                        autoCapitalize='none'
                        label='Password'
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
                    />
                </View>

                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <TextField
                        autoCapitalize='none'
                        label='Confirm Password'
                        value={this.state.password2}
                        onChangeText={(password2) => this.setState({ password2 })}
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