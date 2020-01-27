import React from 'react'
import { StyleSheet, Text, View, Image, FlatList, ImageBackground, TextInput, Modal, AsyncStorage } from 'react-native'

import { Header, Left, Icon, Button, Right,Toast } from 'native-base'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { createPost } from '../services/requests';

import { Loader } from '../components/Loader'
import Colors from '../Colors/Colors';

import ImagePickerr from 'react-native-image-crop-picker';

const listData = ['Live Musician', 'Magician', 'Painter', 'Movie Play', 'Dancer', 'Guitarist', 'Dj']
export default class CreatePost extends React.Component {

    constructor() {
        super()
        this.state = {
            userid:'',
            postText: '',
            flatListVisibility: false,
            data: [],
            isLoading: false,
            imageuri:'',
            video:''
        }

    }

    async componentDidMount() {

        try {
            
            const userid = await AsyncStorage.getItem('USERID');

            console.log("USERID :  " + userid)
            if (userid != null) {
  
                this.setState({userid: userid})

            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }
    }

    launchGallery() {
        ImagePickerr.openPicker({
            width: 700,
            height: 500,
            mediaType: "photo",
            cropping: true,
            //multiple: true,
            //compressImageQuality: 1,
    
        }).then((image) => {

            this.setState({imageuri: image.path})

        //   updateRequestImage(this.state.requestid, image.path).then((res) => {
        //     console.log("IIIIII : " + JSON.stringify(res))
    
        //     if(res.status == "1"){
        //       Toast.show({ text: "Image has been uploaded successfully", buttonText: 'okay', duration: 3000 })
        //       this.getRequestWork();
        //     }
    
        //   }).catch(err => console.log(err))
    
        })
      }


    updatePost(){

        if(this.state.userid == '' || this.state.postText == ''){
            Toast.show({
                text: 'Please fill the required field',
                buttonText: 'okay', duration: 3000
            })
            return
        }

        this.setState({isLoading: true})

        createPost(this.state.userid,this.state.postText, this.state.imageuri).then((res) => {
            console.log("RESS  : "  +  JSON.stringify(res))
            if(res.status == '1'){
                Toast.show({
                    text: 'Post has been successfully updated',
                    buttonText: 'okay', duration: 3000
                })

                this.setState({postText: '',imageuri:'', isLoading:false})
                
            }else{
                this.setState({isLoading: false})
            }
        }).catch((err) => this.setState({isLoading: false})
        )
    }



    render() {
        return (
            <View
                style={{ flex: 1, }}>

                {this.state.isLoading && <Loader></Loader>}   
                <Header androidStatusBarColor={Colors.Darkgrey} 
                style={{ backgroundColor:'#DDDDDD'}}>
                    <Left style={{flex:1,flexDirection:'row',paddingLeft:10}}>

                        <Image
                            style={{ width:100}}
                            resizeMode='contain'
                            source={require('../assets/title.png')}
                        />

                        {/* <Text style={{ fontSize:18,padding:10, color:'#fff',fontWeight:'bold' }}>{'Update Post  '}</Text> */}
                    </Left>
                    
                    <Right></Right>
                </Header>


                <ScrollView>

                <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: 'bold', fontSize: 14, marginBottom: 10 }}>Post Your Memory</Text>

                    <View style={styles.card}>
                        <TextInput
                            value={this.state.postText}
                            onChangeText={(postText) => this.setState({ postText })}
                            multiline={true}
                            placeholder="What is up?"
                            autoCapitalize="none"
                            // numberOfLines={2}
                            style={{
                                marginLeft: 15,

                            }}
                        >

                        </TextInput>
                    </View>

                   {this.state.imageuri != '' && 
                    
                    <View>
                        <Image
                            resizeMode={'cover'}
                            style={{  height: 280, margin:20, borderRadius:3 }}
                            source={{ uri: this.state.imageuri }}
                        />

                        <Icon 
                        onPress={() => this.setState({imageuri: ''})}
                        style={{ alignSelf: 'center', paddingLeft: 15, paddingRight: 10, position:'absolute', right:30,top:30 }} 
                        name="close"></Icon>

                    </View>    

                    } 


                    {this.state.imageuri == '' && 
                    <TouchableOpacity 
                    onPress={this.launchGallery.bind(this)}
                    style={{
                        height: 100, justifyContent: 'center',borderWidth:2,borderColor:Colors.GoogleLogin, margin: 20,
                        marginLeft: 20, marginRight: 20, marginTop: 20, borderRadius: 5
                    }}>
                        <Text style={{ textAlign: 'center', color: Colors.GoogleLogin, fontSize: 15, fontWeight: 'bold' }}>Upload Photos or Videos</Text>
                    </TouchableOpacity> }

                </ScrollView>

                <TouchableOpacity 
                onPress={this.updatePost.bind(this)}
                style={{ padding: 10, backgroundColor: Colors.appColor, margin: 20, marginLeft: 10, marginRight: 10, marginTop: 10, borderRadius: 5 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '700' }}>POST UPDATE</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        marginLeft: 20,marginRight:20, height:150,elevation:3,
        backgroundColor: '#fff', shadowColor: "#ddd",
        borderRadius: 3, borderColor: '#ddd',
        borderWidth: 1,
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    },
    modal: {
        marginLeft: 50, marginRight: 50, marginTop: 60, marginBottom: 60,
        backgroundColor: '#fff', padding: 15, paddingLeft: 20, paddingRight: 20
    },
})