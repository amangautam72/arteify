import React from 'react'

import { StyleSheet, View, Text, TextInput, Image, KeyboardAvoidingView, 
    TouchableOpacity,FlatList } from 'react-native'

import { SafeAreaView } from 'react-navigation';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, Toast } from 'native-base';

import NetInfo from "@react-native-community/netinfo";

import { register } from '../actions/RegisterActions'
import { connect } from 'react-redux';

import { Loader } from '../components/Loader'
import { ScrollView } from 'react-native-gesture-handler';
import { sendOtp } from '../services/requests';

const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

class RegisterArtist extends React.Component {
    _menu = null;

    constructor() {
        super()
        this.state = {
            userName: '',
            des: '',
            email: '',
            password: '',
            location: 'Select your preference',
            locationid: 0,
            phoneNo: '',
            slots: [{'name':'Slot 1', 'selected':0 },{'name':'Slot 2', 'selected':0 },{'name':'Slot 3', 'selected':0 }],
            slot: 1
        }
    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = (locationName, id) => {
        // Toast.show({ text: item, buttonText: 'okay', duration: 3000 })
        this.setState({ location: locationName, locationid: id })
        this._menu.hide();
    };

    _slot = (slot) => {
        this.setState({ slot: slot })
        this._menu.hide();
    }

    showMenu = () => {
        this._menu.show();
    };

    componentWillReceiveProps(props) {

        if (props != this.props) {

            if (props.hasError) {
                Toast.show({ text: "Some Error", buttonText: 'okay', duration: 3000 })
            } else if (props.registerSuccessful) {
                this.props.navigation.navigate('AddService')
                // if (this.state.usertype == '3') {
                //     this.props.navigation.navigate('Home', { gotoHome: false })
                // } else {
                //     this.props.navigation.navigate('Profile', { gotoHome: true })

                // }

                Toast.show({ text: 'You have successfully Registered', buttonText: 'okay', duration: 3000 })
            }
        }

    }



    SignUp() {

        let username = this.state.userName
        let email = this.state.email
        let password = this.state.password
        let description = this.state.des
        let locationid = this.state.locationid
        let number = this.state.phoneNo

        if (username === '' || description == '' || password === '' || email === '' || locationid == 0 || number == '') {
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
                            password:password,description:description,
                            number:number, locationid : locationid, usertype: "2"})
                        
                    }else{
                        Toast.show({ text: res.message, buttonText: 'okay', duration: 3000 })
        
                        // alert(res.message)
                    }
                
                })
                .catch((err) => console.log("ERROR : " + err))
            }
            else{
                Toast.show({ text: 'No internet connection found!- Internet connection required to use this app', buttonText: 'okay', duration: 3000 })
            }
        })
      

        //this.props.doRegister(username, email, password, description, locationid, number, "2")
    }


    render() {
        return (
            <SafeAreaView style={{ padding: 10 }}>

                {this.props.isLoading && <Loader></Loader>}

                <ScrollView>
                    <KeyboardAvoidingView behavior="padding" enabled>

                        <Image style={{width:80,height:80,marginTop:10, alignSelf: 'center' }}
                            source={require('../assets/applogo.png')}></Image>
                        <Text style={{ padding: 10, alignSelf: 'center' }}>Welcome! Join Arteify</Text>


                        <View style={{ margin: 10, borderBottomWidth: 2, borderBottomColor: '#ddd' }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>USERNAME</Text>
                            <TextInput
                                autoCapitalize="none"
                                value={this.state.userName}
                                onChangeText={(userName) => this.setState({ userName })}
                                multiline={false}
                                placeholder="Username"
                                style={{ paddingBottom: 5,paddingTop:5, marginTop: 5 }}
                            >

                            </TextInput>

                        </View>

                        <View style={styles.card}>
                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>DESCRIPTION</Text>
                            <TextInput
                                value={this.state.des}
                                onChangeText={(des) => this.setState({ des })}
                                multiline={true}
                                placeholder="A short description of your experience and what you will provide"
                                autoCapitalize="none"
                            >

                            </TextInput>
                        </View>

                        <View style={{ margin: 10, borderBottomWidth: 2, borderBottomColor: '#ddd' }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>EMAIL</Text>
                            <TextInput
                                autoCapitalize="none"
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                                multiline={false}
                                placeholder="Email"
                                style={{ paddingBottom: 5,paddingTop:5, marginTop: 5 }}

                            >

                            </TextInput>

                        </View>

                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ flex: 1, margin: 10, borderBottomWidth: 2, borderBottomColor: '#ddd' }}>

                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>PASSWORD</Text>
                                <TextInput
                                    autoCapitalize="none"
                                    value={this.state.password}
                                    onChangeText={(password) => this.setState({ password })}
                                    multiline={false}
                                    placeholder="Password"
                                    style={{ paddingBottom: 5,paddingTop:5, marginTop: 5 }}

                                >

                                </TextInput>

                            </View>


                            <View style={{ flex: 1, margin: 10, borderBottomWidth: 2, borderBottomColor: '#ddd', paddingBottom: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }}>PREFERENCE</Text>
                                <Menu
                                    ref={this.setMenuRef}
                                    button={<Text onPress={this.showMenu}>{this.state.location}</Text>}
                                >
                                    <MenuItem onPress={() => this.hideMenu('All over India', 1)}>All over India</MenuItem>
                                    <MenuDivider />
                                    <MenuItem onPress={() => this.hideMenu('Delhi NCR', 2)}>Delhi NCR</MenuItem>
                                </Menu>

                            </View>

                        </View>



                        <View style={{ margin: 10, borderBottomWidth: 2, borderBottomColor: '#ddd' }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>PHONE NUMBER</Text>
                            <TextInput
                                autoCapitalize="none"
                                value={this.state.phoneNo}
                                onChangeText={(phoneNo) => this.setState({ phoneNo })}
                                multiline={false}
                                placeholder="Enter your number"
                                style={{ paddingBottom: 5,paddingTop:5, marginTop: 5 }}

                            >

                            </TextInput>

                        </View>


                        {/* <View style={{ flex: 1, margin: 10, borderBottomWidth: 2, borderBottomColor: '#ddd', paddingBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }}>How many slots you can take in a day?</Text>
                        <Menu
                            ref={this.setMenuRef}
                            button={<Text onPress={this.showMenu}>{this.state.slot}</Text>}
                        >
                            <MenuItem onPress={() => this._slot(1)}>1</MenuItem>
                            <MenuDivider />
                            <MenuItem onPress={() => this._slot(2)}>2</MenuItem>
                            <MenuDivider />
                            <MenuItem onPress={() => this._slot(3)}>3</MenuItem>
                        </Menu>

                    </View> */}



                        <View style={{ marginTop: 30, margin: 10, }}>
                            <TouchableOpacity
                                onPress={this.SignUp.bind(this)}
                                //onPress={() => this.props.navigation.navigate("VerifyUser")}
                                style={{ backgroundColor: '#3b5998', borderRadius: 4, padding: 10 }}>
                                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', alignSelf: 'center' }}>{" NEXT "}</Text>
                            </TouchableOpacity>
                            {/* <Text style={{ alignSelf: 'flex-end', paddingTop: 10 }}>FORGOT PASSWORD</Text> */}
                        </View>


                        
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}
                                style={{ flexDirection: 'row', position:'absolute' }}>
                                <Icon style={{ padding: 10, alignSelf: 'center', }} name='arrow-back' />
                                {/* <Text style={{ alignSelf: 'center' }}>Go back</Text> */}
                            </TouchableOpacity>
                    


                    </KeyboardAvoidingView>

                </ScrollView>

            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    card: {
        margin: 10, padding: 10, elevation: 5,
        backgroundColor: '#fff', shadowColor: "#ddd",
        borderWidth: 0.5, borderColor: '#ddd', borderRadius: 5,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    }
});



function mapStateToProps(state) {
    return {
        response: state.registerReducer.data,
        isLoading: state.registerReducer.registerIsLoading,
        registerSuccessful: state.registerReducer.registerSuccessful,
        hasError: state.registerReducer.error,
    }

}

function mapDispatchToProps(dispatch) {
    return {
        doRegister: (username, email, password, description, locationid, number, usertype) => dispatch(register(username, email, password, description, locationid, number, usertype))
    }

}



export default connect(mapStateToProps, mapDispatchToProps)(RegisterArtist)