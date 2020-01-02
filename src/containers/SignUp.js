import React from 'react'

import { View, Text, Image,AsyncStorage,TouchableOpacity } from 'react-native'

import { SafeAreaView } from 'react-navigation';

import { TextField } from 'react-native-material-textfield'
import { Icon, Toast } from 'native-base';

import { register } from '../actions/RegisterActions'
import { connect } from 'react-redux';

import { Loader } from '../components/Loader'
import Colors from '../Colors/Colors';

import NetInfo from "@react-native-community/netinfo";
import { sendOtp } from '../services/requests';

const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

class SignUp extends React.Component {

    constructor() {
        super()
        this.state = {
            userName: '',
            email: '',
            number: '',
            password: '',
            usertype: '',
        }
    }

    async componentDidMount(){
        try {
            const userType = await AsyncStorage.getItem('USERTYPE');
            console.log("------------   :   "+userType)
            this.setState({usertype: userType})
         } catch (error) {
             // console.error('AsyncStorage#setItem error: ' + error.message);
         }
    }

    componentWillReceiveProps(props) {

        console.log("PROPS: : " + JSON.stringify(props))
        console.log("THIS.PROPS: : " + JSON.stringify(this.props))
    
        if (props != this.props) {

            if(props.hasError){
                Toast.show({ text: "Some Error", buttonText: 'okay', duration: 3000 })
            }else if(props.registerSuccessful){
                if(this.state.usertype != '2'){
                    this.props.navigation.navigate('Home',{gotoHome: false})
                }else{
                    this.props.navigation.navigate('Profile',{gotoHome: true})
                    // if(props.response[0].is_complete == 0){
                    //     this.props.navigation.navigate('Home')
                    // }else{
                    //     this.props.navigation.navigate('Profile')
                    // }
                }
               
                Toast.show({ text: 'You have successfully Registered', buttonText: 'okay', duration: 3000 })
            }
        }

    }



    SignUp(){

        let username = this.state.userName
        let email = this.state.email
        let number = this.state.number
        let password = this.state.password
        let userType = this.state.usertype

        if (username == '' || password == '' || email == '' || number == '') {
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

        NetInfo.isConnected.fetch().done((isConnected) => {
            if(isConnected){
                sendOtp(number).then(res => {

                    console.log("RESPONSE === " + JSON.stringify(res))
                    
                    if(res.status == '1'){
                        this.props.navigation.navigate("VerifyUser",
                        {username : username,email: email,
                            password:password,description:'',
                            number:number, locationid : 0, usertype: "3"})
                        
                    }else{
                        Toast.show({ text: 'Something went wrong', buttonText: 'okay', duration: 3000 })
        
                        // alert(res.message)
                    }
                
                })
                .catch((err) => console.log("ERROR : " + err))
            }
            else{
                Toast.show({ text: 'No internet connection found!- Internet connection required to use this app', buttonText: 'okay', duration: 3000 })
            }
        })

        //this.props.doRegister(username,email,password,'',0,number,"3")
    }


    onSkip(){
        console.log("SKIPPPPPPP")
        AsyncStorage.setItem("FIRSTTIME", true)
        this.props.navigation.navigate('Search ')
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, padding: 10 }}>

                {this.props.isLoading && <Loader></Loader>}

                <Image style={{width:80,height:80, marginTop:10, alignSelf:'center' }}
                    source={require('../assets/applogo.png')}></Image>
                <Text style={{ padding: 10, alignSelf:'center' }}>Welcome! Join Arteify</Text>

                {/* <Text style={{ paddingTop:10, alignSelf:'center', fontWeight:'bold' }}>{' Sign up with '}</Text> */}

                {/* <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, backgroundColor: '#3b5998', borderRadius: 4, margin: 10 }}>
                        <TouchableOpacity style={{ alignSelf: 'center', padding: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{" FACEBOOK "}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ flex: 1, backgroundColor: '#ea4335', borderRadius: 4, margin: 10 }}>
                        <TouchableOpacity style={{ alignSelf: 'center', padding: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{"GOOGLE  "}</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}

                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <TextField
                        label='Username'
                        value={this.state.userName}
                        onChangeText={(userName) => this.setState({ userName })}
                    />
                </View>

                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <TextField
                        autoCapitalize='none'
                        label='Email'
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                    />
                </View>

                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <TextField
                        autoCapitalize='none'
                        keyboardType="numeric"
                        label='Phone Number'
                        maxLength={10}
                        value={this.state.number}
                        onChangeText={(number) => this.setState({ number })}
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


                <View style={{ marginTop: 50, margin: 10, }}>
                    <TouchableOpacity
                    onPress={this.SignUp.bind(this)} 
                    style={{ backgroundColor: Colors.appColor, borderRadius: 4, padding: 10 }}>
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', alignSelf: 'center' }}>{" SIGN UP "}</Text>
                    </TouchableOpacity>
                    {/* <Text style={{ alignSelf: 'flex-end', paddingTop: 10 }}>FORGOT PASSWORD</Text> */}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center',marginTop:20  }}>
                    <TouchableOpacity 
                    onPress={() => this.props.navigation.goBack()}
                    style={{flexDirection:'row'}}>
                        <Icon style={{ padding: 10, alignSelf: 'center', }} name='arrow-back' />
                        <Text style={{ alignSelf: 'center' }}>Go back</Text>
                    </TouchableOpacity>
                </View>


                <Text
                onPress={() => this.props.navigation.navigate('LoginPage')} 
                style={{position:'absolute', left:20, bottom:30,
                 fontSize:14, fontWeight:'bold'}}>
                    {"SIGN IN "}</Text>

                <Text
                onPress={this.onSkip.bind(this)}
                style={{position:'absolute', right:20, bottom:30,
                 fontSize:14,fontWeight:'bold'}}
                >
                    SKIP
                </Text> 
                


            </SafeAreaView>
        )
    }
} 


function mapStateToProps(state){
    return{
        response: state.registerReducer.data,
        isLoading: state.registerReducer.registerIsLoading,
        registerSuccessful: state.registerReducer.registerSuccessful,
        hasError: state.registerReducer.error,
    }

}

function mapDispatchToProps(dispatch){
    return{
        doRegister: (username,email,password,description,locationid,number,usertype) => dispatch(register(username,email,password,description,locationid,number,usertype))
    }

}



export default connect(mapStateToProps, mapDispatchToProps)(SignUp)