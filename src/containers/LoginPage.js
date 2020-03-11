import React from 'react'

import { TextInput, View, StyleSheet, Text, Image, AsyncStorage, TouchableOpacity, BackHandler } from 'react-native'
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';

import { TextField } from 'react-native-material-textfield'
import { Icon, Toast } from 'native-base';
import { connect } from 'react-redux';
import { login } from '../actions/LoginActions';

import { Loader } from '../components/Loader'
import Colors from '../Colors/Colors';

const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

class LoginPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mobile: '',
            password: '',
            loading: false,
            fcmToken: ''
        }
    }


    async componentDidMount() {
        let loggedIn = await AsyncStorage.getItem('LOGGEDIN');

        console.log("ASYSNSNSYSSY  : " + loggedIn)
        if (loggedIn != null) {
            if (loggedIn)
                this.props.navigation.navigate('Navigator')
        }
    }



    componentWillReceiveProps(props) {

        console.log("PROPS: : " + JSON.stringify(props))
        console.log("THIS.PROPS: : " + JSON.stringify(this.props))

        if (props != this.props) {

            if (props.hasError) {
                Toast.show({ text: props.response, buttonText: 'okay', duration: 3000 })
            } else if (props.loginSuccessful) {

                if (props.response.is_complete == 1) {
                    this.props.navigation.replace('Navigator')
                } else {
                    this.props.navigation.navigate('AddService')
                }


                Toast.show({ text: 'You have successfully logged In', buttonText: 'okay', duration: 3000 })
            }
        }

    }

    signIn() {
        let mobile = this.state.mobile
        let password = this.state.password

        if (password === '' || mobile === '') {
            Toast.show({
                text: 'Please enter details',
                buttonText: 'okay', duration: 3000
            })

            return;
        }

        if (mobile.length < 10) {
            Toast.show({
                text: 'Invalid username',
                buttonText: 'okay', duration: 3000
            })
            return;
        }

        this.props.doLogin(mobile, password)
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: '#fff' }}>


                {this.props.isLoading && <Loader></Loader>}

                {/* <Image style={{ width: 80, height: 80, marginTop: 10, alignSelf: 'center' }}
                    source={require('../assets/applogo.png')}></Image> */}
                {/* <Text style={{ padding: 10, alignSelf:'center' }}>Welcome to Arteify</Text> */}

                {/* <Text style={{ paddingTop: 10, alignSelf: 'center', fontWeight: 'bold' }}>{' Sign in to Arteify '}</Text> */}
                <Image style={{width:140,marginTop:50, alignSelf:'center' }}
                        resizeMode='contain'
                        source={require('../assets/title.png')}></Image>

                <Text style={{marginLeft:10,marginTop:50, fontSize:18,color:Colors.Darkgrey, fontWeight:'bold'}}>LOGIN</Text>
                <Text style={{marginLeft:10, color:Colors.Grey}}>Please sign in to continue</Text>
                

                <View style={{ marginLeft: 10, marginRight: 10,marginTop:20, flexDirection: 'row', alignItems: 'center' }}>

                    <Image style={{ width: 20, height: 20 }}
                        source={require('../assets/mail.png')}></Image>

                    <TextInput
                        style={{marginLeft:10, height: 40, borderBottomWidth:1,borderBottomColor:Colors.appColor, flex:1}}
                        autoCapitalize='none'
                        keyboardType='numeric'
                        placeholder="Phone Number"
                        onChangeText={(mobile) => this.setState({ mobile })}
                        value={this.state.mobile}
                    />
                </View>


                <View style={{marginTop:20, marginLeft: 10, marginRight: 10,flexDirection: 'row', alignItems: 'center' }}>

                <Image style={{ width: 20, height: 20 }}
                        source={require('../assets/lock.png')}></Image>


                <TextInput
                        style={{marginLeft:10, height: 40, borderBottomWidth:1,borderBottomColor:Colors.appColor, flex:1}}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                    />


                </View>


                <Text onPress={() => this.props.navigation.navigate("ChangePassword")} 
                style={{ alignSelf: 'flex-end',fontWeight:'bold', paddingTop: 10,paddingRight:10, fontSize: 12 }}>FORGOT PASSWORD?  </Text>

                <View style={{ marginTop: 50, margin: 10, }}>
                    <TouchableOpacity
                        onPress={this.signIn.bind(this)}
                        style={{ backgroundColor: Colors.appColor, borderRadius: 4, padding: 10 }}>
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', alignSelf: 'center' }}>{" LOGIN "}</Text>
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

function mapStateToProps(state) {
    return {
        response: state.loginReducer.data,
        isLoading: state.loginReducer.loginIsLoading,
        loginSuccessful: state.loginReducer.loginSuccessful,
        hasError: state.loginReducer.error,

        //sessionExpired: state.appData.sessionExpired
    }
}

function mapDispatchToProps(dispatch) {
    return {
        doLogin: (username, password) => dispatch(login(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)