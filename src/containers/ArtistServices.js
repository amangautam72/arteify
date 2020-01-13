import React from 'react'
import { StyleSheet, Text, View, Image, FlatList, AsyncStorage,
     Alert, TouchableHighlight, RefreshControl } from 'react-native'

import { Header, Left, Icon, Button, Right, Toast } from 'native-base'
import { ScrollView, } from 'react-native-gesture-handler';

import NetInfo from "@react-native-community/netinfo";

import Colors from '../Colors/Colors';

import { deleteRequest, profileInfo } from '../services/requests';

class ArtistServices extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userid: null,
            userType: '',
            services: [],
            loading: true
        }

    }

    async componentDidMount() {

        try {

            const userid = await AsyncStorage.getItem('USERID');
            const usertype = await AsyncStorage.getItem('USERTYPE');

            if (userid != null && usertype != null) {
                this.setState({ usertype: usertype, userid: userid })

                NetInfo.isConnected.fetch().done((isConnected) => {
                    if (isConnected) {
                       this.getServices(userid)
                    }
                    else {
                        Toast.show({ text: 'No internet connection found!- Internet connection required to use this app', buttonText: 'okay', duration: 3000 })
                    }
                })

            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }
    }

    getServices(userid){
        profileInfo(parseInt(userid)).then(res => {

            console.log("RESPONSE === " + JSON.stringify(res))

            if (res.status == '1') {
                if (Object.keys(res.data).length != 0 && res.data.constructor === Object) {
                    this.setState({
                        services: res.data.userinfo.postinfo, loading:false
                    })
                }else{
                    this.setState({loading:false})
                }

            }

        })
            .catch((err) => this.setState({loading:false}))
    }

    onRemovePress(requestId) {
        Alert.alert(
            '',
            'Do you really want to delete this request?',
            [

                {
                    text: 'Yes',
                    onPress: () => {
                        deleteRequest(requestId).then((res) => {
                            console.log("RESSSS :   " + JSON.stringify(res))
                            if (res.status == '1') {
                                this.getServices(this.state.userid)
                            }
                        })
                    },
                    style: 'cancel',
                },
                { text: 'No', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

    renderRequest = ({ item, index }) => (
        <View style={styles.card}>
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('CreateRequest', {
                    edit: '1', requestid: item.id,
                    title: item.title, description: item.description,
                    category: item.catname, categoryId: item.category,
                    numOfPeople: item.team, duration: item.duration,
                    budget: item.budget, workLinks: item.url != "" ? item.url.split(',') : [],
                    slot: item.slot.split(','),
                    reload: (userid) => this.reloadPage(userid)
                })}
                style={{
                    borderRadius: 2,
                }}>

                <View style={{ backgroundColor: '#fff' }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>


                    <View style={{ height: 1, marginTop: 4, backgroundColor: '#ddd' }}></View>
                    <Text style={{ paddingTop: 5, paddingBottom: 5 }}>{item.description}</Text>
                    {/* </View> */}

                    <Text style={{ fontWeight: 'bold', marginTop: 10 }}>DURATION : <Text>{item.duration}</Text></Text>
                    <Text style={{ fontWeight: 'bold' }}>CHARGE : <Text style={{ fontWeight: '600' }}>{"Rs. " + item.budget}</Text></Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ flex: 1 }}>Category : <Text style={{ fontWeight: 'bold' }}>{item.catname}</Text></Text>

                        <TouchableHighlight
                            onPress={() => this.onRemovePress(item.id)}
                            style={{ backgroundColor: '#fff' }}>
                            <Image
                                style={{ height: 25, width: 25 }} source={require('../assets/delete.png')}></Image>

                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    )


    onRefresh() {
        this.getServices(this.state.userid)
       
    }

    render() {
        return (
            <View
                style={{ flex: 1, }}>
                <Header androidStatusBarColor={Colors.Darkgrey} style={{ backgroundColor: '#DDDDDD' }}>
                    <Left style={{ flexDirection: "row" }}>
                        <Button transparent
                            onPress={() => this.props.navigation.navigate('Profile')}>
                            <Icon style={{ color: Colors.Darkgrey }} name='arrow-back' />

                        </Button>
                        <Text style={{ fontSize: 18, padding: 10, color: Colors.Darkgrey, fontWeight: 'bold' }}>{'Services '}</Text>
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
                        data={this.state.services}
                        // extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderRequest}
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

export default ArtistServices