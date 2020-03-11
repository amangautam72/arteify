import React from 'react'
import { RefreshControl, StyleSheet, Dimensions, Text, View, Image, FlatList, AsyncStorage, TouchableOpacity, BackHandler } from 'react-native'

import { Header, Left, Icon, Button, Right, Toast } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler';
import { getDailyMotionAccess, getFollowingsPost, getTopUsers, getEvents, likeUnlike } from '../services/requests';
import Colors from '../Colors/Colors';

import AutoHeightImage from 'react-native-auto-height-image';
import NetInfo from "@react-native-community/netinfo";
import { SERVER_ADDRESS } from '../services/server';

const width = Dimensions.get('window').width

const listData = [{
    des: '',
    title: 'Clowning & Physical Theatre Workshop at The Social House',
    image: 'https://storage.googleapis.com/ehimages/2020/1/7/img_fe59c7177ea7bd27a58cb2dd05304168_1578391093996_processed_original.jpg'
},
{
    des: '',
    title: 'Sofar Sounds Show',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6WMu5lPYhZjZiT5G3WnXTiHh7AVrvUo62SEGmcsoW1sNYmdTmrgxmOKeFyZLpwjcMc57R9pO9-g&s=10'
}]


export default class RealHome extends React.Component {

    constructor() {
        super()
        this.state = {
            userid: '',
            flatListVisibility: false,
            searchtext: '',
            posts: [],
            topUsers: [],
            events: [],
            loading: true,
            liking: false
        }

    }

    async componentDidMount() {
        try {

            const userid = await AsyncStorage.getItem('USERID');

            console.log("USERID :  " + userid)
            if (userid != null) {

                this.setState({ userid: userid })
                this.followingsPost()
                this.topUsers()
                this.getEvents()

            }
        } catch (error) {
            this.setState({ loading: false })
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }
    }

    followingsPost() {
        getFollowingsPost(this.state.userid).then((res) => {

            console.log("RESS  : " + JSON.stringify(res))
            if (res.status == '1') {
                this.setState({ posts: res.data,loading:false })
            } else {
                this.setState({ loading: false })
            }
        }).catch((error) => this.setState({ loading: false }))
    }

    topUsers() {
        getTopUsers().then((res) => {
            console.log("Top Users  : " + JSON.stringify(res))
            if (res.status == '1') {
                this.setState({ topUsers: res.data, loading: false })
            } else {
                this.setState({ loading: false })
            }
        }).catch((error) => this.setState({ loading: false }))
    }

    getEvents() {
        getEvents().then((res) => {
            console.log("EVENTS : " + JSON.stringify(res))
            if (res.status == "1") {
                this.setState({ events: res.data })
            }
        }).catch((err) => console.log(err))
    }

    likeUnlike(postid,index, userid){

        NetInfo.isConnected.fetch().done((isConnected) => {
            if (!isConnected) {
                Toast.show({ text: 'you are not connected to internet', buttonText: 'okay', duration: 3000 })
            }
        })
        
        let posts = this.state.posts
        
        if(posts[index].postlike == null || posts[index].postlike == "2"){
            posts[index].postlike = "1"
        }else{
            posts[index].postlike = "2"
        }

        
        

        this.setState({liking: this.state.liking == false ? true : false, 
            posts: posts  })
    
        let that = this
        setTimeout(function() {

            that.state.liking == true &&
            likeUnlike(userid,postid).then((res) => {
                console.log("LIKEUNLIKE : " + JSON.stringify(res))
                if (res.status == "1") {
                    that.setState({liking:false})
                }else{
                    Toast.show({ text: "Something went wrong", buttonText: 'okay', duration: 3000 })
                }
            }).catch((err) => console.log(err))
            
        } , 
            2000);
        
    }


    renderItem = ({ item, index }) => (
        <View style={styles.card}>
            <TouchableOpacity
                //onPress={() => this.props.navigation.navigate('ArtistPublicProfile', { userid: item.user_id })}
                style={{
                    flex: 1,
                     borderRadius: 5
                }}>

                <View style={{paddingLeft:10,paddingTop:10, flexDirection: 'row', alignSelf: 'baseline' }}>
                    <Image
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                        source={{ uri: item.image != null ? SERVER_ADDRESS + '/images/' + item.image : 'https://www.flare.com/wp-content/uploads/2016/01/prof1-600x409.jpg' }}
                    />


                    <View style={{ marginLeft: 15, flex: 1 }}>
                        {/* <Text style={{ fontSize: 14, color: '#000', fontWeight: '700' }}>I will make your party happening</Text> */}
                        <Text>{item.user_name}</Text>
                        <Text
                            style={{ fontSize: 12, marginTop: 5, alignSelf: 'baseline' }}>{item.text}</Text>


                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <TouchableOpacity 
                    onPress={() => this.likeUnlike(item.id,index,this.state.userid)}
                    style={{
                         paddingRight: 10,paddingLeft:20,paddingBottom:5,paddingTop:5
                    }}>
                        {item.postlike == "1" ?
                            <Image source={require('../assets/liked.png')}
                                resizeMode='contain'
                                style={{ width: 25, height: 25, alignSelf: 'center' }}></Image>
                            :
                            <Image source={require('../assets/like.png')}
                                resizeMode='contain'
                                style={{ width: 25, height: 25, alignSelf: 'center' }}></Image>
                        }

                        {/* <Text style={{ color: Colors.appColor }}>Like</Text> */}
                    </TouchableOpacity>
                    <View style={{ width: 2, marginTop: 4, backgroundColor: '#ddd', marginLeft:10 }}></View>
                    <TouchableOpacity style={{
                        paddingRight: 10,paddingLeft:10,paddingBottom:5,paddingTop:5,
                        marginLeft: 10
                    }}>
                        <Image source={require('../assets/comment.png')}
                                resizeMode='contain'
                                style={{ width: 25, height: 25, alignSelf: 'center' }}></Image>
                    </TouchableOpacity>
                </View>

            </TouchableOpacity>
        </View>
    );

    renderUsersToFollow = ({ item, index }) => (
        this.state.userid != item.id &&
        <TouchableOpacity
            style={{
                flex: 1,
                marginBottom: 15, marginTop: 15, borderWidth: 1,
                borderColor: '#ddd', borderRadius: 3, elevation: 5,
                backgroundColor: '#fff', shadowColor: "#ddd", margin: 5,
                shadowOpacity: 0.8, shadowRadius: 2,
                shadowOffset: {
                    height: 3,
                    width: 1
                }
            }}
            onPress={() => this.props.navigation.navigate('ArtistPublicProfile', { userid: item.id })}
        >
            <Image
                
                style={{ height: 80 }}
                source={{ uri: item.image != null ? SERVER_ADDRESS + '/images/' + item.image : 'https://www.flare.com/wp-content/uploads/2016/01/prof1-600x409.jpg' }}
            />
    
            {/* <Text style={{ width: 120, color: '#ffffff', position: 'absolute', backgroundColor: 'rgba(52, 52, 52, 0.6)', textAlign: 'center', paddingTop: 3, paddingBottom: 3 }}>{item.user_name}</Text> */}
            <TouchableOpacity>
                <Text style={{ fontSize: 14, fontWeight: 'bold', alignSelf: 'center', padding: 5, marginTop: 10, }}>{this.Capitalize(item.user_name) + "  "}</Text>
            </TouchableOpacity>

        </TouchableOpacity>
    );


    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    renderFeatured = ({ item, index }) => (
        <TouchableOpacity
            style={{ padding: 10, paddingBottom: 20, backgroundColor: "#FAFAFA", marginBottom: 10 }}
            onPress={() => this.props.navigation.navigate('ArtistPublicProfile', { userid: item.id })}
        >
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: item.image != null ? SERVER_ADDRESS + '/images/' + item.image : 'https://www.flare.com/wp-content/uploads/2016/01/prof1-600x409.jpg' }}
                />

                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Text style={{ color: '#1C2833', fontSize: 16, fontWeight: 'bold' }}>{this.Capitalize(item.user_name + "  ")}</Text>
                    <Text style={{ fontSize: 12 }}>Guitar</Text>
                </View>

                <Text style={{ textAlign: 'right', alignSelf: 'center', backgroundColor: Colors.appColor, paddingLeft: 10, paddingRight: 10, padding: 5, color: "#FFFFFF", borderRadius: 5 }}>Follow</Text>
            </View>

            <Text style={{ paddingTop: 10, paddingBottom: 10 }}>This is Guitarist, Hire me.</Text>

            <Image
                style={{ flex: 1, height: 160 }}
                source={{ uri: item.image != null ? SERVER_ADDRESS + '/images/' + item.image : 'https://www.flare.com/wp-content/uploads/2016/01/prof1-600x409.jpg' }}
            />
        </TouchableOpacity>
    );

    renderEvents = ({ item, index }) => (
        <TouchableOpacity
            style={[styles.card, { alignSelf: 'stretch' }]}>
            <Image style={{ height: 120 }}
                source={{ uri: SERVER_ADDRESS + '/images/' + item.image }}></Image>

            <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 14, fontWeight: 'bold', color: "#000000" }}>{item.title}</Text>
            {/* <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 14 }}>{item.des}</Text> */}

        </TouchableOpacity>
    )

    onRefresh() {
        this.followingsPost()
        this.topUsers()
    }

    render() {
        return (
            <View
                style={{ flex: 1, }}>
                <Header androidStatusBarColor={"#505050"} style={{ backgroundColor: '#DDDDDD' }}>
                    <Left style={{ flexDirection: 'row', paddingLeft: 10 }}>
                        {/* <Button
                            style={{ padding: 10 }}
                            transparent
                            onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' />

                        </Button> */}
                        <Image
                            style={{ width: 100 }}
                            resizeMode='contain'
                            source={require('../assets/title.png')}
                        />

                        {/* <Text style={{ fontSize: 18, padding: 10, color: '#fff', fontWeight: 'bold' }}>{'Home '}</Text> */}
                    </Left>

                    <Right>
                        <Button
                            style={{ padding: 10 }}
                            transparent
                            onPress={() => this.props.navigation.navigate('Categories')}>
                            <Icon style={{ color: Colors.Darkgrey }} name='menu' />

                        </Button>
                    </Right>
                </Header>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={() => this.onRefresh()} />
                    }>


                    {/* <View style={[styles.card, { alignSelf: 'center' }]}>
                        <Image
                            style={{ width: width * .9 + 20, alignSelf: 'center', height: 200, borderRadius: 3 }}
                            // resizeMode='stretch'
                            source={require('../assets/welcome.png')}
                        />
                    </View> */}


                    {/* <FlatList
                        // keyboardShouldPersistTaps='always'
                        data={this.state.topUsers}
                        // extraData={this.state}
                        keyExtractor={(item) => item.id.toString()}
                       
                        renderItem={this.renderFeatured}
                    /> */}


                    <Text style={{ marginTop: 10, paddingLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Top Service Providers</Text>


                    <FlatList
                        //style={{ alignSelf: 'center' }}
                        // keyboardShouldPersistTaps='always'
                        data={this.state.topUsers}
                        // extraData={this.state}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        renderItem={this.renderUsersToFollow}
                    />

                    <FlatList
                        // keyboardShouldPersistTaps='always'
                        data={this.state.posts}
                        extraData={this.state}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={this.renderItem}
                    />

                    <Text style={{ marginTop: 10, paddingLeft: 10, paddingTop: 10, fontSize: 16, fontWeight: 'bold' }}>Coming Events</Text>
                    <FlatList
                        // keyboardShouldPersistTaps='always'
                        data={this.state.events}
                        // extraData={this.state}
                        // keyExtractor={this._keyExtractor}
                        renderItem={this.renderEvents}
                    />

                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 10, paddingBottom: 10,
        elevation: 5, borderWidth: 1, borderColor: '#ddd', borderRadius: 3,
        backgroundColor: '#fff', shadowColor: "#ddd",
        shadowOpacity: 0.8, shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    }
})


