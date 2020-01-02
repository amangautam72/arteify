import React from 'react'
import { Text, View, TextInput, FlatList, Dimensions,TouchableOpacity } from 'react-native'
//import Autocomplete from 'react-native-autocomplete-input'
import GridList from 'react-native-grid-list';
import { ScrollView } from 'react-native-gesture-handler';


const listData = ['Live Musician', 'Magician', 'Painter', 'Movie Play', 'Dancer', 'Guitarist', 'Dj']
export default class HomeStart extends React.Component {

    constructor() {
        super()
        this.state = {
            flatListVisibility: false,
            searchtext: '',
            data: []
        }

    }


    handleInput = (text) => {
        console.log("OKKKKKK =  " + listData.filter(word => word.includes(text)))
        if (text.length > 2) {
            this.setState({ searchtext: text, flatListVisibility: true, data: listData.filter(word => word.toLowerCase().includes(text.toLowerCase())) })
        } else {
            this.setState({ searchtext: text, flatListVisibility: false })
        }
    }

    renderItem = ({ item, index }) => (
        <View style={{ width: 100, backgroundColor: '#fff', alignSelf: 'baseline', margin: 5, borderRadius: 5, padding: 5 }}>
            <Text
            >{item}</Text>
        </View>
    );

    render() {
        return (
            <View
            style={{flex:1, backgroundColor: '#ddd', paddingTop:100  }}>

                <Text style={{flex:1,fontSize: 50, padding: 20 }}>Book a fantastic artist around you</Text>
                <View style={{flex:1}}>
                    <TextInput
                        value={this.state.searchtext}
                        placeholder="Try 'Live Musician'"
                        placeholderTextColor="#ddd"
                        autoCapitalize="none"
                        onChangeText={this.handleInput}
                        style={{ marginLeft: 20, marginRight: 20, borderRadius: 5, backgroundColor: '#fff', padding: 10 }}></TextInput>



                    <TouchableOpacity 
                    style={{
                        borderRadius: 3, marginLeft: 20, marginTop: 10, backgroundColor: '#fff',
                        alignSelf: 'baseline', paddingLeft: 50, paddingRight: 50, paddingTop: 8, paddingBottom: 8,
                    }}>
                        <Text>Search</Text>
                    </TouchableOpacity>

                    <View style={{ position: 'absolute', marginTop: 40, }}>
                        {this.state.flatListVisibility &&
                            <FlatList
                            keyboardShouldPersistTaps='always'
                                style={{ marginLeft: 20, marginRight: 20, marginTop: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: '#fff' }}
                                data={this.state.data}
                                // extraData={this.state}
                                // keyExtractor={this._keyExtractor}
                                renderItem={(item) => <Text 
                                    onPress={() => this.setState({searchtext:item.item, flatListVisibility:false})}
                                    style={{ width: Dimensions.get('window').width, padding: 10, }}>{item.item}</Text>}
                            />
                        }
                    </View>



                </View>

                <View style={{ flex:1, }}>
                    <View style={{position:'absolute', bottom:20}}>
                    <Text style={{ fontSize: 15, marginLeft: 20 }}>Popular Categories :</Text>
                    <View style={{ width: Dimensions.get('window').width * .9, marginLeft: 15, marginTop: 10 }}>
                        <GridList
                            // showSeparator
                            data={listData}
                            numColumns={3}
                            renderItem={this.renderItem}
                        />
                    </View>

                    <Text 
                    onPress={() => this.props.navigation.navigate('Home')}
                    style={{textAlign:'right', paddingRight:30}}>Skip</Text>
                    </View>
                </View>

            </View>
        )
    }
}