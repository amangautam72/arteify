
import { LOGIN_ATTEMPT, LOGIN_SUCCESSFUL, LOGIN_FAILED, NO_INTERNET} from '../actionTypes/types'

import { loginRequest } from '../services/requests'

import {AsyncStorage} from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import { Toast } from 'native-base'


export function loggingIn(){

    return {
        type:LOGIN_ATTEMPT,
    }
}

export function loginSuccessful(response){
    return {
        type: LOGIN_SUCCESSFUL,
        payload: response,
    }
}


export function loginFailed(res){
    return {
        type: LOGIN_FAILED,
        payload: res,
        
    }
}

export function noInternet(){
    return {
        type: NO_INTERNET,
        
    }
}

export function login(username, password){
    return(dispatch) => {
        dispatch(loggingIn())

           
        NetInfo.isConnected.fetch().done((isConnected) => {
            if(isConnected){
                loginRequest(username,password).then(res => {

                    console.log("RESPONSE === " + JSON.stringify(res))
                    
                    if(res.status == '1'){
                       
                        storeValue(res.data.userdata.usertype, res.data.userdata.id, res.data.userdata.user_name)
        
                        dispatch(loginSuccessful(res.data.userdata))
                    }else{
                        dispatch(loginFailed(res.message))
        
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

function storeValue(usertype,userid,username){

    console.log("STOREDDDD")

    AsyncStorage.setItem("LOGGEDIN", 'true')
    AsyncStorage.setItem("USERTYPE", usertype.toString())
    AsyncStorage.setItem("USERID", userid.toString())
    AsyncStorage.setItem("USERNAME",username )
   
}