import React from 'react'
import {
    Text, View, Image, FlatList, StyleSheet,
    Dimensions, TouchableOpacity, AsyncStorage, SafeAreaView
} from 'react-native'
import { WebView } from 'react-native-webview';
import { ScrollView } from 'react-native-gesture-handler';

import SwipeableViews from 'react-swipeable-views-native';
import { Icon, Button, Toast } from 'native-base';
import GridList from 'react-native-grid-list';
import { getRequestWork, profileInfo, followUnfollow, followCheck } from '../services/requests';
import Colors from '../Colors/Colors';
import { SERVER_ADDRESS } from '../services/server';


const listData = ['Live Musician', 'Magician', 'Dancer', 'WOWWW']
const width = Dimensions.get('window').width
export default class ArtistRequestBook extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            flatListVisibility: false,
            request: this.props.navigation.getParam('request'),
            currentUserId: '',
            url: this.props.navigation.getParam('url'),
            work: [],
            userRequest: [],
            userInfo: {},
            following: 'Follow'
        }
    }

    async componentDidMount() {

        this.getRequestWork(this.state.request.id)
        this.getProfileInfo()


        try {

            const userid = await AsyncStorage.getItem('USERID');

            if (userid != null) {

                this.setState({ currentUserId: userid })

                this.followCheck(userid)

            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }


    }

    followCheck(currentuserid) {
        followCheck(currentuserid, this.state.request.userid).then((res) => {

            if (res.status == '1') {
                this.setState({ following: 'Following' })
            } else {
                this.setState({ following: 'Follow' })
            }
        }).catch((err) => console.log(err))
    }

    getRequestWork(requestid) {
        getRequestWork(requestid).then((res) => {
            console.log("REQUEST WORK : " + JSON.stringify(res))
            if (res.status == '1') {
                this.setState({ work: res.data.imagevideo })
            }

        }).catch((err) => console.log(err))
    }

    getProfileInfo() {
        profileInfo(this.state.request.userid).then((response) => {
            console.log("RESPONSE PROFILE: " + JSON.stringify(response))
            if (response.status == '1') {
                this.setState({ userRequest: response.data.userinfo.postinfo, userInfo: response.data.userinfo, userBooking: response.data })


            }
        }).catch((err) => console.log(err))
    }


    onRequestPress = (item) => {


        this.setState({ request: item, url: item.url.split(',') })


        this.getRequestWork(item.id);
        this.refs._scrollview.scrollTo({ x: 0, y: 0, animated: true })
        //this.getProfileInfo() 
    }

    // <Image style={{ height: 25, width: 25 }} source={require('../assets/artist.png')}></Image>

    renderItem = ({ item, index }) =>
        (this.state.request.id != item.id ? <View style={styles.card}>
            <TouchableOpacity
                onPress={() => this.onRequestPress(item)}
                style={{ flexDirection: 'column', borderRadius: 2, }}>
                <Image style={{ height: 120, flex: 1 }}
                    source={{ uri: 'https://news.artnet.com/app/news-upload/2019/02/IMG_5085-768x1024.jpeg' }}></Image>

                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 14 }}>{item.title}</Text>
                <Text style={{ marginLeft: 10, marginBottom: 10, fontWeight: 'bold', fontSize: 14 }}>{item.catname}</Text>

            </TouchableOpacity>
        </View> : null)



    followUnfollow = () => {
        if (this.state.currentUserId == '') {
            Toast.show({
                text: 'Please join artistHire to follow',
                buttonText: 'okay', duration: 3000
            })
            this.props.navigation.navigate('LoginPage')
            return
        }

        followUnfollow(this.state.currentUserId, this.state.request.userid, this.state.following).then((res) => {

            if (res.status == '1') {
                if (this.state.following == 'Follow') {
                    this.setState({ following: 'Following' })
                } else {
                    this.setState({ following: 'Follow' })
                }
            }
        }).catch((err) => console.log(err))
    }


    continue = () => {
        if (this.state.currentUserId == '') {
            this.props.navigation.navigate('LoginPage')
            return
        }

        this.props.navigation.navigate('BookArtist', {
            request: this.state.request,
            location: this.state.userInfo.location, image: this.state.userInfo.image,
            slots: this.state.request.slot.split(',')
        })

    }
    render() {

        const filteredImage = this.state.work.filter(item => item.filetype == 'image');
        const swipeable = filteredImage.map((item) => {
        return <Image
        resizeMode={'cover'}
        style={{ width: width, height: 200 }}
        source={{ uri: SERVER_ADDRESS + '/images/' + item.image }}
    />
        })
        return (
            <ScrollView
                ref='_scrollview'>

                <View style={{
                    height: 260, shadowColor: '#000000',
                    shadowOffset: {
                        height: 3,
                        width: 1
                    }, backgroundColor: '#fff',
                    shadowRadius: 5,
                    shadowOpacity: 1, elevation: 5
                }}>

                    {
                        this.state.work.length > 0 ?
                           
                            <SwipeableViews
                                style={{ flex: 1 }}>

                                {swipeable}
                               
                            </SwipeableViews>
                            :
                            <Image
                                style={{
                                    width: width, height: 200
                                }}
                                source={{ uri: 'https://www.resolutiongallery.com/wp-content/themes/trend/assets/img/empty/424x500.png' }}
                            />
                    }

                    <SafeAreaView style={{ position: 'absolute' }}>
                        <Button

                            transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />

                        </Button>
                    </SafeAreaView>



                    <View style={{
                        padding: 10,
                        flexDirection: 'row', position: 'absolute', bottom: 0
                    }}>
                        {this.state.userInfo.image != null ?
                            <Image
                                style={{ width: 40, height: 40, borderRadius: 20 }}
                                source={{ uri: SERVER_ADDRESS + '/images/' + this.state.userInfo.image }}
                            /> :
                            <Image
                                style={{ width: 40, height: 40, borderRadius: 20 }}
                                source={require('../assets/man.png')}
                            />}

                        <Text style={{ color: '#000', paddingLeft: 5, paddingTop: 5 }}
                        > {this.state.request.username}
                            <Text style={{ fontSize: 12 }}> {'\n Scheppend verified'}</Text>
                        </Text>

                        <Text
                            onPress={() => this.followUnfollow()}
                            style={{ textAlign: 'right', color: Colors.appColor, padding: 10, flex: 1, fontWeight: 'bold' }}>{this.state.following}</Text>
                    </View>



                </View>


                <Text style={{ backgroundColor: Colors.lightGrey, fontSize: 18, padding: 15, fontWeight: '700' }}>{this.state.request.title.toUpperCase()}</Text>
                <View style={{ height: 1, backgroundColor: '#ddd' }}></View>
                <Text style={{ height: 150, marginTop: 6, paddingLeft: 15, paddingRight: 15 }}>{this.state.request.description}</Text>

                {/* <Text>{this.state.url}</Text> */}

                <View style={{ width: Dimensions.get('window').width * .9, marginLeft: 15, marginTop: 10 }}>
                    <GridList
                        // showSeparator
                        data={this.state.url}
                        numColumns={3}
                        renderItem={(item) => <Text
                            style={{ color: 'blue', padding: 5 }}
                            onPress={() => this.props.navigation.navigate('InAppWebview', { url: item.item })}
                        >{item.item}</Text>}
                    />
                </View>

                <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20 }}>
                    <View style={{ flex: 1, alignSelf: 'center' }}>
                        <Text style={{ fontWeight: '700', paddingBottom: 5 }}>Category</Text>
                        <Text >{this.state.request.catname}</Text>
                    </View>

                    <View style={{ alignSelf: 'baseline', alignItems: 'center', }}>
                        <Text style={{ fontWeight: '700', paddingBottom: 5 }}>Team Size</Text>
                        <Text>{this.state.request.team}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', }}>
                        <Text style={{ fontWeight: '700', paddingBottom: 5 }}>{" Approx duration  "}</Text>
                        <Text style={{}}>{this.state.request.duration + " hours"}</Text>
                    </View>

                </View>

                <Text style={{ textAlign: 'right', padding: 10, marginRight: 10 }}>Average Rate :
                    <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold' }}> {this.state.request.budget + ' Rs.'}</Text>
                </Text>


                <TouchableOpacity
                    onPress={() => this.continue()}
                    style={{
                        backgroundColor: Colors.appColor, borderRadius: 5,
                        padding: 10, marginLeft: 20, marginRight: 20,
                    }}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>{'CONTINUE'}</Text>
                </TouchableOpacity>


                <View style={{margin:10,padding:10, backgroundColor:Colors.lightGrey, borderRadius:5}}>
                    <Text style={{fontSize:15, paddingBottom:5, fontWeight:'bold'}}>Videos</Text>
                    <FlatList
                        // keyboardShouldPersistTaps='always'
                        horizontal={true}
                        data={this.state.work}
                        extraData={this.state.work}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            item.filetype == 'video' &&
                            <View style={{width:width, height: 175, }}>
            
                              <WebView
                                style={{ width: width*.9, height: Dimensions.get('window').height }}
                                automaticallyAdjustContentInsets={true}
                                source={{ html: `<iframe frameborder="0" width="99.9%" height="445" controls="0" src="https://www.dailymotion.com/embed/video/${item.video}?queue-enable=false&sharing-enable=false&ui-logo=0" allowfullscreen></iframe>` }}
                              />
            
                            </View> 
                        )}
                    />

                </View>

                {/* <View style={{ marginTop: 10 }}>
                    {this.state.userRequest.length > 0 && <Text style={{ backgroundColor: Colors.lightGrey, padding: 10, fontSize: 15, paddingLeft: 10, fontWeight: 'bold' }}>{"More offerings from " + this.state.request.username}</Text>}

                    <FlatList
                        // keyboardShouldPersistTaps='always'
                        data={this.state.userRequest}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(this.renderItem)}
                    />
                </View> */}

            </ScrollView>
        )
    }
}



const styles = StyleSheet.create({
    slideContainer: {
        position: 'absolute',
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
    card: {
        margin: 10, elevation: 5, borderRadius: 5,
        backgroundColor: '#fff', shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    }
});

