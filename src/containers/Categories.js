import React from 'react'
import { StyleSheet, Text, View, Image, FlatList, ImageBackground, TextInput, Modal, AsyncStorage } from 'react-native'

import { Header, Left, Icon, Button, Right,Toast } from 'native-base'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import GridList from 'react-native-grid-list';

import { Loader } from '../components/Loader'
import Colors from '../Colors/Colors';
import { SERVER_ADDRESS } from '../services/server';
import { categories } from '../services/requests';

export default class Categories extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userid:'',
            postText: '',
            flatListVisibility: false,
            data: [],
            isLoading: true,
            categories: [],
        }

    }

    async componentDidMount() {

        try {
            
            const userid = await AsyncStorage.getItem('USERID');

            console.log("USERID :  " + userid)
            if (userid != null) {
                this.setState({userid: userid})
            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        } 

    }

    componentWillMount(){
        categories().then(res => {
            console.log("RESSSSS  :  " + JSON.stringify(res))

            if (res.status == '1') {
                var categories = res.data.category
                this.setState({isLoading:false, categories:categories })
            } else {
                this.setState({ isLoading: false })
            }
        })
        .catch((err) => this.setState({ isLoading: false }))


    }

    renderItemHorizontally = ({ item, index }) => (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ArtistsSub', { categoryid: item.id, name: item.name })}
                style={{ flexDirection: 'column', borderRadius: 2, }}>
                <Image
                resizeMode='cover'
                    style={{  height: 120,alignSelf:'stretch' }}
                    source={{ uri: SERVER_ADDRESS + '/images/' + item.image }}
                />
                <View style={{padding:5, position:'absolute',backgroundColor:'rgba(52, 52, 52, 0.5)',justifyContent:'center',alignItems:'center', right:0,left:0, bottom:0}}>
                <Text style={{alignSelf:'stretch', fontSize: 13, fontWeight:'bold', color:'white'  }}>{item.name + " "}</Text>
                </View>

            </TouchableOpacity>
        </View>
    );


    render() {
        return (
            <View
                style={{ flex: 1, }}>


                {this.state.isLoading && <Loader></Loader>}   
                <Header androidStatusBarColor={Colors.Darkgrey} style={{ backgroundColor:'#DDDDDD'}}>
                <Left style={{flexDirection:"row",flex:1}}>
                        <Button transparent
                        
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon style={{padding:5, color:Colors.Darkgrey}} name='arrow-back' />

                        </Button>
                        <Text style={{ fontSize:18,padding:10, color:Colors.Darkgrey,fontWeight:'bold', alignSelf:'center' }}>{"All Categories "}</Text>
                    </Left>
                    
                    <Right></Right>
                </Header>
                


                {/* <ScrollView>

                <GridList
                        showSeparator
                        data={this.state.categories}
                        numColumns={3}
                        renderItem={this.renderItemHorizontally}
                    />


              
                </ScrollView> */}

                <FlatList
                        // keyboardShouldPersistTaps='always'
                        data={this.state.categories}
                        // extraData={this.state}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        renderItem={this.renderItemHorizontally}
                    />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {flex:1,margin:2,
        elevation:3,
        backgroundColor: '#fff', shadowColor: "#ddd",
        borderRadius: 3,borderBottomRightRadius:5, borderColor: '#ddd',
        borderWidth: 1,
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    },
    modal: {

        marginLeft: 50, marginRight: 50, marginTop: 60, marginBottom: 60,
        backgroundColor: '#fff', padding: 15, paddingLeft: 20, paddingRight: 20


    },
})