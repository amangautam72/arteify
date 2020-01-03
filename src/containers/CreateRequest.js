import React from 'react'
import { StyleSheet, Text, View,Image, FlatList, TextInput, Modal, TouchableHighlight, TouchableOpacity, AsyncStorage } from 'react-native'

import { Header, Left, Icon, Button, Right, Toast } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler';

import { connect } from 'react-redux'
import { categories } from '../services/requests';
import { upRequest } from '../actions/UpdateRequestAction'
import { crRequest } from '../actions/CreateRequestAction'
import { updateRequest } from '../services/requests'

import NetInfo from "@react-native-community/netinfo";
import Colors from '../Colors/Colors';


const listData = ['Select Category', 'Live Musician', 'Magician', 'Painter', 'Movie Play', 'Dancer', 'Guitarist', 'Dj']
class CreateRequest extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userid: '',
            flatListVisibility: false,
            title: this.props.navigation.getParam('title'),
            description: this.props.navigation.getParam('description'),
            category: this.props.navigation.getParam('category'),
            categoryId: this.props.navigation.getParam('categoryId'),
            requestid: this.props.navigation.getParam('requestid'),
            categories: [{ 'id': 0, 'name': 'Select Category' }],
            numOfPeople: this.props.navigation.getParam('numOfPeople'),
            duration: this.props.navigation.getParam('duration'),
            budget: this.props.navigation.getParam('budget'),
            modalVisible: false,
            link: '',
            availableSlots: this.props.navigation.getParam('slot'),
            workLinks: this.props.navigation.getParam('workLinks'),
            editFlag: this.props.navigation.getParam('edit'),
            slots: [{ 'name': 'Slot 1', 'selected': 0, slotNo:1 }, { 'name': 'Slot 2', 'selected': 0,slotNo:2 }, { 'name': 'Slot 3', 'selected': 0,slotNo:3 }],
        }


        if(this.state.availableSlots.includes('1')){
            this.state.slots[0].selected = 1
        }
        if(this.state.availableSlots.includes('2')){
            this.state.slots[1].selected = 1
        }
        if(this.state.availableSlots.includes('3')){
            this.state.slots[2].selected = 1
          
        }

    }

    async componentDidMount() {

        console.log("LINKS : " + this.state.workLinks)

        try {
            const userid = await AsyncStorage.getItem('USERID');

            console.log("USERTYPE :  " + userid)
            if (userid != null) {

                this.setState({ userid: userid })

                categories().then(res => {
                    console.log("RESSSSS  :  " + JSON.stringify(res))
                    if (res.status == '1') {
                        var categories = this.state.categories
                        for (let i = 0; i < res.data.category.length; i++) {
                            categories.push({ "id": res.data.category[i].id, "name": res.data.category[i].name })
                        }
                        this.setState({ categories: categories })

                        console.log("CATEGIdnksmsc  : " + JSON.stringify(categories))
                    }
                })
                    .catch((err) => console.log("ERROR : " + err))
            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message); 
        }

    }

    componentWillReceiveProps(props) {

        console.log("PROPS: : " + JSON.stringify(props))
        console.log("THIS.PROPS: : " + JSON.stringify(this.props))

        if (props != this.props) {

            if (props.hasError) {
                Toast.show({ text: "Some Error", buttonText: 'okay', duration: 3000 })

            } else {
                const { params } = this.props.navigation.state;
                if (params.reload != null) {
                    params.reload(this.state.userid)
                    this.props.navigation.goBack()
                } else {
                    this.props.navigation.replace('Profile', { gotoHome: true })
                }



                Toast.show({ text: 'Updated Successfully', buttonText: 'okay', duration: 3000 })
            }
        }

    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }


    addLinks() {

        var links = this.state.workLinks;

        console.log("LINKSSS  :  " + links)
        if (this.state.link != '' && links.length < 4) {

            links.push(this.state.link)
            this.setState({ workLinks: links })
        } else {
            if (links.length > 3) {
                alert('Cannot add more than 4 links')
            }
        }
    }

    removeLink = (index) => {
        var array = this.state.workLinks
        array.splice(index, 1)

        this.setState({ workLinks: array })

    }

    onSubmit = (type) => {
       
        let title = this.state.title
        let description = this.state.description
        let categoryid = this.state.categoryId
        let numOfPeople = this.state.numOfPeople
        let duration = this.state.duration
        let budget = this.state.budget
        let links = this.state.workLinks
        let slots = this.state.slots

        var availableSlots = []
        for(let i=0; i< slots.length; i++){
            if(slots[i].selected === 1)
                availableSlots.push(slots[i].slotNo)
            
        }

        if (title == '' || description == '' || categoryid == '' || numOfPeople == ''
            || duration == '' || budget == '' || availableSlots.length < 1) {
            Toast.show({ text: 'Please fill the required information', buttonText: 'okay', duration: 3000 })
            return
        }
       
        if (type === 'UPDATE') {
            let requestid = this.props.navigation.getParam('requestid')
            //this.props.update(requestid, title, description, categoryid, numOfPeople, duration, budget, links)

            NetInfo.isConnected.fetch().done((isConnected) => {
                if (isConnected) {
                    updateRequest(requestid, title, description, categoryid, numOfPeople, duration, budget, links, availableSlots.toString()).then(res => {

                        console.log("RESPONSE === " + JSON.stringify(res))

                        if (res.status == '1') {
                            const { params } = this.props.navigation.state;
                            params.reload(this.state.userid)
                            this.props.navigation.goBack()


                            Toast.show({ text: 'Updated Successfully', buttonText: 'okay', duration: 3000 })

                        } else {
                            Toast.show({ text: 'Something went wrong', buttonText: 'okay', duration: 3000 })

                        }

                    })
                        .catch((err) => console.log("ERROR : " + err))
                }
                else {
                    Toast.show({ text: 'No internet connection found!- Internet connection required to use this app', buttonText: 'okay', duration: 3000 })
                    dispatch(noInternet())
                }
            })
        } else {
            //this.props.submit(this.state.userid, title, description, categoryid, numOfPeople, duration, budget, links, availableSlots.toString())
        }

    }

    onSlot = (index) => {
        var slot = this.state.slots
        if (slot[index].selected == 0) {
            slot[index].selected = 1
        } else {
            slot[index].selected = 0
        }

        this.setState({ slots: slot })

    }

    renderSlot = ({ item, index }) => (
        <TouchableOpacity
            onPress={() => this.onSlot(index)}
            style={[styles.card, { backgroundColor: item.selected == 0 ? "#fff" : '#ddd' }]}>
            <Text style={{ paddingLeft: 20, paddingRight: 20, fontWeight:'bold', }}>{item.name}</Text>
            <Text style={{fontSize:10,textAlign:'center'}}>{item.slotNo == 1 ? "7 am to 2 pm" : item.slotNo == 2 ? "2 pm to 6 pm" : "6 pm to 12 pm"}</Text>
        </TouchableOpacity>
    );

    render() {
        return (
            <View
                style={{ flex: 1, }}>
                <Header androidStatusBarColor={Colors.Darkgrey} style={{ backgroundColor:'#DDDDDD'}}>
                    <Left style={{ flexDirection: "row" }}>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon style={{ color: Colors.Darkgrey }} name='arrow-back' />

                        </Button>
                        <Text style={{ fontSize: 18, padding: 10, color: Colors.Darkgrey, fontWeight: 'bold' }}>{this.state.editFlag == '0' ? "ADD " : "EDIT  "}</Text>
                    </Left>


                    <Right>
                        {this.state.editFlag == '1' &&
                            // <Text
                            //     onPress={() => this.props.navigation.navigate('Upload', { requestid: this.state.requestid })}
                            //     style={{ color: "#ffffff", fontWeight:'bold' }}>Upload</Text>
                            <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Upload', { requestid: this.state.requestid })}>
                                <Image
                                style={{ height: 30, width: 35 }} source={require('../assets/upload.png')}></Image>
                                <Text style={{color:"#ffffff", fontSize:10, textAlign:'center'}}>Upload</Text>
                            </TouchableOpacity>    
                        }

                    </Right>
                </Header>


                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.modalVisible}
                >

                    <TouchableHighlight
                        onPress={() => this.setModalVisible(!this.state.modalVisible)}
                        style={{
                            flex: 1, justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}>
                        <View

                            style={styles.modal}>
                            <FlatList
                                data={this.state.categories}
                                renderItem={({ item }) => (
                                    <TouchableHighlight
                                        style={{}}
                                        onPress={() => this.setState({ category: item.name, modalVisible: false, categoryId: item.id })}
                                    >
                                        <View style={{ padding: 10 }}>
                                            <Text style={{ color: '#000' }}>{item.name}</Text>
                                        </View>
                                    </TouchableHighlight>
                                )}
                                keyExtractor={(item, index) => index.toString()}>

                            </FlatList>

                        </View>

                    </TouchableHighlight>
                </Modal>

                <ScrollView
                >

                    <TextInput
                        value={this.state.title}
                        onChangeText={(title) => this.setState({ title })}
                        placeholder="Enter Your Request Title"
                        placeholderTextColor="#ddd"
                        autoCapitalize="none"
                        style={{
                            margin: 15, borderWidth: 0.5, borderColor: "#ddd",
                            marginRight: 20, borderRadius: 5,
                            backgroundColor: '#fff',
                            padding: 5, paddingLeft: 10, paddingRight: 10, shadowOpacity: 0.2,
                            shadowRadius: 2,
                            shadowOffset: {
                                height: 2,
                                width: 2
                            }
                        }}></TextInput>



                    <View style={[styles.card, {backgroundColor:'#ddd', marginLeft:15, marginRight:20, marginTop:0}]}>
                        <TextInput
                            value={this.state.description}
                            onChangeText={(description) => this.setState({ description })}
                            multiline={true}
                            placeholder="A short description of your experience and what you will provide"
                            autoCapitalize="none"
                            // numberOfLines={2}
                            style={{
                                

                            }}
                        >

                        </TextInput>
                    </View>


                    <Text style={{ marginLeft: 15, marginBottom: 5, marginTop:10, fontWeight: 'bold' }}>Choose Category</Text>
                    <TouchableOpacity
                        onPress={() => this.setModalVisible(true)}
                        style={{
                            flexDirection: 'row', marginLeft: 15, padding: 10,borderWidth:2,
                            borderColor:Colors.lightGrey,
                            alignSelf: 'baseline', borderRadius: 5
                        }}>
                        <Text style={{ alignSelf: 'center', paddingLeft: 10, paddingRight: 20 }}>{this.state.category}</Text>
                        <Icon style={{ height: 20, width: 20, alignSelf: 'center' }} name='ios-arrow-down'></Icon>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', marginLeft:15 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Enter number of people</Text>
                            {/* <TouchableOpacity style={{
                        flexDirection: 'row', marginLeft: 15, padding: 10,
                        backgroundColor: '#ddd', alignSelf: 'baseline', borderRadius: 5
                    }}>
                        <Text style={{ alignSelf: 'center', paddingLeft: 20, paddingRight: 20 }}>1</Text>
                        <Icon style={{ height: 20, width: 20, }} name='arrow-down'></Icon>
                    </TouchableOpacity> */}

                            <TextInput
                                value={this.state.numOfPeople}
                                onChangeText={(numOfPeople) => this.setState({ numOfPeople })}
                                placeholder="Enter here"
                                placeholderTextColor="#ddd"
                                keyboardType='numeric'
                                autoCapitalize="none"
                                style={{
                                    marginTop:5,
                                    marginRight:20,
                                    borderWidth: 0.5, borderColor: "#ddd",
                                    borderRadius: 5,
                                    backgroundColor: '#fff',
                                    padding: 5, paddingLeft: 10, paddingRight: 10, shadowOpacity: 0.2,
                                    shadowRadius: 2,
                                    shadowOffset: {
                                        height: 2,
                                        width: 2
                                    }
                                }}></TextInput>
                        </View>

                        <View style={{ flex: 1, marginRight:15 }}>
                            <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Enter approx duration</Text>
                            {/* <TouchableOpacity style={{
                        flexDirection: 'row', marginLeft: 15, padding: 10,
                        backgroundColor: '#ddd', alignSelf: 'baseline', borderRadius: 5
                    }}>
                        <Text style={{ alignSelf: 'center', paddingLeft: 20, paddingRight: 20 }}>1</Text>
                        <Icon style={{ height: 20, width: 20, }} name='arrow-down'></Icon>
                    </TouchableOpacity> */}

                            <TextInput
                                value={this.state.duration}
                                onChangeText={(duration) => this.setState({ duration })}
                                placeholder="Enter here"
                                placeholderTextColor="#ddd"
                                keyboardType='numeric'
                                autoCapitalize="none"
                                style={{
                                    marginTop:5,
                                    borderWidth: 0.5, borderColor: "#ddd",
                                    borderRadius: 5,
                                    backgroundColor: '#fff',
                                    padding: 5, paddingLeft: 10, paddingRight: 10, shadowOpacity: 0.2,
                                    shadowRadius: 2,
                                    shadowOffset: {
                                        height: 2,
                                        width: 2
                                    }
                                }}></TextInput>
                        </View>


                    </View>

                    <Text style={{ marginTop: 10, marginLeft: 15, marginBottom: 5, fontWeight: 'bold' }}>Your budget in Rupees</Text>
                    <TextInput
                        value={this.state.budget}
                        onChangeText={(budget) => this.setState({ budget })}
                        placeholder="Enter Amount"
                        placeholderTextColor="#ddd"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        style={{
                            marginLeft: 15, borderWidth: 0.5, borderColor: "#ddd",
                            marginRight: 20, borderRadius: 5,
                            backgroundColor: '#fff',
                            padding: 5, paddingLeft: 10, paddingRight: 10, shadowOpacity: 0.2,
                            shadowRadius: 2,
                            shadowOffset: {
                                height: 2,
                                width: 2
                            }
                        }}></TextInput>


                    <Text style={{ marginLeft: 15, marginTop: 10, fontWeight: 'bold' }}>Your work links(optional)</Text>
                    {/* <Text style={{ marginLeft: 15, fontSize: 12 }}>We only accept youtube links for now</Text> */}

                    <TextInput
                        onChangeText={(link) => this.setState({ link })}
                        value={this.state.link}
                        placeholder="Put your work link here"
                        placeholderTextColor="#ddd"
                        autoCapitalize="none"

                        style={{
                            marginTop: 5,
                            marginLeft: 15, borderWidth: 0.5, borderColor: "#ddd",
                            marginRight: 20, borderRadius: 5,
                            backgroundColor: '#fff',
                            padding: 5, paddingLeft: 10, paddingRight: 10, shadowOpacity: 0.2,
                            shadowRadius: 2,
                            shadowOffset: {
                                height: 2,
                                width: 2
                            }
                        }}></TextInput>

                    <FlatList
                        //extraData={this.state.workLinks}
                        style={{ flex: 1 }}
                        data={this.state.workLinks}
                        renderItem={({ item, index }) => (

                            <View style={{ backgroundColor: '#ffffff', flexDirection: 'row', paddingLeft: 15, paddingRight: 20 }}>
                                <Text style={{ flex: 1, color: '#000000' }}>{item}</Text>
                                <Text
                                    onPress={() => this.removeLink(index)}
                                    style={{ color: '#3EB9F2' }}>remove</Text>
                            </View>

                        )}
                        keyExtractor={(item, index) => index.toString()}>

                    </FlatList>

                    <TouchableOpacity
                        onPress={this.addLinks.bind(this)}
                        style={{ marginTop: 10, padding: 5, backgroundColor: Colors.appColor, alignSelf: 'baseline', marginLeft: 15, marginRight: 10, borderRadius: 5 }}>
                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '700', paddingLeft: 20, paddingRight: 20 }}>{"Add "}</Text>
                    </TouchableOpacity>



                    <Text style={{ marginLeft: 15, marginTop: 15, fontWeight: 'bold', fontSize: 12 }}>SELECT YOUR AVAILABILITY</Text>

                    <FlatList
                        style={{ alignSelf: 'center' }}
                        horizontal={true}
                        data={this.state.slots}
                        // extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderSlot}
                    />


                </ScrollView>

                <View style={{ padding:10,elevation:2, borderColor: '#ddd', 
        }}>
                <TouchableOpacity
                    onPress={() => this.state.editFlag == '0' ? this.onSubmit('SUBMIT') : this.onSubmit("UPDATE")}
                    style={{ padding: 10, backgroundColor: Colors.appColor,  marginLeft: 10, marginRight: 10,  borderRadius: 5 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '700' }}>{this.state.editFlag == '0' ? "SUBMIT" : "UPDATE"}</Text>
                </TouchableOpacity>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 10, padding: 10, elevation: 5,
        backgroundColor: '#fff', shadowColor: "#ddd",
        borderWidth: 1, borderColor: Colors.appColor, borderRadius: 5,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 3,
            width: 1
        }
    },
    modal: {
        borderRadius: 5,
        marginLeft: 50, marginRight: 50, marginTop: 60, marginBottom: 60,
        backgroundColor: '#fff', padding: 15, paddingLeft: 20, paddingRight: 20


    },
})


function mapStateToProps(state) {
    return {
        response: state.postDataReducer.data,
        hasError: state.postDataReducer.error
    }
}

function mapDispatchToProps(dispatch) {
    return {
        submit: (userid, title, description, category, numOfPeople, duration, budget, workLinks,availableSlots) => dispatch(crRequest(userid, title, description, category, numOfPeople, duration, budget, workLinks, availableSlots)),
        //update: (requestid, title, description, category, numOfPeople, duration, budget, workLinks) => dispatch(upRequest(requestid, title, description, category, numOfPeople, duration, budget, workLinks))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRequest)


