import React from 'react'
import {
    StyleSheet, Text, View, AsyncStorage,
} from 'react-native'

import { Header, Left, Icon, Button, Right, Toast } from 'native-base'
import NetInfo from "@react-native-community/netinfo";
import Colors from '../Colors/Colors';
import { profileInfo } from '../services/requests';


class BookingSuccess extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            //artistid: this.props.navigation.getParam('artistid'),
            amount: this.props.navigation.getParam('amount'),
            bookingid: this.props.navigation.getParam('bookingid'),
            contact: this.props.navigation.getParam('contact')
        }

    }

    componentDidMount() {
      
        //this.fetchData(this.state.artistid)


    }

    fetchData(userid){
        NetInfo.isConnected.fetch().done((isConnected) => {
            if(isConnected){
                profileInfo(userid).then(res => {

                    console.log("RESPONSE === " + JSON.stringify(res))
                    
                    if(res.status == '1'){

                        console.log("FFFFFFFFFFFFFF")
                       
                        dispatch(fetchingSuccessful(res.data))
                    }else{
                        dispatch(fetchingFailed(res.data))
        
                        // alert(res.message)
                    }
                
                })
                .catch((err) => console.log("ERROR : " + err))
            }
            else{
                Toast.show({ text: 'No internet connection found!- Internet connection required to use this app', buttonText: 'okay', duration: 3000 })
                dispatch(noInternet())
            }
        })
    }


    render() {
        return (
            <View
                style={{ flex: 1, }}>
                <Header androidStatusBarColor={Colors.Darkgrey} style={{ backgroundColor:'#DDDDDD'}}>
                    <Left style={{ flexDirection: "row",flex:1 }}>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon style={{padding:5, color:Colors.Darkgrey}} name='arrow-back' />
                        </Button>
                        <Text style={{alignSelf:'center', fontSize: 18, padding: 10, color: Colors.Darkgrey, fontWeight: 'bold' }}>{'Your Booking  '}</Text>
                    </Left>
                    <Right></Right>
                </Header>


                <View style={{flexDirection:'row', padding:10}}>
                    <Text>Amount : </Text>
                    <Text>{this.state.amount} </Text>
                </View>
             
                <View style={{flexDirection:'row', padding:10}}>
                    <Text>Booking Id : </Text>
                    <Text>{this.state.bookingid}</Text>
                </View>

                <View style={{flexDirection:'row', padding:10}}>
                    <Text>Transaction : </Text>
                    <Text style={{fontWeight:'bold'}}>{"Successful "}</Text>
                </View>

                <View style={{flexDirection:'row', padding:10}}>
                    <Text>Contact : </Text>
                    <Text style={{fontWeight:"bold"}}>{this.state.contact}</Text>
                </View>

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


export default BookingSuccess