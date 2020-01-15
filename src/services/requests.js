

import Server, { SERVER_ADDRESS } from '../services/server'

import firebase from 'react-native-firebase'

export const loginRequest = async (username,password) => {

    const fcmToken = await firebase.messaging().getToken();

    var params = {
        email: username,
        password: password,
        token: fcmToken
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.LOGIN, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}

export const forgotPassword = async (mail) => {

    var params = {
        email: mail,
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.FORGOT_PASSWORD, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const confirmPassword = async (mob,otp,password) => {

    var params = {
        mobile: mob,
        otp: otp,
        password: password,
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.CONFIRM_PASSWORD, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}

export const registerRequest = async(otp,username,email,password,description,locationid,number, usertype) => {
    const fcmToken = await firebase.messaging().getToken();
    var params = {
        otp:otp,
        user_name: username,
        email: email,
        password: password,
        description: description,
        location: locationid,
        mobile: number,
        usertype: usertype,
        token: fcmToken
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.REGISTER, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}

export const sendOtp = (number) => {
    var params = {
        mobile: number,
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.SEND_OTP, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}



export const createRequest = (userid,title,description,category,numOfPeople,duration,budget, workLinks, availableSlots) => {
    console.log("SLOTSSS : " + availableSlots)
    var params = {
        userid: userid,
        title: title,
        description: description,
        category: category,
        budget: budget,
        team: numOfPeople,
        duration:duration,
        url:workLinks,
        slot: availableSlots
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.CREATE_REQUEST, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const updateRequest = (requestid,title,description,category,numOfPeople,duration,budget, workLinks, availableSlots) => {
    var params = {
        postid: requestid,
        title: title,
        description: description,
        category: category,
        budget: budget,
        team: numOfPeople,
        duration:duration,
        url:workLinks,
        slot: availableSlots
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.UPDATEPOST, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}

export const updateRequestImage = (requestid,image) => {
    var params = {
        postid: requestid,
    }

    var formData = new FormData();
    
    for (var k in params) {
        formData.append(k, params[k]);
    }

    formData.append('image', {
      uri: image,
      name: 'photo',
      type: 'image/jpeg',
    });

    console.log("PARAMS  : " + JSON.stringify(formData))

    return fetch(Server.UPDATEIMAGE, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        body: formData

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const deleteRequest = (requestid) => {
    var params = {
        id: requestid,
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.DELETEPOST, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const profileInfo = (userid) => {
    var params = {
        user_id: userid,
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.PROFILE_INFO, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const bookingInfo = (userid, usertype) => {
    console.log("====== = = =  : " + usertype)
    var params = {
        userid: userid,
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.BOOKING_INFO, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const artistList = (categoryid) => {
    var params = {
        cat_id: categoryid,
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.ARTIST_LIST, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}

export const featuredArtist = () => {

    return fetch(Server.FEATURE_ARTISTS, {
        method: "GET",

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}




export const categories = () => {

    return fetch(Server.CATEGORY, {
        method: "GET",
        // headers: {
        //     Accept: 'application/json',
        //     //'Content-Type': 'application/json',
        //     // 'Content-Type': 'multipart/form-data'
        //   },
    }).then((response) => response.json())
    
        .catch((error) => {
            console.error("ERROR ===  = "+error);
        });
}


export const getEvents = () => {

    return fetch(Server.GET_EVENTS, {
        method: "GET",
        // headers: {
        //     Accept: 'application/json',
        //     //'Content-Type': 'application/json',
        //     // 'Content-Type': 'multipart/form-data'
        //   },
    }).then((response) => response.json())
    
        .catch((error) => {
            console.error("ERROR ===  = "+error);
        });
}

export const getTopUsers = () => {

    return fetch(Server.GET_TOP_USERS, {
        method: "GET",
        // headers: {
        //     Accept: 'application/json',
        //     //'Content-Type': 'application/json',
        //     // 'Content-Type': 'multipart/form-data'
        //   },
    }).then((response) => response.json())
    
        .catch((error) => {
            console.error("ERROR ===  = "+error);
        });
}


export const bookArtist = (requestid,userid,timestamp,slot, event_city, venue) => {
    var params = {
        postid: requestid,
        userid: userid,
        date: timestamp,
        slot: slot,
        city: event_city,
        venue: venue
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.BOOKARTIST, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const getDailyMotionAccess = () => {

    return fetch(Server.DAILYMOTION_ACCESS, {
        method: "GET",
        // headers: {
        //     Accept: 'application/json',
        //     //'Content-Type': 'application/json',
        //     // 'Content-Type': 'multipart/form-data'
        //   },
    }).then((response) => response.json())
    
        .catch((error) => {
            console.error("ERROR ===  = "+error);
        });
}

export const uploadUrl = (token) => {

    return fetch(Server.GET_UPLOAD_URL+'access_token='+token, {
        method: "GET",
        // headers: {
        //     Accept: 'application/json',
        //     //'Content-Type': 'application/json',
        //     // 'Content-Type': 'multipart/form-data'
        //   },
    }).then((response) => response.json())
    
        .catch((error) => {
            console.error("ERROR ===  = "+error);
        });
}

export const createVideo = (url,token) => {
    var params = {
        url: url,
        access_token: token,
      
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.CREATE_VIDEO, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}

export const publishVideo = (title,token,requestid) => {
    var params = {
        video_id: title,
        accesstoken: token,
        requestid: requestid
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.PUBLISH_VIDEO, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const getRequestWork = (requestid) => {
    var params = {
        postid: requestid,
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.REQUEST_WORK_SAMPLE, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const createPost = (userid,postText) => {
    var params = {
        user_id: parseInt(userid),
        text: postText
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.CREATE_POST, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}

export const followUnfollow = (follower_id,following_id,follow_type) => {
    var params = {
        user_id: parseInt(follower_id),
        artist_id: parseInt(following_id),
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    let url = ''
    if(follow_type == 'Follow'){
        url = Server.FOLLOW
    }else if(follow_type == 'Following'){
        url = Server.UNFOLLOW
    }else{
        alert("Something went wrong")
        return
    }

    return fetch(url, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}

export const followCheck = (follower_id,following_id) => {
    var params = {
        user_id: parseInt(follower_id),
        artist_id: parseInt(following_id),
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.FOLLOW_CHECK, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}

export const getFollowingsPost = (user_id) => {
    var params = {
        user_id: parseInt(user_id),
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.GET_FOLLOWINGS_POST, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const updateProfile = (userid,username,description,image) => {
    var params = {
        id: userid,
        user_name: username,
        description: description
    }

    var formData = new FormData();
    
    for (var k in params) {
        formData.append(k, params[k]);
    }

    if(image != ''){
        formData.append('image', {
            uri: image,
            name: 'photo',
            type: 'image/jpeg',
          });
    }

    

    console.log("PARAMS  : " + JSON.stringify(formData))

    return fetch(Server.UPDATE_PROFILE, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        body: formData

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const updateBookingStatus = (booking_id, user_id, status) => {
    var params = {
        book_id: booking_id,
        user_id: parseInt(user_id),
        status:status
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.UPDATE_BOOKING_STATUS, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const getBookingDetails = (request_id) => {
    var params = {
        postid: request_id,
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.REQUEST_BOOKING_INFO, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}


export const paymentApi = (userid, amount) => {
    var params = {
        user_id: userid,
        amount: amount,
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.PAYTM_CHECKSUM, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}

export const verifyTransaction = (orderid, userid, bookingid) => {
    var params = {
        order_id: orderid,
        user_id: userid,
        booking_id: bookingid
    }

    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    console.log("PARAMS  : " + JSON.stringify(formBody))

    return fetch(Server.VERIFY_TRANSACTION, {
        method: "POST",
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody

    }).then((response) => response.json())
    
        .catch((error) => {
            console.error(error);
        });
}