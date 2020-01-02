import React from 'react'
import {
    StyleSheet, Text, View, AsyncStorage,
    TouchableOpacity, Platform, DeviceEventEmitter, NativeModules,
    NativeEventEmitter,
} from 'react-native'

import { Header, Left, Icon, Button, Right, Toast } from 'native-base'

import RadioForm, { RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'

import Colors from '../Colors/Colors';
import { paymentApi, verifyTransaction } from '../services/requests';
//import paytm from 'react-native-paytm';
import Paytm from '@philly25/react-native-paytm';

var radio_props = [
    { label: 'Pay 10 %', value: 0 },
    { label: 'Pay Full Amount', value: 1 }
];

const paytmConfig = {
    MID: '',
    WEBSITE: '',
    CHANNEL_ID: '',
    INDUSTRY_TYPE_ID: '',
    CALLBACK_URL: '',
    checksumhash: '',
    ORDER_ID: '',
    mobile: '',
    email: '',
    custId: '',
}

class PayNow extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userid: null,
            userType: '',
            value: "0",
            amount: this.props.navigation.getParam('amount'),
            bookingid: this.props.navigation.getParam('bookingid'),
            artistid: this.props.navigation.getParam('artistid')
        }

    }

    async componentDidMount() {
        try {
            const userid = await AsyncStorage.getItem('USERID');
            const usertype = await AsyncStorage.getItem('USERTYPE');

            if (userid != null && usertype != null) {
                this.setState({ userid: userid, userType: usertype })
            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }

    }

    UNSAFE_componentWillMount() {
        Paytm.addListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse.bind(this));
    }

    componentWillUnmount() {
        Paytm.removeListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse.bind(this));
    }

    onPayTmResponse(response) {
        // Process Response
        // response.response in case of iOS
        // reponse in case of Android

        console.log("ONPAYTMMMMM  =" + JSON.stringify(response));


        var status = JSON.stringify(response)
        var jsonObject = JSON.parse(status);
        var txnresponse = '';
        if(Platform.OS=="ios"){
            jsonObject = jsonObject.response.replace("\\", "\\\\");
            txnresponse = JSON.parse(jsonObject)
        }else{
            txnresponse = jsonObject
        }


        verifyTransaction(txnresponse.ORDERID, this.state.userid, this.state.bookingid).then((responseJson) => {
            console.log("TRANSACTION_RESPONSE----" + JSON.stringify(responseJson))
            if (responseJson.status == "1") {
                Toast.show({
                    text: 'You have booked the artist successfully',
                    buttonText: 'okay', duration: 3000
                })
                this.props.navigation.replace("BookingSuccess", { amount: this.state.amount, bookingid: this.state.bookingid, contact:paytmConfig.mobile })
            }
        }).catch((error) => {
            console.log(error)
        })

    }


    onSelect(index, value) {
        this.setState({
            value: value
        })
    }

    onPay() {
        let amount = ''

        if (this.state.value == "0") {
            Toast.show({
                text: 'Please select amount',
                buttonText: 'okay', duration: 3000
            })
            return;
        } else if (this.state.value == "1") {
            let tenPercent = parseFloat(this.state.amount) * (10 / 100)
            amount = tenPercent.toString()
        } else {
            amount = this.state.amount
        }


        paymentApi(this.state.userid, amount, 'PAYTM').then((responseJson) => {
            console.log("RESPONSE----" + JSON.stringify(responseJson))

            if (responseJson.status == '1') {
                paytmConfig.MID = responseJson.mid,
                paytmConfig.WEBSITE = responseJson.website,
                paytmConfig.CHANNEL_ID = responseJson.channel_id,
                paytmConfig.INDUSTRY_TYPE_ID = responseJson.INDUSTRY_TYPE_ID,
                paytmConfig.CALLBACK_URL = responseJson.CALLBACK_URL,
                paytmConfig.checksumhash = responseJson.Checksum,
                paytmConfig.ORDER_ID = responseJson.orderid,
                paytmConfig.mobile = responseJson.mobile_no,
                paytmConfig.email = responseJson.email,
                paytmConfig.custId = responseJson.custId,


                // this.setState({ amount: responseJson.TXN_AMOUNT })

                console.log("DATA_____________" + JSON.stringify(paytmConfig))

                this.runTransaction(responseJson.amount);

            }

        }).catch((error) => {
            console.log(error)
        })

    }

    runTransaction(amount) {
        const details = {
            mode: 'Staging', // 'Staging' or 'Production'
            MID: paytmConfig.MID,
            INDUSTRY_TYPE_ID: paytmConfig.INDUSTRY_TYPE_ID,
            WEBSITE: paytmConfig.WEBSITE,
            CHANNEL_ID: paytmConfig.CHANNEL_ID,
            TXN_AMOUNT: amount, // String
            ORDER_ID: paytmConfig.ORDER_ID, // String
            EMAIL: paytmConfig.email, // String
            MOBILE_NO: paytmConfig.mobile, // String
            CUST_ID: paytmConfig.custId, // String
            CHECKSUMHASH: paytmConfig.checksumhash, //From your server using PayTM Checksum Utility 
            CALLBACK_URL: paytmConfig.CALLBACK_URL
        };

        console.log("details : " + JSON.stringify(details))
        Paytm.startPayment(details);

    }

    render() {
        return (
            <View
                style={{ flex: 1, }}>
                <Header androidStatusBarColor={"#505050"}
                    style={{ backgroundColor: '#DDDDDD' }}>
                    <Left style={{ flexDirection: "row" }}>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon style={{ color: Colors.Darkgrey }} name='arrow-back' />

                        </Button>
                        <Text style={{ fontSize: 18, padding: 10, color: Colors.Darkgrey, fontWeight: 'bold' }}>{'Pay '}</Text>
                    </Left>

                    <Right></Right>
                </Header>

                {/* <View style={{ backgroundColor: '#DDDDDD', flex: 1, justifyContent: 'center', alignSelf: 'center' }}> */}
                {/* <RadioForm
                        formHorizontal={true}
                        labelHorizontal={false}
                        radio_props={radio_props}
                        initial={0}
                        onPress={(value) => { this.setState({ value: value }) }}
                    /> */}


                <View style={{ flex: 1, justifyContent: 'center' }}>

                    <Text style={{ marginLeft: 20, fontWeight: 'bold' }}>Confirm this booking by paying </Text>
                    <RadioGroup
                        style={{ flexDirection: 'row' }}
                        onSelect={(index, value) => this.onSelect(index, value)}
                    >
                        <RadioButton
                            style={{ padding: 20 }}
                            value={'1'} >
                            <Text>10 % of the amount</Text>
                        </RadioButton>


                        <RadioButton
                            style={{ padding: 20 }}
                            value={'2'}>
                            <Text>Full Amount</Text>
                        </RadioButton>

                    </RadioGroup>


                    <TouchableOpacity
                        onPress={() => this.onPay()}
                        style={{ borderWidth: 2, borderColor: Colors.appColor, padding: 10, flexDirection: 'row', margin: 5 }}>
                        <Text style={{ flex: 1, color: Colors.appColor, fontWeight: 'bold', fontSize: 16 }}>{" Confirm and Pay "}</Text>
                        <Icon style={{ color: '#909090', fontSize: 20, paddingRight: 15, }} color='#BBBBBB' name='arrow-forward'></Icon>
                    </TouchableOpacity>
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


export default PayNow