import { FETCHING_DATA, FETCHING_DATA_SUCCESS, FETCHING_DATA_FAILURE, NO_INTERNET } from '../actionTypes/types'


const initialState = {
    data: {},
    fetching: false,
    fetchingSuccessful: false,
    error: false,
    noInternet: false

}


export default function fetchDataReducer(state = initialState, action) {

    switch (action.type) {
        case FETCHING_DATA:
            return {
                ...state,
                data: {},
                fetching: true,
                fetchingSuccessful:false,
                error: false
            }
        case FETCHING_DATA_SUCCESS:
            return {
                ...state,
                fetchingSuccessful: true,
                fetching: false,
                data: action.payload,
                error: false
            }
        case FETCHING_DATA_FAILURE:
            return {
                ...state,
                fetching: false,
                fetchingSuccessful: false,
                data: action.payload,
                error: true,
            }

        case NO_INTERNET:
            return {
                ...state,
                fetching: false,
                fetchingSuccessful: false,
                noInternet: true,

            }
        default:
            return state
    }
} 