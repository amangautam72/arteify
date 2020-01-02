import { REGISTER_ATTEMPT, REGISTER_SUCCESSFUL, REGISTRATION_FAILED, NO_INTERNET } from '../actionTypes/types'


const initialState = {
    data: {},
    registerIsLoading: false,
    registerSuccessful: false,
    error: false,
    noInternet: false

}


export default function registerReducer(state = initialState, action) {

    switch (action.type) {
        case REGISTER_ATTEMPT:
            return {
                ...state,
                data: {},
                registerIsLoading: true,
                registerSuccessful: false,
                error: false
            }
        case REGISTER_SUCCESSFUL:
            return {
                ...state,
                registerSuccessful: true,
                registerIsLoading: false,
                data: action.payload,
                error: false
            }
        case REGISTRATION_FAILED:
            return {
                ...state,
                registerIsLoading: false,
                registerSuccessful: false,
                data: action.payload,
                error: true,
            }

        case NO_INTERNET:
            return {
                ...state,
                registerIsLoading: false,
                registerSuccessful: false,
                noInternet: true,

            }
        default:
            return state
    }
} 