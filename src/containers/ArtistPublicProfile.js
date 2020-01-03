import React from 'react'
import { Text, View, Image, FlatList, StyleSheet, AsyncStorage } from 'react-native'

import { Header, Left, Right, Button, Icon, Toast } from 'native-base'

import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';

import { connect } from 'react-redux'
import { fetchData } from '../actions/ProfileDataAction';

import { Loader } from '../components/Loader'
import Colors from '../Colors/Colors';
import { SERVER_ADDRESS } from '../services/server';
import { followUnfollow, followCheck } from '../services/requests';

const listData = ['Live Musician', 'Magician']
class ArtistPublicProfile extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userid: this.props.navigation.getParam('userid'),
            currentUserId: '',
            username: '',
            userdes: '',
            userImage: '',
            postList: [],
            userRequests: [],
            following: 'Follow'
        }

    }

    async componentDidMount(){
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
        followCheck(currentuserid, this.state.userid).then((res) => {
            console.log("RESSSSSSS: " +  JSON.stringify(res))

            if (res.status == '1') {
                this.setState({ following: 'Following' })
            } else {
                this.setState({ following: 'Follow' })
            }
        }).catch((err) => console.log(err))
    }

    componentWillMount() {
        this.props.fetchUserData(this.state.userid)

    }


    componentWillReceiveProps(props) {


        let response = props.response

        if (props.response != this.props.response) {
            if (props.hasError) {
                Toast.show({ text: 'Something went wrong', buttonText: 'okay', duration: 3000 })
                return
            }

            if (Object.keys(response).length != 0 && response.constructor === Object) {
                this.setState({
                    username: response.userinfo.user_name,
                    userdes: response.userinfo.description,
                    userImage: props.response.userinfo.image != null && props.response.userinfo.image,
                    postList: response.post, userRequests: response.userinfo.postinfo
                })
            }

        }
    }

    followUnfollow = () => {
        if (this.state.currentUserId == '') {
            Toast.show({
                text: 'Please join artistHire to follow',
                buttonText: 'okay', duration: 3000
            })
            this.props.navigation.navigate('LoginPage')
            return
        }

        followUnfollow(this.state.currentUserId, this.state.userid, this.state.following).then((res) => {

            if (res.status == '1') {
                if (this.state.following == 'Follow') {
                    this.setState({ following: 'Following' })
                } else {
                    this.setState({ following: 'Follow' })
                }
            }
        }).catch((err) => console.log(err))
    }

    renderPost = ({ item, index }) => (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ArtistPublicProfile', { userid: item.user_id })}
                style={{
                    flex: 1,
                    padding: 10, borderRadius: 2
                }}>

                <View style={{ flexDirection: 'row', alignSelf: 'baseline' }}>
                    <Image
                        style={{ width: 40, height: 40, borderRadius: 20, }}
                        source={{ uri: 'https://www.flare.com/wp-content/uploads/2016/01/prof1-600x409.jpg' }}
                    />


                    <View style={{ marginLeft: 15, flex: 1 }}>
                        {/* <Text style={{ fontSize: 14, color: '#000', fontWeight: '700' }}>I will make your party happening</Text> */}
                        <Text >Gautam Disouza</Text>
                        <Text
                            style={{ fontSize: 12, marginTop: 5, alignSelf: 'baseline' }}>{item.text}</Text>


                    </View>
                </View>


                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <TouchableOpacity style={{
                        paddingLeft: 5, paddingRight: 10,
                    }}><Text style={{ color: Colors.appColor }}>Like</Text></TouchableOpacity>
                    <View style={{ width: 2, marginTop: 4, backgroundColor: '#ddd' }}></View>
                    <TouchableOpacity style={{
                        paddingLeft: 5, paddingRight: 10,
                        marginLeft: 10
                    }}><Text style={{ color: Colors.appColor }}>Comment</Text></TouchableOpacity>
                </View>

            </TouchableOpacity>
        </View>
    );


    renderRequest = ({ item, index }) =>
        (<View style={styles.card}>
            <TouchableOpacity
                 onPress={() => this.props.navigation.navigate('ArtistRequestBook',
                 {request:item, url:item.url.split(',')})}
                style={{ flexDirection: 'column', borderRadius: 2, }}>
                <Image style={{ height: 120, flex: 1 }}
                    source={{ uri: 'https://news.artnet.com/app/news-upload/2019/02/IMG_5085-768x1024.jpeg' }}></Image>

                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 14 }}>{item.title}</Text>
                <Text style={{ marginLeft: 10, marginBottom: 10, fontWeight: 'bold', fontSize: 14 }}>{item.catname}</Text>

            </TouchableOpacity>
        </View>)

    render() {
        return (
            <ScrollView
                style={{ flex: 1, }}>

                {this.props.isLoading && <Loader></Loader>}
                <Header androidStatusBarColor={Colors.Darkgrey}
                    style={{ backgroundColor: '#DDDDDD' }}>
                    <Left style={{ flexDirection: "row" }}>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon style={{color:Colors.Darkgrey}} name='arrow-back' />

                        </Button>
                        <Text style={{ fontSize: 18, padding: 10, color: Colors.Darkgrey, fontWeight: 'bold' }}>{'Profile '}</Text>
                    </Left>

                    <Right></Right>
                </Header>

                {this.state.userImage != '' ? 
                
                <Image source={{ uri: SERVER_ADDRESS + '/images/' + this.state.userImage }}
                    // resizeMode='contain'
                    style={{ width: 80, height: 80, borderRadius: 40, alignSelf: 'center', margin: 10 }}></Image>
                : 
                <Image source={require('../assets/man.png')}
                       resizeMode='contain'
                       style={{ width: 60, height: 60,alignSelf: 'center', borderRadius: 30, margin: 10 }}></Image>
                    }
                
                <View style={{flexDirection:'row', justifyContent:'center', padding:5}}>
                    <Text >{this.state.username}</Text>

                    <Text
                     onPress={() => this.followUnfollow()} 
                    style={{position:'absolute',right:0, marginRight:10,
                    backgroundColor: Colors.appColor, 
                    paddingLeft: 10, paddingRight: 10, 
                padding: 5, color: "#FFFFFF", borderRadius: 5 }}>{this.state.following}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={{ padding: 20 }}>{this.state.userdes}</Text>
                </View>

                

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Book', { username: this.state.username, userRequests: this.state.userRequests })}
                    style={{
                        backgroundColor: Colors.redColor, borderRadius: 5, marginTop: 20,
                        padding: 10, marginLeft: 20, marginRight: 20
                    }}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>{"HIRE " + this.state.username.toUpperCase()}</Text>
                </TouchableOpacity>


                <View style={{}}>
                    <Text style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 20,fontSize:16, fontWeight: 'bold' }}>{"Services provided by " + this.state.username}</Text>

                    <FlatList

                        // keyboardShouldPersistTaps='always'

                        data={this.state.userRequests}
                        // extraData={this.state}
                        // keyExtractor={this._keyExtractor}
                        renderItem={this.renderRequest}
                    />
                </View>



                {this.state.postList.length > 0 && 
                <View>
                <Text style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 20, fontWeight: 'bold' }}>{'RECENT POSTS OF ' + this.state.username}</Text>

                <FlatList

                    // keyboardShouldPersistTaps='always'

                    data={this.state.postList}
                    // extraData={this.state}
                    // keyExtractor={this._keyExtractor}
                    renderItem={this.renderPost}
                />
            </View>}
                


            </ScrollView>
        )
    }
}



const styles = StyleSheet.create({
    card: {
        elevation: 5, borderWidth: 1, borderColor: '#ddd', borderRadius: 3,
        margin: 10,
        backgroundColor: '#fff', shadowColor: "#ddd",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    }
});

function mapStateToProps(state) {
    return {
        response: state.fetchDataReducer.data,
        hasError: state.fetchDataReducer.error,
        isLoading: state.fetchDataReducer.fetching
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserData: (userid) => dispatch(fetchData(userid))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ArtistPublicProfile)