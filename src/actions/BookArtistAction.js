
import { POSTING_DATA, POSTING_SUCCESSFUL, POSTING_ERROR, NO_INTERNET} from '../actionTypes/types'

import { bookArtist } from '../services/requests'

import NetInfo from "@react-native-community/netinfo";
import { Toast } from 'native-base'


export function posting(){

    return {
        type:POSTING_DATA,
    }
}

export function postingSuccessful(response){
    return {
        type: POSTING_SUCCESSFUL,
        payload: response,
    }
}


export function postingError(res){
    return {
        type: POSTING_ERROR,
        payload: res,
        
    }
}

export function noInternet(){
    return {
        type: NO_INTERNET,
        
    }
}

export function bookAction(requestid,userid,timestamp,slot, eventcity, venue){
    return(dispatch) => {
        //dispatch(posting())

           
        NetInfo.isConnected.fetch().done((isConnected) => {
            if(isConnected){
                bookArtist(requestid,userid,timestamp,slot, eventcity, venue).then(res => {
                    console.log("RESPONSE === " + JSON.stringify(res))
                    
                    if(res.status == '1'){
                        dispatch(postingSuccessful(res))
                    }else{
                        dispatch(postingError(res))
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

