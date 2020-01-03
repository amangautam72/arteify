import React from 'react'
import { Text, View, Image, TextInput, StyleSheet, AsyncStorage, FlatList, TouchableOpacity } from 'react-native'

import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'

import moment from 'moment'

import DatePicker from 'react-native-datepicker'
import CalendarPicker from 'react-native-calendar-picker';
import { bookAction } from '../actions/BookArtistAction';
import { Toast, Header, Left, Button, Icon, Right } from 'native-base';
import { getBookingDetails } from '../services/requests';
import Colors from '../Colors/Colors';
import { SERVER_ADDRESS } from '../services/server';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';


class BookArtist extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedDate: "",
            venue: "",
            userid: null,
            requestUserImage: this.props.navigation.getParam('image'),
            request: this.props.navigation.getParam('request'),
            availableSlots: this.props.navigation.getParam('slots'),
            //for disable a slot I defined selected = 3
            slots: [{ 'name': 'Slot 1', 'selected': 0, slotNo: 1 }, { 'name': 'Slot 2', 'selected': 0, slotNo: 2 }, { 'name': 'Slot 3', 'selected': 0, slotNo: 3 }],
            selectedSlot: 0,
            bookingInfo: [],
            location: 'Select event location',
            locationid: 0,
        };
        this.onDateChange = this.onDateChange.bind(this);

    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = (locationName, id) => {
        // Toast.show({ text: item, buttonText: 'okay', duration: 3000 })
        this.setState({ location: locationName, locationid: id })
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    onDateChange(date) {

        let bookingInfo = this.state.bookingInfo

        let slots = [{ 'name': 'Slot 1', 'selected': 0, slotNo: 1 }, { 'name': 'Slot 2', 'selected': 0, slotNo: 2 }, { 'name': 'Slot 3', 'selected': 0, slotNo: 3 }]
        for (let i = 0; i < bookingInfo.length; i++) {
            if (bookingInfo[i].date == date) {
                if (bookingInfo[i].slot == '3') {
                    slots[2].selected = 3
                } else if (bookingInfo[i].slot == '2') {
                    slots[1].selected = 3
                } else if (bookingInfo[i].slot == '1') {
                    slots[0].selected = 3
                }
                // if (slots.includes(bookingInfo[i].slot)) {
                //     var index = slots.indexOf(bookingInfo[i].slot);
                //     if (index > -1) {
                //         slots.splice(index, 1);
                //     }
                // }
            } else {

            }
        }


        this.setState({
            selectedDate: date, slots: slots
        });

    }

    async componentDidMount() {

        try {
            const userid = await AsyncStorage.getItem('USERID');

            if (userid != null) {

                this.setState({ userid: parseInt(userid) })

                getBookingDetails(this.state.request.id).then(res => {
                    console.log("RESPONSE :  " + JSON.stringify(res))
                    if (res.status == '1') {
                        this.setState({ bookingInfo: res.data })
                    }
                }).catch(err => console.log(err))

            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }
    }

    componentWillReceiveProps(props) {

        if (props != this.props) {

            if (props.hasError) {
                Toast.show({ text: "Some Error", buttonText: 'okay', duration: 3000 })
            } else {
                this.props.navigation.goBack()
                Toast.show({ text: 'Your request has been sent to artist, Please wait for a while!', buttonText: 'okay', duration: 3000 })
            }
        }

    }



    bookArtist = () => {

        var date = this.state.selectedDate + ""
        var userid = this.state.userid
        var requestid = this.state.request.id
        var selectedSlot = this.state.selectedSlot
        var city = this.state.location
        var venue = this.state.venue

        if (date == "") {
            Toast.show({
                text: 'Please select date',
                buttonText: 'okay', duration: 3000
            })

            return
        }
        if (selectedSlot == 0) {
            Toast.show({
                text: 'Please select slot',
                buttonText: 'okay', duration: 3000
            })

            return
        }
        if (city == 'Select event location') {
            Toast.show({
                text: 'Please select event city',
                buttonText: 'okay', duration: 3000
            })

            return
        }

        if (venue == "") {
            Toast.show({
                text: 'Please enter venue',
                buttonText: 'okay', duration: 3000
            })

            return
        }


        if (userid == null || userid == undefined || requestid == null || requestid == undefined) {
            Toast.show({
                text: 'Something went wrong',
                buttonText: 'okay', duration: 3000
            })
        }

        this.props.bookNow(requestid, this.state.userid, date, selectedSlot, city, venue)
    }

    onSlot = (item) => {


        var slots = this.state.slots

        for (let i = 0; i < slots.length; i++) {

            if (item.slotNo == slots[i].slotNo) {
                slots[i].selected = 1
            } else {
                if (slots[i].selected != 3)
                    slots[i].selected = 0
            }

        }

        this.setState({ slots: slots, selectedSlot: item.slotNo })

    }

    renderSlot = ({ item, index }) => (
        this.state.availableSlots.includes((index + 1).toString()) &&
        <View >
            <TouchableOpacity
                onPress={() => item.selected == 0 && this.onSlot(item)}
                style={[styles.card, { backgroundColor: item.selected == 3 ? '#ddd' : item.selected == 1 ? Colors.appColor : '#fff' }]}>
                <Text style={{ paddingLeft: 20, paddingRight: 20, color: item.selected == 1 ? '#fff' : Colors.appColor, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ fontSize: 10, textAlign: 'center' }}>{item.slotNo == 1 ? "7 am to 2 pm" : item.slotNo == 2 ? "2 pm to 6 pm" : "6 pm to 12 pm"}</Text>
            </TouchableOpacity>


        </View>
    );

    render() {

        const { selectedDate } = this.state;
        const startDate = selectedDate ? selectedDate.toString() : '';

        const today = new Date();
        const maxDate = new Date()
        maxDate.setDate(maxDate.getDate() + 60)
        // const selectedDay = this.state.selectedDate

        return (
            <ScrollView
                style={{ flex: 1, paddingBottom: 20 }}>

                <View style={{
                    shadowColor: '#000000',
                }}>

                    <Header style={{ backgroundColor: Colors.appColor }}>
                        <Left style={{ flexDirection: "row" }}>
                            <Button transparent
                                onPress={() => this.props.navigation.goBack()}>
                                <Icon style={{ color: Colors.Darkgrey }} name='arrow-back' />

                            </Button>
                            <Text style={{ fontSize: 18, padding: 10, color: Colors.Darkgrey, fontWeight: 'bold' }}>{"Book "}</Text>
                        </Left>

                        <Right></Right>
                    </Header>

                    <View 
                    style={{
                        backgroundColor: Colors.appColor,
                        flexDirection: 'row', paddingLeft:10,paddingRight:10,paddingBottom:20
                    }}>
                        {this.state.requestUserImage != null ?
                            <Image
                                style={{ width: 100, height: 100,borderRadius:10 }}
                                source={{ uri: SERVER_ADDRESS + '/images/' + this.state.requestUserImage }}
                            /> :
                            <Image
                                style={{ width: 100, height: 100,borderRadius:10 }}
                                source={require('../assets/man.png')}
                            />}

                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text style={{ color:'#ffffff', fontWeight: 'bold', fontSize: 16, }}
                            >{this.state.request.username.toUpperCase()}</Text>
                            <Text style={{ fontWeight: 'bold' }}>{this.state.request.catname}</Text>
                            <Text numberOfLines={3} style={{ fontSize: 14, textAlign: 'left',  }}>{this.state.request.description}</Text>
                        </View>

                    </View>
                </View>

                <View style={{alignSelf:'stretch', height:3, backgroundColor:'#DDDDDD'}}></View>

                <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 15, marginTop: 10 }}>{'SELECT DATE'}</Text>

                <CalendarPicker
                    onDateChange={this.onDateChange}
                    minDate={today}
                    maxDate={maxDate}
                    // todayTextStyle={{flex:1,fontSize:14, color: '#ddd',textAlign:'center',
                    // backgroundColor:'#fff',alignSelf:'stretch',paddingTop: 5 }}
                    selectedDayTextColor={'#fff'}
                    textStyle={{ fontSize: 14 }}
                    selectedDayStyle={{ backgroundColor: Colors.appColor, fontWeight: 'bold' }}
                //todayBackgroundColor={'#fff'}
                //todayTextStyle={{ color: selectedDate == today ? '#fff' : '#000', }}
                />

                {this.state.selectedDate != '' &&
                    <View>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: 'bold', paddingLeft: 15,
                            }}>{'AVAILABLE SLOTS'}</Text>


                        <FlatList
                            style={{ alignSelf: 'center' }}
                            horizontal={true}
                            data={this.state.slots}
                            // extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderSlot}
                        />
                    </View>

                }

                <View style={{ marginLeft: 15, marginRight: 15, borderBottomWidth: 2, borderBottomColor: '#ddd', paddingBottom: 5, }}>
                    <Text style={{
                        fontSize: 14, paddingBottom: 5,
                        fontWeight: 'bold',
                    }}>Event City</Text>
                    <Menu
                        ref={this.setMenuRef}
                        button={<Text onPress={this.showMenu}>{this.state.location}</Text>}
                    >
                        <MenuItem onPress={() => this.hideMenu('Delhi', 1)}>Delhi</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={() => this.hideMenu('Gurgaon', 2)}>Gurgaon</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={() => this.hideMenu('Noida', 3)}>Noida</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={() => this.hideMenu('Faridabad', 4)}>Faridabad</MenuItem>
                    </Menu>

                </View>

                <View style={{ marginLeft: 15, marginRight: 15, marginTop: 10, borderBottomWidth: 2, borderBottomColor: '#ddd' }}>

                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Venue</Text>
                    <TextInput
                        autoCapitalize="none"
                        value={this.state.venue}
                        onChangeText={(venue) => this.setState({ venue })}
                        multiline={false}
                        placeholder="Enter venue"
                        style={{ padding: 0, }}
                    >
                    </TextInput>

                </View>

                <Text style={{ textAlign: 'right', padding: 10, marginRight:10 }}>Average Rate :
                    <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold' }}> {this.state.request.budget}</Text>
                </Text>

                <TouchableOpacity
                    onPress={() => this.bookArtist()}
                    style={{
                        backgroundColor: Colors.appColor, borderRadius: 5,
                        padding: 10, marginLeft: 20, marginRight: 20, marginBottom: 20
                    }}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginLeft: 10, fontWeight: 'bold' }}>BOOK NOW</Text>
                </TouchableOpacity>

            </ScrollView>
        )
    }
}



const styles = StyleSheet.create({
    card: {
        margin: 10, padding: 10, elevation: 5,
        backgroundColor: '#fff', shadowColor: "#ddd",
        borderWidth: 1, borderColor: Colors.appColor, borderRadius: 5,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    },
    selectedCard: {
        margin: 10, padding: 10, elevation: 5,
        backgroundColor: Colors.appColor, shadowColor: "#ddd",
        borderWidth: 1, borderColor: Colors.appColor, borderRadius: 5,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    },
    slideContainer: {
        height: 100,
    },
    slide: {
        padding: 15,
        height: 100,
        backgroundColor: '#FEA900',
    },
    slide1: {
        backgroundColor: '#FEA900',
    },
    slide2: {
        backgroundColor: '#B3DC4A',
    },
    slide3: {
        backgroundColor: '#6AC0FF',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        alignSelf: 'center'
    },
});

function mapStateToProps(state) {
    return {
        response: state.postDataReducer.data,
        hasError: state.postDataReducer.error
    }
}

function mapDispatchToProps(dispatch) {
    return {
        bookNow: (requestid, userid, timestamp, showtime, eventcity, venue) => dispatch(bookAction(requestid, userid, timestamp, showtime, eventcity, venue))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BookArtist)