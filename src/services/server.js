
export const SERVER_ADDRESS = "http://192.168.1.45:8086"
//export const SERVER_ADDRESS = "http://ec2-13-233-172-180.ap-south-1.compute.amazonaws.com:5000"

export default {
    LOGIN: SERVER_ADDRESS+'/login',
    REGISTER: SERVER_ADDRESS+'/register',
    CATEGORY: SERVER_ADDRESS+'/category',
    CREATE_REQUEST: SERVER_ADDRESS+'/createpost',
    UPDATEPOST: SERVER_ADDRESS+'/updatepost',
    DELETEPOST: SERVER_ADDRESS+'/deletepost',
    UPDATEIMAGE: SERVER_ADDRESS+'/updateimage',
    PROFILE_INFO: SERVER_ADDRESS+'/postuserid',
    BOOKING_INFO: SERVER_ADDRESS+'/booking',
    ARTIST_LIST: SERVER_ADDRESS+'/postcatid',
    REQUEST_WORK_SAMPLE: SERVER_ADDRESS+'/postimagevideo',
    BOOKARTIST: SERVER_ADDRESS+'/createbooking',
    DAILYMOTION_ACCESS: SERVER_ADDRESS+'/getaccess',
    GET_UPLOAD_URL: 'https://api.dailymotion.com/file/upload?',
    CREATE_VIDEO: 'https://api.dailymotion.com/me/videos',
    PUBLISH_VIDEO: SERVER_ADDRESS+'/publishvideo',
    CREATE_POST: SERVER_ADDRESS+'/createuserpost',
    FOLLOW: SERVER_ADDRESS+'/userfollow',
    UNFOLLOW: SERVER_ADDRESS+'/userunfollow',
    FOLLOW_CHECK: SERVER_ADDRESS+'/followcheck',
    GET_FOLLOWINGS_POST: SERVER_ADDRESS+'/getpostbyuser',
    UPDATE_PROFILE: SERVER_ADDRESS+'/updateprofile',
    UPDATE_BOOKING_STATUS: SERVER_ADDRESS+'/statuschange',
    REQUEST_BOOKING_INFO: SERVER_ADDRESS+'/bookbypost',
    GET_EVENTS: SERVER_ADDRESS+'/getevent',
    GET_TOP_USERS: SERVER_ADDRESS+'/gettopuser',
    SEND_OTP: SERVER_ADDRESS+'/sendotp',
    PAYTM_CHECKSUM: SERVER_ADDRESS+'/paytmss',
    VERIFY_TRANSACTION: SERVER_ADDRESS+'/verifypayment',
    FEATURE_ARTISTS: SERVER_ADDRESS+'/featurepost'

}