import React from 'react'
import { StyleSheet, Text, View, Image, FlatList, Dimensions } from 'react-native'

import { Header, Left, Icon, Button, Right } from 'native-base'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';


const listData = ['Live Musician', 'Magician']
export default class PostRequest extends React.Component {

    constructor() {
        super()
        this.state = {
            data: []
        }

    }


    renderItem = ({ item, index }) => (
        <View style={styles.card}>
            <TouchableOpacity
                //onPress={() => this.props.navigation.navigate('ArtistPublicProfile')}
                style={{
                    
                    padding: 15, borderRadius: 2
                }}>
                <Text>June 10,2019</Text>
                <Text style={{position:'absolute', right:0, padding:15, color:'red', fontSize:12}}>UNAPPROVED</Text>


                <View style={{height:150, flex: 1, backgroundColor:'#ddd', 
                borderRadius:5, marginTop:10, marginBottom:10 }}>
                   <Text style={{padding:15}}>Short Description</Text>
                </View>

                <Text>Duration : <Text>1 hour average</Text></Text>
                <Text>Charge : <Text>Rs. 3000</Text></Text>
                <Text>Category : <Text>Live Band</Text></Text>

            </TouchableOpacity>
        </View>
    );


    render() {
        return (
            <View
                style={{ flex: 1, }}>
                <Header>
                <Left >
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon style={{padding:10}} name='arrow-back' />
                           
                        </Button>
                    </Left>
                    <Text style={{ fontSize: 20, padding: 10 }}>Your Requests</Text>
                    <Right></Right>
                </Header>

                {/* <ScrollView> */}


                    <FlatList
                        // keyboardShouldPersistTaps='always'
                        data={listData}
                        // extraData={this.state}
                        // keyExtractor={this._keyExtractor}
                        renderItem={this.renderItem}
                    />




                <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('CreateRequest')}
                style={{padding:10, backgroundColor:'#287CD0', margin:20,marginLeft:10,marginRight:10,marginTop:10, borderRadius:5}}>
                    <Text style={{textAlign:'center', color:'#fff', fontSize:15, fontWeight:'700'}}>Post a Request</Text>
                </TouchableOpacity>

                {/* </ScrollView> */}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        backgroundColor: '#fff', shadowColor: "#ddd",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    }
})