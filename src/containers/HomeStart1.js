import React from 'react'
import { StyleSheet, Text, View, ImageBackground, Image, AsyncStorage, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';
import Colors from '../Colors/Colors';

export default class HomeStart extends React.Component {

    constructor() {
        super()
        this.state = {

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

    async storeUserType(type) {
        console.log("STORRREEE NOW  : " + type)
        try {
            await AsyncStorage.setItem("USERTYPE", type);


            if (type == '2')
                this.props.navigation.navigate('RegisterArtist')
            if (type == '3')
                this.props.navigation.navigate('SignUp')

        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }
    }


    render() {
        return (
            <ImageBackground
                style={{ flex: 1,  alignItems: 'center',backgroundColor:'#FFFFFF' }}
                source={require('../assets/background.jpg')}
                >

                <View style={[styles.card,{marginTop:200}]}>
                <Image style={{width:100,height:100, }}
                    source={require('../assets/arteifylogo.png')}></Image>
                </View>
               

                

                <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 100, }}>
                    <View style={styles.card}>
                        <TouchableOpacity
                            onPress={() => this.storeUserType("3")}
                            style={{ borderRadius: 5 }}>
                            <Image
                                style={{ width: 150, height: 80, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
                                //source={{ uri: 'https://www.flare.com/wp-content/uploads/2016/01/prof1-600x409.jpg' }}
                                source={require('../assets/doors.jpg')}
                            />

                            <Text style={{ alignSelf: 'center', padding: 10, fontSize: 14, fontWeight: 'bold',color: '#505050' }}>{'Find an Artist '}</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.card}>
                        <TouchableOpacity
                            onPress={() => this.storeUserType("2")}
                            style={{ borderRadius: 5 }}>
                            <Image
                               
                                style={{ width: 150, height: 80, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
                                //source={{ uri: 'https://melbournesymphonyorchestra-assets.s3.amazonaws.com/assets/Image/4995-fitandcrop-486x486.jpg' }}
                                source={require('../assets/guitar.jpg')}
                            />

                            <Text style={{ alignSelf: 'center', padding: 10, fontSize: 14, fontWeight: 'bold',color: '#505050' }}>{'Become an Artist '}</Text>
                        </TouchableOpacity>
                    </View>

                </View>


                <Text
                    onPress={() => this.props.navigation.navigate('LoginPage')}
                    style={{padding:10,
                        position: 'absolute', left: 10, bottom: 20,
                        fontSize: 15, fontWeight: 'bold', color: '#fff' 
                    }}>
                    {"SIGN IN "}</Text>

                <Text
                    onPress={() => this.props.navigation.navigate('SignUp')}
                    style={{padding:10,
                        position: 'absolute', right: 10, bottom: 20,
                        fontSize: 15, fontWeight: 'bold', color: '#fff'
                    }}>SKIP</Text>


            </ImageBackground>
        )
    }
}


const styles = StyleSheet.create({
    card: {
        margin: 10, elevation: 10,
        shadowColor: "#ddd",
        borderColor: '#ddd', backgroundColor: '#fff', borderRadius: 7,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 6,
            width: 6
        }
    }
})