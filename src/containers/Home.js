import React from 'react'
import { RefreshControl, StyleSheet, Text, View, Image, Dimensions, FlatList, AsyncStorage, TouchableOpacity } from 'react-native'

import { WebView } from 'react-native-webview';
import { Header, Left, Icon, Button, Right, Toast } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler';
import { categories, featuredArtist } from '../services/requests';
import { SERVER_ADDRESS } from '../services/server';
import Colors from '../Colors/Colors';

const width = Dimensions.get('window').width

export default class Home extends React.Component {

    // static navigationOptions = {
    //     tabBarVisible: false
    // }

    constructor() {
        super()
        this.state = {
            userid: '',
            flatListVisibility: false,
            searchtext: '',
            categories: [],
            popularCategories: [],
            featuredList: [],
            loading: true
        }

    }

    async componentDidMount(props) {

        try {

            const userid = await AsyncStorage.getItem('USERID');

            console.log("userid :  " + userid)
            if (userid != null) {
                this.setState({ userid: userid })
            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }



        categories().then(res => {
            console.log("RESSSSS  :  " + JSON.stringify(res))

            if (res.status == '1') {
                var categories = res.data.category
                var popularCategories = []
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i].popular == 1) {
                        popularCategories.push(categories[i])
                    }
                }
                featuredArtist().then(res => {
                    console.log("RESSSSSLISTTTTT  :  " + JSON.stringify(res))

                    if (res.status == "1") {
                        this.setState({
                            categories: categories,
                            popularCategories: popularCategories,
                            featuredList: res.data,
                            loading: false
                        })
                    }
                    else {
                        this.setState({ loading: false })
                    }


                })
                    .catch((err) => this.setState({ loading: false }))

            } else {
                this.setState({ loading: false })
            }
        })
            .catch((err) => this.setState({ loading: false }))


    }


    renderItemHorizontally = ({ item, index }) => (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ArtistsSub', { categoryid: item.id, name: item.name })}
                style={{ flexDirection: 'column', borderRadius: 2, }}>
                <Image
                    style={{ width: 130, height: 100, }}
                    source={{ uri: SERVER_ADDRESS + '/images/' + item.image }}
                />

                <Text style={{ margin: 10, marginTop: 15, marginBottom: 15, fontSize: 13, fontWeight: 'bold' }}>{item.name}</Text>


            </TouchableOpacity>
        </View>
    );

    renderFeatured = ({ item, index }) => (
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ArtistRequestBook',
        {request:item, url:item.url.split(',')})}
            style={{ padding: 10, paddingBottom: 20, backgroundColor: "#FAFAFA", marginTop: 10 }}
            //onPress={() => this.props.navigation.navigate('ArtistPublicProfile', { userid: item.id })}
        >
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Image
                    style={{ width: 50, height: 50, borderRadius: 25, alignSelf:'center' }}
                    source={{ uri: item.userimage != null ? SERVER_ADDRESS + '/images/' + item.userimage : 'https://www.flare.com/wp-content/uploads/2016/01/prof1-600x409.jpg' }}
                />

                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Text style={{ color: '#1C2833', fontSize: 16, fontWeight: 'bold' }}>{item.title.toUpperCase()}</Text>
                    <Text style={{ fontSize: 12 }}>{item.username}</Text>
                    <Text style={{ fontSize: 12, position:'absolute',right:10 }}>{item.catname}</Text>
                </View>

                {/* <Text style={{ textAlign: 'right', alignSelf: 'center', backgroundColor: Colors.appColor, paddingLeft: 10, paddingRight: 10, padding: 5, color: "#FFFFFF", borderRadius: 5 }}>Follow</Text> */}
            </View>

            <Text numberOfLines={1} style={{ paddingTop: 10, paddingBottom: 10 }}>{item.description}</Text>


            {item.post_data.length > 0 &&
                item.post_data[0].filetype == 'video' ?
                <View style={{  height: 175, }}>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("VideoPlayer", { videoid: item.post_data[0].video })}
                        style={{  height: 175, backgroundColor: '#000000' }}>
                        <WebView
                            style={{ width: width + 10, alignSelf: 'center', margin: 0, backgroundColor: '#000000' }}
                            automaticallyAdjustContentInsets={true}
                            source={{ html: `<iframe frameborder="0" width="100%" height="100%" controls="0" src="https://www.dailymotion.com/embed/video/${item.post_data[0].video}?queue-enable=false&sharing-enable=false&ui-logo=0" allowfullscreen></iframe>` }}
                        />

                        <View style={{ backgroundColor: 'rgba(0,0,0,0)', position: 'absolute', width: width, height: 400 }}></View>
                    </TouchableOpacity>
                    {/* <WebView
                                style={{ width: width*.9, height: Dimensions.get('window').height }}
                                automaticallyAdjustContentInsets={true}
                                source={{ html: `<iframe frameborder="0" width="100%" height="445" controls="0" src="https://www.dailymotion.com/embed/video/${item.post_data[0].video}?queue-enable=false&sharing-enable=false&ui-logo=0" allowfullscreen></iframe>` }}
                              /> */}

                </View> :

                <Image
                    resizeMode={'cover'}
                    style={{  height: 160 }}
                    source={{ uri: SERVER_ADDRESS + '/images/' + item.post_data[0].image }}
                />
            }




            {/* <Image
                style={{ flex:1, height: 160 }}
                source={{ uri: item.image != null ? SERVER_ADDRESS + '/images/' + item.image : 'https://www.flare.com/wp-content/uploads/2016/01/prof1-600x409.jpg' }}
            /> */}
        </TouchableOpacity>
    );

    render() {
        return (
            <View
                style={{ flex: 1, }}>
                <Header androidStatusBarColor={Colors.Darkgrey}
                    style={{ backgroundColor: '#DDDDDD' }}>
                    <Left style={{ flexDirection: 'row', paddingLeft: 10 }}>
                        {/* {this.state.userid != '' &&  <Button
                            style={{ padding: 10 }}
                            transparent
                            onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' />

                        </Button>} */}

                        <Image
                            style={{ width: 100 }}
                            resizeMode='contain'
                            source={require('../assets/title.png')}
                        />

                        {/* <Text style={{ fontSize: 18, padding: 10, color: '#505050', fontWeight: 'bold' }}>{'Explore  '}</Text> */}
                    </Left>

                    <Right>
                        <Button
                            style={{ padding: 10 }}
                            transparent
                            onPress={() => this.props.navigation.navigate('Categories', { categories: this.state.categories })}>
                            <Icon style={{ color: Colors.Darkgrey }} name='menu' />

                        </Button>
                    </Right>
                </Header>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loading} />
                    }>


                    <Text style={{ fontWeight: 'bold', fontSize: 18, paddingLeft: 15, paddingTop: 10 }}>Categories</Text>
                    <View>
                        <FlatList
                            style={{ margin: 10 }}
                            horizontal={true}
                            // keyboardShouldPersistTaps='always'

                            data={this.state.categories}
                            // extraData={this.state}
                            keyExtractor={item => item.id.toString()}
                            renderItem={this.renderItemHorizontally}
                        />

                    </View>

                    <View style={{ flex: 1, height: 0.8, backgroundColor: '#dddddd', marginTop: 10 }}></View>

                    <Text style={{ fontWeight: 'bold', fontSize: 18, paddingLeft: 15, paddingTop: 10 }}>Popular Categories</Text>

                    <FlatList
                        style={{ margin: 10 }}
                        // keyboardShouldPersistTaps='always'
                        horizontal={true}
                        data={this.state.popularCategories}
                        // extraData={this.state}
                        keyExtractor={item => item.id.toString()}
                        renderItem={(this.renderItemHorizontally)}
                    />



                    <Text style={{ fontWeight: 'bold', fontSize: 18, paddingLeft: 15, paddingTop: 10 }}>Featured Artists</Text>


                    <FlatList
                        // style={{ margin: 10 }}
                        // keyboardShouldPersistTaps='always'

                        data={this.state.featuredList}
                        // extraData={this.state}
                        keyExtractor={item => item.id.toString()}
                        renderItem={this.renderFeatured}
                    />





                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        elevation: 5, borderWidth: 1, borderColor: '#ddd', borderRadius: 3,
        margin: 5,
        backgroundColor: '#fff', shadowColor: "#ddd",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    }
})

