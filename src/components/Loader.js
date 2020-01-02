import React from 'react'

import { View, Modal, StyleSheet, ActivityIndicator } from 'react-native'


export const Loader = (props) => {

    return (
      
            <Modal
                animationType='none'
                transparent={true}
                visible={props.visibility}
            >

                <View
                    style={{
                        flex: 1, justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}>
                    <View
                        style={styles.modal}>

                        <ActivityIndicator size='large' color='blue'></ActivityIndicator>
                    </View>

                </View>
            </Modal>

    )
}


const styles = StyleSheet.create({
    modal: {

        marginLeft: 50, marginRight: 50, marginTop: 60, marginBottom: 60,
        backgroundColor: '#fff', padding: 15, paddingLeft: 20, paddingRight: 20


    },
})
