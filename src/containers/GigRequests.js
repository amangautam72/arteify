import React from 'react'
import { StyleSheet, Text, View, Image, FlatList, AsyncStorage, Alert } from 'react-native'

import { Header, Left, Icon, Button, Right, Toast } from 'native-base'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';

import { connect } from 'react-redux'
import { fetchData } from '../actions/BookingDataAction';
import { updateBookingStatus } from '../services/requests';

import NetInfo from "@react-native-community/netinfo";
import Colors from '../Colors/Colors';
import moment from 'moment';
import { bookingInfo } from '../services/requests';


class GigRequests extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userid: null,
            userType: "",
            bookingList: []
        }
    }

    async componentDidMount() {

        try {

            const userid = await AsyncStorage.getItem('USERID');
            const usertype = await AsyncStorage.getItem('USERTYPE');
        
            
            if (userid != null) {
                this.setState({userid: userid, userType: usertype})
                console.log("USERTYPE :==  " + usertype)
                //this.props.fetchData(parseInt(userid), usertype)
                NetInfo.isConnected.fetch().done((isConnected) => {
                    if(isConnected){
                        bookingInfo(userid, usertype).then(res => {
        
                            console.log("RESPONSE === " + JSON.stringify(res))
                            
                            if(res.status == '1'){
                                this.setState({bookingList: res.data.bookinginfo.reverse()})
                                
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

            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }



    }

    // componentDidUpdate(props) {

    //     if (props.response != this.props.response) {
    //         if (props.hasError) {
    //             Toast.show({ text: 'Something went wrong', buttonText: 'okay', duration: 3000 })
    //             return
    //         }

    //         if(this.props.response.bookinginfo != undefined){
    //             this.setState({ bookingList: this.props.response.bookinginfo.reverse() })
    //         }
            
    //     }
    // }


    onAccept(item){
        Alert.alert(
            '',
            'Do you really want to accept this gig?',
            [
             
              {
                text: 'Yes',
                onPress: () => {
                    this.updateBooking(item.id,item.userid,"2")
                },
                style: 'cancel',
              },
              {text: 'No', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );  
       
    }

    onDecline(item){
        Alert.alert(
            '',
            'Do you really want to reject this gig?',
            [
             
              {
                text: 'Yes',
                onPress: () => {
                    this.updateBooking(item.id,item.userid,"3")
                },
                style: 'cancel',
              },
              {text: 'No', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );  
    }

    updateBooking(bookingid,userid,status){
             
        NetInfo.isConnected.fetch().done((isConnected) => {
            if(isConnected){

                updateBookingStatus(bookingid,userid,status).then(res => {

                    console.log("RESPONSE === " + JSON.stringify(res))
                    if(res.status == "1"){
                        Toast.show({ text: 'Booking has been accepted successfully', buttonText: 'okay', duration: 3000 })
                        this.props.fetchData(parseInt(this.state.userid), this.state.userType)
                    }
                    
                
                })
                .catch((err) => console.log("ERROR : " + err))
            }
            else{
                Toast.show({ text: 'No internet connection found!- Internet connection required to use this app', buttonText: 'okay', duration: 3000 })
            }
        })
    }


    renderItem = ({ item, index }) => (
        item.userid != this.state.userid && 
        <View style={styles.card}>

            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 25, fontWeight: '600' }}>Booking Id : </Text>
                <Text style={{ fontSize: 25, fontWeight: '600', flex: 1, textAlign: 'right' }}>{item.id}</Text>
            </View>

            <Text style={{ fontSize: 20, fontWeight: '500' }}>Live Band</Text>
            <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:'bold'}}>{'Event Date :  '}</Text>
                <Text>{moment.unix(parseFloat(item.date)/1000).format('DD MMMM YYYY')}</Text>
                <Text> {`(Slot ${item.slot})`}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <Text>Client who has booked : </Text>
                <Text>{item.ufname}</Text>
            </View>

            <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:'bold'}}>{'Event Venue :  '}</Text>
                <Text>{item.city}</Text>
            </View>


           {item.status == 4 && 
             <View style={{ flexDirection: 'row', padding: 5, alignSelf: 'flex-end' }}>
             <TouchableOpacity
             onPress={() => this.onAccept(item)}>
                 <Image
                     style={{ width: 20, height: 20, paddingLeft: 10, paddingRight: 15 }}
                     resizeMode='contain'
                     source={require('../assets/check.png')}></Image>
             </TouchableOpacity>
             <TouchableOpacity
              onPress={() => this.onDecline(item)}>
                 <Icon style={{ alignSelf: 'center', paddingLeft: 15, paddingRight: 10 }} name="close"></Icon>
             </TouchableOpacity>
         </View>
            }

            { item.status == 2 && <Text style={{alignSelf:'flex-end', color:'red'}}>Confirmation Pending</Text> }
            { item.status == 1 && <Text style={{alignSelf:'flex-end', color:'green'}}>Booking Confirmed</Text> }
            { item.status == 3 && <Text style={{alignSelf:'flex-end', color:'red'}}>You have rejected this request</Text> }

        </View>
    );

    render() {
        return (
            <View
                style={{ flex: 1, }}>
                 <Header style={{ backgroundColor: Colors.appColor }}>
                    <Left style={{flex:1, flexDirection: "row" }}>
                        <Button transparent
                            onPress={() => this.props.navigation.navigate('Profile')}>
                            <Icon name='arrow-back' />

                        </Button>
                        <Text style={{ fontSize: 18, padding: 10, color: '#fff', fontWeight: 'bold' }}>{'Gig Requests '}</Text>
                    </Left>

                    <Right></Right>
                </Header>
                <FlatList
                    data={this.state.bookingList}
                    // extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                />

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


// function mapStateToProps(state) {
//     return {
//         response: state.fetchDataReducer.data,
//         hasError: state.fetchDataReducer.error
//     }
// }

// function mapDispatchToProps(dispatch) {
//     return {
//         fetchData: (userid, usertype) => dispatch(fetchData(userid, usertype))
//     }
// }


export default GigRequests