import { POSTING_DATA, POSTING_SUCCESSFUL, POSTING_ERROR, NO_INTERNET } from '../actionTypes/types'


const initialState = {
    data: {},
    posting: false,
    postingSuccessful: false,
    error: false,
    noInternet: false

}


export default function postDataReducer(state = initialState, action) {

    switch (action.type) {
        case POSTING_DATA:
            return {
                ...state,
                data: {},
                posting: true,
                postingSuccessful:false,
                error: false
            }
        case POSTING_SUCCESSFUL:
            return {
                ...state,
                postingSuccessful: true,
                posting: false,
                data: action.payload,
                error: false
            }
        case POSTING_ERROR:
            return {
                ...state,
                posting: false,
                postingSuccessful: false,
                data: action.payload,
                error: true,
            }

        case NO_INTERNET:
            return {
                ...state,
                posting: false,
                postingSuccessful: false,
                noInternet: true,

            }
        default:
            return state
    }
} 