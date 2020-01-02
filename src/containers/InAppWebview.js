import React from 'react'

import { View, StyleSheet, Text, Image, TouchableOpacity, TouchableHighlight, Dimensions, FlatList, Modal, ProgressBarAndroid } from 'react-native'
import { Header, Left, Icon, Button, Right, Toast } from 'native-base'
import { WebView } from 'react-native-webview';

const width = Dimensions.get('window').width

export default class InAppWebview extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            url: this.props.navigation.getParam('url')
        }

        console.log("-=======  :" + this.state.url)
    }


    render() {
        return (

            <View style={{ flex: 1, padding: 0, margin: 0, backgroundColor: '#000' }}>

                <WebView
                    source={{ uri: this.state.url }}
                    style={{ marginTop: 20 }}
                />

            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {

        alignSelf: 'center',
        width: 80, height: 80,
        backgroundColor: '#fff',
        borderRadius: 40,
        borderWidth: 3, borderColor: '#ddd',
        padding: 15,
        paddingHorizontal: 20,

        margin: 10,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    modal: {
        borderRadius: 5,
        marginLeft: 50, marginRight: 50, marginTop: 60, marginBottom: 60,
        backgroundColor: '#fff', padding: 15, paddingLeft: 20, paddingRight: 20


    },
});