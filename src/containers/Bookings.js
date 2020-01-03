import React from 'react'
import { StyleSheet, Text, View, RefreshControl, FlatList, AsyncStorage } from 'react-native'

import { Header, Left, Icon, Button, Right,Toast } from 'native-base'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';

import NetInfo from "@react-native-community/netinfo";

import { connect } from 'react-redux'
import { fetchData } from '../actions/BookingDataAction';
import Colors from '../Colors/Colors';
import moment from 'moment';
import { bookingInfo } from '../services/requests';


const listData = ['Live Musician', 'Magician', 'Painter', 'Movie Play', 'Dancer', 'Guitarist', 'Dj']
class Bookings extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userid: null,
            userType: '',
            bookingList: [],
            loading: true
        }

    }

    async componentDidMount() {
        try {
            const userid = await AsyncStorage.getItem('USERID');
            const usertype = await AsyncStorage.getItem('USERTYPE');

            if (userid != null && usertype != null) {
                this.setState({userid: userid, userType: usertype})
  
                //this.props.fetchData(parseInt(userid), usertype)
                // NetInfo.isConnected.fetch().done((isConnected) => {
                //     if(isConnected){
                //         bookingInfo(userid, usertype).then(res => {
        
                //             console.log("RESPONSE === " + JSON.stringify(res))
                            
                //             if(res.status == '1'){
                //                 this.setState({bookingList: res.data.bookinginfo.reverse()})
                                
                //             }else{
                //                 Toast.show({ text: 'Something went wrong', buttonText: 'okay', duration: 3000 })
                
                //                 // alert(res.message)
                //             }
                        
                //         })
                //         .catch((err) => console.log("ERROR : " + err))
                //     }
                //     else{
                //         Toast.show({ text: 'No internet connection found!- Internet connection required to use this app', buttonText: 'okay', duration: 3000 })
                //     }
                // })

                this.getBookingList()

            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }      

    }

    getBookingList(){
        NetInfo.isConnected.fetch().done((isConnected) => {
            if(isConnected){
                bookingInfo(this.state.userid, this.state.userType).then(res => {

                    console.log("RESPONSE === " + JSON.stringify(res))
                    
                    if(res.status == '1'){
                        this.setState({bookingList: res.data.bookinginfo.reverse(), loading:false})
                        
                    }else{
                        Toast.show({ text: 'Something went wrong', buttonText: 'okay', duration: 3000 })
                        this.setState({loading:false})
                        // alert(res.message)
                    }
                
                })
                .catch((err) => this.setState({loading:false}))
            }
            else{
                Toast.show({ text: 'No internet connection found!- Internet connection required to use this app', buttonText: 'okay', duration: 3000 })
            }
        })
    }

    componentDidUpdate(props) {

        if (props.response != this.props.response) {
            if (props.hasError) {
              Toast.show({ text: 'Something went wrong', buttonText: 'okay', duration: 3000 })
              return
            }

            if(this.props.response.bookinginfo != undefined){
                this.setState({bookingList: this.props.response.bookinginfo.reverse()})
            }   
          }
    }


    renderItem = ({ item, index }) => (
        item.artistid == this.state.userid ? null :
        <View style={styles.card}>
           
            <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:25, fontWeight:'600'}}>Booking Id : </Text>
                <Text style={{fontSize:25, fontWeight:'600', flex:1, textAlign:'right'}}>{item.id}</Text>
            </View>

            <Text style={{fontSize:20, fontWeight:'500'}}>Live Band</Text>
            <View style={{flexDirection:'row', marginTop:5}}>
                <Text>Artist Booked : </Text>
                <Text>{item.afname}</Text>
            </View>

            <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:'bold'}}>{'Event Date :  '}</Text>
                <Text>{moment.unix(parseFloat(item.date)/1000).format('DD MMMM YYYY')}</Text>
                <Text> {`(Slot ${item.slot})`}</Text>
            </View>

            <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:'bold'}}>{'Event Venue :  '}</Text>
                <Text>{item.city}</Text>

                <View style={{flexDirection:'row',flex:1, justifyContent:'flex-end'}}>
                    
                    <Text style={{color:Colors.appColor, fontWeight:'bold'}}>{item.price + " Rs. "}</Text>
                </View>
            </View>

            {this.state.userid != item.artistid && item.status == 2 && <View style={{flexDirection:'row',paddingTop:5, alignSelf:'flex-end'}}>
                <Text style={{alignSelf:'center', paddingRight:5}}>To confirm this booking</Text>
                <TouchableOpacity
                onPress={() => this.props.navigation.navigate('PayNow',{amount: item.price, bookingid: item.id, artistid:item.artistid})}
                style={{backgroundColor:Colors.green, borderRadius:3, padding:5}}>
                    <Text style={{color:"#ffffff"}}>Pay Now</Text>
                </TouchableOpacity>
            </View> 
            }
            {/* { this.state.userid == item.artistid && item.status == 2 && <Text style={{alignSelf:'flex-end', color:'red'}}>Confirmation Pending</Text> } */}
           {item.status == 4 &&  <Text
            style={{alignSelf:'flex-end', color:'red'}}>Pending</Text>}
           {item.status == 3 &&  <Text style={{alignSelf:'flex-end', color:'red'}}>Rejected</Text>}
           {item.status == 1 &&  <Text style={{alignSelf:'flex-end', color:'green'}}>Booking Confirmed</Text>}
           {/* {item.status == 1 && <Text>{`Contact : `}</Text>} */}

            

        </View>
    );

    onRefresh() {
        this.getBookingList()
       
    }

    render() {
        return (
            <View
                style={{ flex: 1, }}>
                 <Header androidStatusBarColor={Colors.Darkgrey}
                    style={{ backgroundColor: '#DDDDDD' }}>
                    <Left style={{ flexDirection: "row" }}>
                        <Button transparent
                            onPress={() => this.props.navigation.navigate('Profile')}>
                            <Icon style={{color:Colors.Darkgrey}} name='arrow-back' />

                        </Button>
                        <Text style={{ fontSize: 18, padding: 10, color: Colors.Darkgrey, fontWeight: 'bold' }}>{'Bookings '}</Text>
                    </Left>

                    <Right></Right>
                </Header>

                <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.loading} 
                        onRefresh={() => this.onRefresh()}/>
                        
                }>

                <FlatList
                    data={this.state.bookingList}
                    // extraData={this.state}
                    keyExtractor={(item,index) => index.toString()}
                    renderItem={this.renderItem}
                />

                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        backgroundColor: '#fff', shadowColor: "#ddd",
        borderRadius:3,borderColor:'#ddd',
        borderWidth:1,padding:10,
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

export default Bookings
//export default connect(mapStateToProps, mapDispatchToProps)(Bookings)