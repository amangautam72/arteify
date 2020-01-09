import React from 'react'


import { AsyncStorage, BackHandler } from 'react-native'
import { createAppContainer, createStackNavigator} from 'react-navigation'
import HomeStart from '../containers/HomeStart1';
import ArtistRequestBook from '../containers/ArtistRequestBook';
import BookArtist from '../containers/BookArtist';
import Artists from '../containers/Artists';
import PostRequest from '../containers/PostRequest';
import CreateRequest from '../containers/CreateRequest';
import BottomNavigator from './BottomNavigator';

import ArtistPublicProfile from '../containers/ArtistPublicProfile';

import Explore from '../containers/Home'
import Book from '../containers/Book';
import Bookings from '../containers/Bookings';
import GigRequests from '../containers/GigRequests'
import PayNow from '../containers/PayNow'
import DrawerNavigator from './DrawerNavigator';
//import Camera from '../containers/Camera';
import Profile from '../containers/Profile';
import LoginPage from '../containers/LoginPage';
import SignUp from '../containers/SignUp';
import Upload from '../containers/Upload'
import VideoPlayer from '../containers/VideoPlayer';
import { getDailyMotionAccess } from '../services/requests';
import InAppWebview from '../containers/InAppWebview';
import RegisterArtist from '../containers/RegisterArtist';
import AddServices from '../containers/AddServices';
import Categories from '../containers/Categories';
import ArtistServices from '../containers/ArtistServices';
import VerifyUser from '../containers/VerifyUser';
import BookingSuccess from '../containers/BookingSuccess';


export default class AppNavigator extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            currentRoute: '',
            index: 0,

        }

        this.handleBackPress = this.handleBackPress.bind(this);
    }

    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        try {
            const firstTime = await AsyncStorage.getItem('FIRSTRUN');

             if (firstTime == null || firstTime == undefined) {
                
                getDailyMotionAccess().then((res) => {

                    console.log("RESS :  " + JSON.stringify(res))
        
                    if(res.status =="1"){
                        AsyncStorage.setItem("ACCESSTOKEN", res.result.access_token)
                        AsyncStorage.setItem("FIRSTRUN", "FALSE")
                    }
                }).catch((err) => console.log(err))
             }
         } catch (error) {
             // console.error('AsyncStorage#setItem error: ' + error.message);
         }
       
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress() {
        //console.log("SCREEEN  === " + "Index : "+ this.state.index +"   " + JSON.stringify(this.state.currentRoute.routes))

        if (this.state.currentRoute.routeName == 'LoginPage') {
            BackHandler.exitApp();
            return true;
        }
        else if(this.state.currentRoute.routes!=undefined && this.state.currentRoute.routes[this.state.index].routeName == 'Home'){
            
            //const bottomNavRoute = this.state.currentRoute.routes[this.state.index]
           //if(bottomNavRoute.index === 0){
            BackHandler.exitApp();
            return true;
           //}
        }

    }


   
    getCurrentRouteName(navigationState) {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];
        
        this.setState({
            currentRoute: route,
            index: route.index
        })
        //return route.routeName;
    }


    render() {
       
        return (
            
            <Container onNavigationStateChange={(prevState, currentState) => 
                this.getCurrentRouteName(currentState)
            }>
            </Container>

        )
    }
}


const Navigator = createStackNavigator({


    HomeStart: {
        screen: HomeStart,
        navigationOptions: {
            header: null
        }
    },
    LoginPage: {
        screen: LoginPage,
        navigationOptions: {
            header: null
        }
    },
    AddService: {
        screen: AddServices,
        navigationOptions: {
            header: null
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            header: null
        }
    },
    RegisterArtist: {
        screen: RegisterArtist,
        navigationOptions: {
            header: null
        }
    },
    VerifyUser: {
        screen: VerifyUser,
        navigationOptions: {
            header: null
        }
    },
    "Search ": {
        screen: Explore,
        navigationOptions: {
            header: null
        }
    },
   
    Navigator: {
        screen: BottomNavigator,
        navigationOptions: {
            header: null
        }
    },
    Categories: {
        screen: Categories,
        navigationOptions: {
            header: null
        }

    },
    ArtistsSub: {
        screen: Artists,
        navigationOptions: {
            header: null
        }

    },
    ArtistRequestBook: {
        screen: ArtistRequestBook,
        navigationOptions: {
            header: null
        }
    },
    VideoPlayer:{
        screen: VideoPlayer,
        navigationOptions: {
            header: null
        }
    },
    InAppWebview: {
        screen: InAppWebview,
        navigationOptions: {
            header: null
        }
    },
    ArtistPublicProfile: {
        screen: ArtistPublicProfile,
        navigationOptions: {
            header: null
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            header: null
        }
    },
    ArtistServices: {
        screen: ArtistServices,
        navigationOptions: {
            header: null
        }
    },
    BookArtist: { 
        screen: BookArtist,
        navigationOptions: {
            header: null
        }
    },
    Book: {
        screen: Book,
        navigationOptions: {
            header: null
        }
    },
    BookingRequests: {
        screen: GigRequests,
        navigationOptions: {
            header: null
        }
    },
    Bookings: {
        screen: Bookings,
        navigationOptions: {
            header: null
        }
        // navigationOptions: {
        //     drawerIcon: () => (
        //         <Image style={{ width: 20, height: 20,  }}
        //             // resizeMode='contain'
        //             source={require('../assets/bookings.png')}></Image>
        //     ),
        // }
    },

  
    PayNow: {
        screen: PayNow,
        navigationOptions: {
            header: null
        }
    },
    BookingSuccess: {
        screen: BookingSuccess,
        navigationOptions: {
            header: null
        }
    },
    CreateRequest: {
        screen: CreateRequest,
        navigationOptions: {
            header: null
        }
    },
    Upload: {
        screen: Upload,
        navigationOptions: {
            header: null
        }
    },
    // Camera: {
    //     screen: Camera,
    //     navigationOptions: {
    //         header: null
    //     }
    // },

},

)



const Container = createAppContainer(Navigator)
