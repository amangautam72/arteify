
import { REGISTER_ATTEMPT, REGISTER_SUCCESSFUL, REGISTRATION_FAILED, NO_INTERNET} from '../actionTypes/types'

import { registerRequest } from '../services/requests'

import { AsyncStorage } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import { Toast } from 'native-base'


export function registering(){

    return {
        type:REGISTER_ATTEMPT,
    }
}

export function registerSuccessful(response){
    return {
        type: REGISTER_SUCCESSFUL,
        payload: response,
    }
}


export function registerFailed(res){
    return {
        type: REGISTRATION_FAILED,
        payload: res,
        
    }
}

export function noInternet(){
    return {
        type: NO_INTERNET,
        
    }
}

export function register(username,email,password,description,locationid,number, usertype){
    return(dispatch) => {
        dispatch(registering())

           
        NetInfo.isConnected.fetch().done((isConnected) => {
            if(isConnected){
                registerRequest(username,email,password,description,locationid,number, usertype).then(res => {

                    console.log("RESPONSE === " + JSON.stringify(res))
                    
                    if(res.status == '1'){
                       
                        storeValue(usertype,res.data.userinfo.id,res.data.userinfo.user_name)
        
                        dispatch(registerSuccessful(res.data))
                    }else{
                        dispatch(registerFailed(res.data))
        
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

function storeValue(usertype,userid, username){

    AsyncStorage.setItem("LOGGEDIN", 'true')
    AsyncStorage.setItem("USERID", userid.toString())
    AsyncStorage.setItem("USERTYPE", usertype)
    AsyncStorage.setItem("USERNAME",username )
}