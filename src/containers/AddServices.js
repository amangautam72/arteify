import React from 'react'
import { Text, View, Image, AsyncStorage, TouchableOpacity } from 'react-native'
import Colors from '../Colors/Colors';

import { Icon } from 'native-base'


const listData = ['Live Musician', 'Magician', 'Painter', 'Movie Play', 'Dancer', 'Guitarist', 'Dj']
export default class AddServices extends React.Component {

    constructor() {
        super()
        this.state = {

        }

    }

    render() {
        return (
            <View
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>


                <Image style={{position:'absolute',top:100, padding: 10, alignSelf: 'center' }}
                    source={require('../assets/notification.png')}></Image>

                <View style={{ padding: 15 }}>

                    <View style={{ alignSelf: 'baseline', paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: Colors.appColor }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{" Add your Services "}</Text>
                    </View>
                    <TouchableOpacity    //passing worklinks so the split() in the next form does not throw an exception.
                        onPress={() => this.props.navigation.navigate('CreateRequest', {
                            edit: '0', requestid: '',
                            title: '', description: '',
                            category: 'Select Category', categoryId: 0,
                            numOfPeople: '', duration: '',
                            budget: '', workLinks: [],
                            slot: [],
                            reload: null
                        })}
                        style={{ backgroundColor: Colors.redColor, borderRadius: 3, padding: 5, marginTop: 10 }}>
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>ADD</Text>
                    </TouchableOpacity>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 40 }}>
                    <TouchableOpacity 
                    onPress={() => this.props.navigation.goBack()}
                    style={{flexDirection:'row'}}>
                        <Icon style={{ padding: 10, alignSelf: 'center', }} name='arrow-back' />
                        <Text style={{ alignSelf: 'center' }}>Go back</Text>
                    </TouchableOpacity>
                </View>


                <Text
                onPress={() => this.props.navigation.navigate('Home')}
                style={{position:'absolute', right:20, bottom:30,
                 fontSize:15,fontWeight:'600'}}
                >
                    SKIP
                </Text> 
                

            </View>
        )
    }
}