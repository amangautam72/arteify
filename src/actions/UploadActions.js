
import { POSTING_DATA, POSTING_SUCCESSFUL, POSTING_ERROR, NO_INTERNET} from '../actionTypes/types'

import { uploadUrl } from '../services/requests'

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

export function getUploadUrl(TOKEN){
    return(dispatch) => {
        //dispatch(posting())

           
        NetInfo.isConnected.fetch().done((isConnected) => {
            if(isConnected){
                uploadUrl(TOKEN).then(res => {

                    console.log("RESPONSE === " + JSON.stringify(res))
                    
                    // if(res.status == '1'){
                       
        
                    //     dispatch(postingSuccessful(res.data))
                    // }else{
                    //     dispatch(postingError(res.data))
        
                    //     // alert(res.message)
                    // }
                
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

