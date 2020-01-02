import React from 'react'
import { StyleSheet, Text, View, Image, FlatList, Dimensions } from 'react-native'

import { Header, Left, Icon, Button, Right } from 'native-base'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Colors from '../Colors/Colors';


const listData = ['Live Musician', 'Magician']
export default class Book extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: this.props.navigation.getParam('username'),
            userRequests: this.props.navigation.getParam('userRequests'),
        }

    }


  
    renderItem = ({ item, index }) => (
        this.state.userid != item.userid && 
        <View style={styles.card}>
        <TouchableOpacity 
        onPress={() => this.props.navigation.navigate('ArtistRequestBook',
        {request:item, url:item.url.split(',')})}
        style={{ flexDirection: 'row', 
          }}>
            <Image
                style={{ width: 120, height: 120,borderBottomLeftRadius:3,borderTopLeftRadius:3 }}
                source={{ uri: 'https://www.flare.com/wp-content/uploads/2016/01/prof1-600x409.jpg' }}
            />


            <View style={{ paddingLeft: 10,paddingRight:10, flex: 1 }}>
                <Text 
                numberOfLines={2}
                style={{ fontSize: 14,paddingTop:5, color: '#000', fontWeight: '700'}}>{item.title.toUpperCase()}</Text>
                <View style={{height:1,marginTop:3, backgroundColor:'#ddd'}}></View>
                <Text >{item.username}</Text>
                {/* <Text numberOfLines={1}
                    style={{ fontSize: 12, marginTop: 5,marginBottom:5 }}>{item.description}</Text> */}

                <Text>Duration : <Text>{item.duration}</Text></Text>
                        
                        <Text>Category : <Text style={{ fontWeight: 'bold' }}>{item.catname}</Text></Text>
                {/* <Text
                    style={{ position: 'absolute', right: 5, bottom: 5, fontSize: 14,fontWeight:'bold', color: '#808B96' }}>Charge : */}
            <Text style={{position: 'absolute', right: 5, bottom: 5, color: Colors.appColor, fontWeight:'bold' }}> {item.budget + ' Rs.  '}</Text>
                {/* </Text> */}
            </View>


        </TouchableOpacity>
        </View>
    );


    render() {
        return (
            <View
                style={{ flex: 1, }}>
                  <Header style={{ backgroundColor: Colors.appColor }}>
                    <Left style={{ flexDirection: "row" }}>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />

                        </Button>
                        <Text style={{ fontSize: 18, padding: 10, color: '#fff', fontWeight: 'bold' }}>{'Book '}</Text>
                    </Left>

                    <Right></Right>
                </Header>

                {/* <Text style={{paddingLeft:15,paddingTop:10}}>{this.state.username + ' Offers these facilities'}</Text> */}


                    <FlatList
                        // keyboardShouldPersistTaps='always'
                        data={this.state.userRequests}
                        // extraData={this.state}
                        // keyExtractor={this._keyExtractor}
                        renderItem={this.renderItem}
                    />


                {/* </ScrollView> */}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        elevation:5,borderWidth:1,borderColor:'#ddd',borderRadius:3,
        margin:10,
            backgroundColor:'#fff',shadowColor: "#ddd",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 3,
          width: 1
        }
    }
})