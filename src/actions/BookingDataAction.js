
import { FETCHING_DATA, FETCHING_DATA_SUCCESS, FETCHING_DATA_FAILURE, NO_INTERNET} from '../actionTypes/types'

import { bookingInfo } from '../services/requests'

import NetInfo from "@react-native-community/netinfo";
import { Toast } from 'native-base'


export function fetching(){

    return {
        type:FETCHING_DATA,
    }
}

export function fetchingSuccessful(response){
    return {
        type: FETCHING_DATA_SUCCESS,
        payload: response,
    }
}


export function fetchingFailed(res){
    return {
        type: FETCHING_DATA_FAILURE,
        payload: res,
        
    }
}

export function noInternet(){
    return {
        type: NO_INTERNET,
        
    }
}

export function fetchData(userid, usertype){
    return(dispatch) => {
        dispatch(fetching())

           
        NetInfo.isConnected.fetch().done((isConnected) => {
            if(isConnected){
                bookingInfo(userid, usertype).then(res => {

                    console.log("RESPONSE === " + JSON.stringify(res))
                    
                    if(res.status == '1'){

                        console.log("FFFFFFFFFFFFFF")
                       
                        dispatch(fetchingSuccessful(res.data))
                    }else{
                        dispatch(fetchingFailed(res.data))
        
                        // alert(res.message)
                    }
                
                })
                .catch((err) => console.log("ERROR : " + err))
            }
            else{
                Toast.show({ text: 'No internet connection found!- Internet connection required to use this app', buttonText: 'okay', duration: 3000 })
                dispatch(noInternet())
            }
        })

     

    } 
}
