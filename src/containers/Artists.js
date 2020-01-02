import React from 'react'
import {StyleSheet, Text, View, Image, FlatList, TextInput,TouchableOpacity,AsyncStorage } from 'react-native'

import { Header, Left, Icon, Button, Right,Toast } from 'native-base'
import {  ScrollView } from 'react-native-gesture-handler';

import { connect } from 'react-redux'
import { fetchData } from '../actions/ArtistListAction';
import Colors from '../Colors/Colors';


const listData = ['Live Musician', 'Magician', 'Painter', 'Movie Play', 'Dancer', 'Guitarist', 'Dj']
class Artists extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userid:'',
            searchtext: '',
            categoryid: this.props.navigation.getParam('categoryid',-1),
            headerTitle: this.props.navigation.getParam('name','ERROR OCCURED'),
            artlistList: [],
            backUpList: []
        }


        console.log("CATEGORY :   "  + this.state.categoryid)
    }

    async componentDidMount() {

        try {
            const userid = await AsyncStorage.getItem('USERID');

            console.log("USERTYPE :  " + userid)
            if (userid != null) {

                this.setState({ userid: userid })

            }
        } catch (error) {
            // console.error('AsyncStorage#setItem error: ' + error.message);
        }

    }

    componentWillMount(){
        this.props.fetchArtists(this.state.categoryid)
      
    }

   componentDidUpdate(props){

        if (props.response != this.props.response) {
            if (props.hasError) {
              Toast.show({ text: 'Something went wrong', buttonText: 'okay', duration: 3000 })
              return
            }
      
            this.setState({artlistList: this.props.response,backUpList: this.props.response })
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

    

    searchFilterFunction = text => { 
        if(text.length < 1){
            this.setState({ artlistList: this.state.backUpList }); 
            return 
        }   
        const newData = this.state.artlistList.filter(item => {      
          const itemData = `${item.username.toUpperCase()}   
          ${item.title.toUpperCase()}`;
          
           const textData = text.toUpperCase();
            
           return itemData.indexOf(textData) > -1;    
        });
        
        this.setState({ artlistList: newData });  
      };

    render() {
        return (
            <View
                style={{ flex: 1, }}>
                     <Header androidStatusBarColor={"#505050"}
                    style={{ backgroundColor: '#DDDDDD' }}>
                    <Left style={{flexDirection:"row"}}>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon style={{ color: Colors.Darkgrey }} name='arrow-back' />

                        </Button>
                        <Text style={{ fontSize:18,padding:10, color:Colors.Darkgrey,fontWeight:'bold' }}>{this.state.headerTitle+" "}</Text>
                    </Left>
                   
                    <Right></Right>
                </Header>


                <ScrollView>

                <TouchableOpacity style={{flexDirection:'row', borderWidth:1,borderColor:'#ddd',
                paddingLeft:10, margin:10,borderRadius:4,
              backgroundColor:'#fff',shadowColor: "#ddd",
              shadowOpacity: 0.8,
              shadowRadius: 2,
              shadowOffset: {
                height: 3,
                width: 2
              }}}>
                    <Icon style={{padding:5}} name='search'></Icon>
                    <TextInput
                                autoCapitalize="none"
                                onChangeText={text => this.searchFilterFunction(text)}
                                multiline={false}
                                placeholder="Search"
                                style={{flex:1,padding:0, paddingLeft:10,  }}

                            >

                            </TextInput>

                    {/* <Text style={{fontSize:15, color: '#808B96',marginLeft:5, alignSelf:'center'}}>Search bands here</Text> */}
                </TouchableOpacity>

            

                <FlatList
                    data={this.state.artlistList}
                    //extraData={this.state}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={this.renderItem}
                />





</ScrollView>

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


function mapStateToProps(state){
    return{
        response: state.fetchDataReducer.data,
        hasError: state.fetchDataReducer.error
    }
}

function mapDispatchToProps(dispatch){
    return{
        fetchArtists: (categoryid) => dispatch(fetchData(categoryid))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Artists)