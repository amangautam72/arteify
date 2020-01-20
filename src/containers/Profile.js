import React from 'react'
import {
    Text, View, Image, FlatList, StyleSheet, Alert, TextInput, SafeAreaView,
    AsyncStorage, TouchableOpacity, RefreshControl, BackHandler, ImageBackground,
    Linking,
    Share
} from 'react-native'

import { Icon, Toast } from 'native-base'

import { ScrollView } from 'react-native-gesture-handler';

import { connect } from 'react-redux'
import { fetchData } from '../actions/ProfileDataAction';
import { deleteRequest, profileInfo, updateProfile } from '../services/requests';

import { Loader } from '../components/Loader'
import Colors from '../Colors/Colors';

import ImagePicker from 'react-native-image-crop-picker';
import { SERVER_ADDRESS } from '../services/server';


import firebase from 'react-native-firebase'
import { NavigationEvents } from 'react-navigation';

class Profile extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            flatListVisibility: false,
            searchtext: '',
            username: '',
            useremail:'',
            updatedName: '',
            userDes: '',
            updatedDes: '',
            image: '',
            updatedImage: '',
            userPosts: [],
            usertype: '',
            userid: null,
            gotoHome: this.props.navigation.getParam('gotoHome'),
            loading: true
        }

        this.handleBackPress = this.handleBackPress.bind(this);

    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        try {
            const usertype = await AsyncStorage.getItem('USERTYPE');
            const userid = await AsyncStorage.getItem('USERID');

            console.log("USERID :  " + userid)
            if (usertype != null && userid != null) {

                this.setState({ usertype: usertype, userid: userid })

                this.props.fetchUserData(parseInt(userid))
            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message); 
        }

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleChanges() {
        if (this.state.userDes != this.state.updatedDes || this.state.username != this.state.updatedName ||
            this.state.image != this.state.updatedImage) {
            let image = ''
            if (this.state.image == this.state.updatedImage) {
                image = ''
            } else {
                image = this.state.updatedImage
            }

            Alert.alert(
                '',
                'Do you want to save the changes?',
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            updateProfile(this.state.userid,
                                this.state.updatedName, this.state.updatedDes, image).then((res) => {
                                    console.log("IIIIII : " + JSON.stringify(res))
                                    if (res.status == '1') {
                                        AsyncStorage.setItem("USERNAME", this.state.updatedName)

                                        this.setState({
                                            username: res.data.user_name, updatedName: res.data.user_name,
                                            image: res.data.image != null && res.data.image,
                                            updatedImage: res.data.image != null && res.data.image,
                                            userDes: res.data.description, updatedDes: res.data.description,
                                        })
                                    }
                                }).catch(err => console.log(err))

                            this.props.navigation.goBack()
                        },
                        style: 'cancel',
                    },
                    { text: 'No', onPress: () => this.props.navigation.goBack() },
                ],
                { cancelable: false },
            );


        }
    }

    handleBackPress() {
    }

    componentWillReceiveProps(props) {
        if (props.response != this.props.response) {
            if (props.hasError) {
                this.setState({ loading: false })
                Toast.show({ text: 'Something went wrong', buttonText: 'okay', duration: 3000 })
                return
            }else if (Object.keys(props.response).length != 0 && props.response.constructor === Object) {
                this.setState({
                    username: props.response.userinfo.user_name,useremail:props.response.userinfo.email,
                     updatedName: props.response.userinfo.user_name,
                    image: props.response.userinfo.image != null && props.response.userinfo.image,
                    updatedImage: props.response.userinfo.image != null && props.response.userinfo.image,
                    userDes: props.response.userinfo.description, updatedDes: props.response.userinfo.description,
                    userPosts: props.response.post,loading:false
                })
            }else{
                this.setState({ loading: false })
            }
        }
    }

    renderPost = ({ item, index }) => (
        <View style={[styles.card, { marginLeft: 0, marginRight: 0, marginTop: 0 }]}>
            <TouchableOpacity

                style={{
                    borderRadius: 2
                }}>

                <View style={{ flexDirection: 'row', }}>
                    <Image
                        style={{ width: 40, height: 40, borderRadius: 20, }}
                        source={{ uri: SERVER_ADDRESS + '/images/' + this.state.image }}
                    />

                    <View style={{ marginLeft: 15, flex: 1 }}>
                        {/* <Text style={{ fontSize: 14, color: '#000', fontWeight: '700' }}>I will make your party happening</Text> */}
                        <Text style={{ fontWeight: 'bold' }}>{this.state.username}</Text>
                        <Text
                            style={{ fontSize: 12, marginTop: 5, alignSelf: 'baseline' }}>{item.text}</Text>


                    </View>
                </View>

                <View style={{ height: 1, marginTop: 10, backgroundColor: '#ddd' }}></View>


            </TouchableOpacity>
        </View>
    );


    openGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            mediaType: "photo",
            //multiple: true,
            compressImageQuality: 0.1,

        }).then((image) => {
            console.log(image);

            this.setState({ updatedImage: image.path, image: '' })

        })
    }

    onLogout() {
        Alert.alert(
            '',
            'Do you really want to logout from the app?',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        AsyncStorage.clear()
                        firebase.iid().deleteToken()
                        this.props.navigation.replace('LoginPage')
                    },
                    style: 'cancel',
                },
                { text: 'No', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

    onRefresh() {
        this.props.fetchUserData(parseInt(this.state.userid))
    }

    openBrowser(url){
        console.log("======")
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
              Linking.openURL(url);
            } else {
              console.log("Don't know how to open URI: " + url);
            }
          });
    }

    invite() {

        Share.share({
            message: `Hi from Arteify, \n Hire amazing artists on the go, click to install \n https://play.google.com/store/apps/details?id=com.arteify`
        }).then(result => console.log(result))
        .catch(err => console.log(err))
        
    }

    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.loading}
                        onRefresh={() => this.onRefresh()} />
                }
                style={{ flex: 1, flexDirection: 'column' }}>

                {/* {this.props.isLoading && <Loader></Loader>} */}

                <NavigationEvents
                    onWillBlur={payload => {
                        console.log("will focus", payload);
                        this.handleChanges()
                    }}
                />

                <ImageBackground
                    source={require('../assets/backdrop.jpg')}
                    style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <SafeAreaView style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => this.openGallery()}>
                            {this.state.updatedImage != this.state.image &&
                                //image from storage URI
                                <Image
                                    source={{ uri: this.state.updatedImage }}
                                    //resizeMode='contain'
                                    style={{ width: 70, height: 70, borderRadius: 35, margin: 15 }}></Image>
                            }
                            {this.state.image == this.state.updatedImage && this.state.image != '' &&
                                //image from web
                                <Image
                                    source={{ uri: SERVER_ADDRESS + '/images/' + this.state.image }}
                                    //resizeMode='contain'
                                    style={{ width: 70, height: 70, borderRadius: 35, margin: 15 }}></Image>
                            }
                            {this.state.image == '' && this.state.updatedImage == '' &&
                                //image from application 
                                <Image source={require('../assets/man.png')}
                                    resizeMode='contain'
                                    style={{ width: 60, height: 60, borderRadius: 30, margin: 15 }}></Image>
                            }
                        </TouchableOpacity>

                        <View style={{ alignSelf: 'center',flex:1 }}>
                            {/* <TextInput
                            value={this.state.updatedName}
                            onChangeText={(updatedName) => this.setState({ updatedName })}
                            autoCapitalize='words'
                            style={{ padding: 0, fontWeight: 'bold',color:'#ffffff' }}
                        >
                        </TextInput> */}
                            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>{this.state.updatedName.toUpperCase() + "  "}</Text>
                            {/* <Text style={{ color: '#ffffff' }}>{this.state.usertype == '2' ? "Seller " : "Buyer "}</Text> */}
                            <Text style={{ color: '#ffffff' }}>{this.state.useremail}</Text>

                        </View>

                          {/* <View style={{alignSelf:'center', position:'absolute',right:40,}}>
                                <Image source={require('../assets/wallet.png')}
                                    resizeMode='contain'
                                    style={{ width: 25, height: 25,alignSelf:'center'  }}></Image>
                                <Text style={{ color: '#ffffff', fontSize: 14,paddingTop:5, alignSelf:'center' }}>{"3000"}</Text>
                                <Text style={{marginTop:5, borderRadius:3, paddingLeft:5, paddingRight:5,paddingTop:3,paddingBottom:3, backgroundColor:'#ffffff', alignSelf:'center', fontSize:12}}>Withdraw</Text>

                            </View> */}
                    </SafeAreaView>
                </ImageBackground>


                {this.state.usertype == '2' &&
                    <View style={styles.card}>

                        <TextInput
                            value={this.state.updatedDes}
                            onChangeText={(updatedDes) => this.setState({ updatedDes })}
                            multiline={true}
                            placeholder="A short description of your experience and what you will provide"
                            autoCapitalize="none"
                        >
                        </TextInput>
                    </View>}

                {this.state.usertype == '2' &&


                    <TouchableOpacity    //passing worklinks so the split() in the next form does not throw an exception.
                        onPress={() => this.props.navigation.navigate('CreateRequest', {
                            edit: '0', requestid: '',
                            title: '', description: '',
                            category: 'Select Category', categoryId: 0,
                            numOfPeople: '', duration: '',
                            budget: '', workLinks: [],
                            slot: [],
                            reload: null
                        })}
                        style={{ backgroundColor: Colors.redColor, borderRadius: 3, padding: 5, marginTop: 5, marginLeft: 20, marginRight: 20, marginBottom: 10 }}>
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>{"ADD SERVICE"}</Text>
                    </TouchableOpacity>

                }

                {this.state.usertype == '2' &&
                    <View>

                        <Text style={{ fontSize: 16, fontWeight: 'bold', padding: 10, paddingTop: 30, backgroundColor: '#F1F1F1' }}>Your Account</Text>
                        <View style={{ height: 0.8, backgroundColor: '#DDDDDD' }}></View>

                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("ArtistServices")}
                            style={{ flexDirection: 'row', padding: 10, paddingTop: 12, paddingBottom: 12 }}>
                            <Image source={require('../assets/services.png')}
                                resizeMode='contain'
                                style={{ width: 20, height: 20 }}></Image>

                            <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 10, flex: 1, }}>{' Your Services '}</Text>
                            <Icon style={{ color: '#909090', fontSize: 20, alignSelf: 'flex-end', paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                        </TouchableOpacity>

                        <View style={{ height: 0.8, backgroundColor: '#DDDDDD' }}></View>

                    </View>
                }


                <Text style={{ fontSize: 16, fontWeight: 'bold', padding: 10, paddingTop: 30, backgroundColor: '#F1F1F1' }}>Orders</Text>

                <View style={{ height: 0.8, backgroundColor: '#DDDDDD' }}></View>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Bookings')}
                    style={{ flexDirection: 'row', padding: 10, paddingTop: 12, paddingBottom: 12 }}>
                    <Image source={require('../assets/request.png')}
                        resizeMode='contain'
                        style={{ width: 20, height: 20 }}></Image>

                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 10, flex: 1, }}>{' Manage Orders '}</Text>
                    <Icon style={{ color: '#909090', fontSize: 20, alignSelf: 'flex-end', paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                </TouchableOpacity>

                <View style={{ height: 0.8, backgroundColor: '#DDDDDD' }}></View>

                {this.state.usertype == "2" && 
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('BookingRequests')}
                        style={{ flexDirection: 'row', padding: 10, paddingTop: 12, paddingBottom: 12 }}>
                        <Image source={require('../assets/bookingicon.png')}
                            resizeMode='contain'
                            style={{ width: 20, height: 20 }}></Image>

                        <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 10, flex: 1, }}>{' Manage Requests '}</Text>
                        <Icon style={{ color: '#909090', fontSize: 20, alignSelf: 'flex-end', paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                    </TouchableOpacity>
                } 

                <View style={{ height: 0.8, backgroundColor: '#DDDDDD' }}></View>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Explore')}
                    style={{ flexDirection: 'row', padding: 10, paddingTop: 12, paddingBottom: 12 }}>
                    <Image source={require('../assets/art.png')}
                        resizeMode='contain'
                        style={{ width: 20, height: 20 }}></Image>

                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 10, flex: 1, }}>{' Find Artists '}</Text>
                    <Icon style={{ color: '#909090', fontSize: 20, alignSelf: 'flex-end', paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                </TouchableOpacity>


                <Text style={{ fontSize: 16, fontWeight: 'bold', padding: 10, paddingTop: 25, backgroundColor: '#F1F1F1' }}>General</Text>

                <View style={{ height: 1, backgroundColor: '#DDDDDD' }}></View>

                <TouchableOpacity
                    onPress={() => this.invite()}
                    style={{ flexDirection: 'row', padding: 10, paddingTop: 12, paddingBottom: 12 }}>
                    <Image source={require('../assets/invite.png')}
                        resizeMode='contain'
                        style={{ width: 20, height: 20 }}></Image>

                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 10, flex: 1, }}>{' Invite Friends '}</Text>
                    <Icon style={{ color: '#909090', fontSize: 20, alignSelf: 'flex-end', paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                </TouchableOpacity>

                <View style={{ height: 0.8, backgroundColor: '#DDDDDD' }}></View>

                <TouchableOpacity
                    onPress={() => this.openBrowser("http://ec2-13-233-172-180.ap-south-1.compute.amazonaws.com/artistapp/support.html")}
                    style={{ flexDirection: 'row', padding: 10, paddingTop: 12, paddingBottom: 12 }}>
                    <Image source={require('../assets/support.png')}
                        resizeMode='contain'
                        style={{ width: 20, height: 20 }}></Image>

                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 10, flex: 1, }}>{' Support '}</Text>
                    <Icon style={{ color: '#909090', fontSize: 20, alignSelf: 'flex-end', paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                </TouchableOpacity>

                <View style={{ height: 0.8, backgroundColor: '#DDDDDD' }}></View>

                <TouchableOpacity
                    onPress={() => this.openBrowser("http://ec2-13-233-172-180.ap-south-1.compute.amazonaws.com/artistapp/term.html")}
                    style={{ flexDirection: 'row', padding: 10, paddingTop: 12, paddingBottom: 12 }}>
                    <Image source={require('../assets/terms.png')}
                        resizeMode='contain'
                        style={{ width: 20, height: 20 }}></Image>

                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 10, flex: 1, }}>{' Terms & Conditions '}</Text>
                    <Icon style={{ color: '#909090', fontSize: 20, alignSelf: 'flex-end', paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                </TouchableOpacity>

                <View style={{ height: 0.8, backgroundColor: '#DDDDDD' }}></View>

                <TouchableOpacity
                    onPress={() => this.openBrowser("http://ec2-13-233-172-180.ap-south-1.compute.amazonaws.com/artistapp/privacy.html")}
                    style={{ flexDirection: 'row', padding: 10, paddingTop: 12, paddingBottom: 12 }}>
                    <Image source={require('../assets/privacy.png')}
                        resizeMode='contain'
                        style={{ width: 20, height: 20 }}></Image>

                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 10, flex: 1, }}>{' Privacy Policy '}</Text>
                    <Icon style={{ color: '#909090', fontSize: 20, alignSelf: 'flex-end', paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                </TouchableOpacity>

                <View style={{ height: 0.8, backgroundColor: '#DDDDDD' }}></View>

                <TouchableOpacity
                    onPress={() => this.onLogout()}
                    style={{ flexDirection: 'row', padding: 10, paddingTop: 12, paddingBottom: 12 }}>
                    <Image source={require('../assets/logout1.png')}
                        resizeMode='contain'
                        style={{ width: 20, height: 20 }}></Image>

                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 10, flex: 1, }}>{' Logout '}</Text>
                    <Icon style={{ color: '#909090', fontSize: 20, alignSelf: 'flex-end', paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                </TouchableOpacity>

                <View style={{ height: 0.8, backgroundColor: '#DDDDDD' }}></View>


                <View >
                    {this.state.userPosts.length > 0 && <Text style={{ backgroundColor: Colors.lightGrey, fontWeight: 'bold', fontSize: 14, padding: 10, marginTop: 10 }}>{"YOUR POSTS"}</Text>}

                    <FlatList
                        // keyboardShouldPersistTaps='always'
                        data={this.state.userPosts}
                        // extraData={this.state}
                        // keyExtractor={this._keyExtractor}
                        renderItem={this.renderPost}
                    />
                </View>

            </ScrollView>
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
        response: state.fetchDataReducer.data,
        hasError: state.fetchDataReducer.error,
        isLoading: state.fetchDataReducer.fetching
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserData: (userid) => dispatch(fetchData(userid))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)