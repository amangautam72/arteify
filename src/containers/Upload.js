import React from 'react'

import {
  View, StyleSheet, Text, Image, TouchableOpacity, AsyncStorage, Dimensions,
  FlatList, Modal, ProgressBarAndroid, ScrollView
} from 'react-native'
import { Header, Left, Icon, Button, Right, Toast } from 'native-base'
import { WebView } from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob'
//import Video from 'react-native-video'


const width = Dimensions.get('window').width

import ImagePicker from 'react-native-image-picker';
import ImagePickerr from 'react-native-image-crop-picker';
import { uploadUrl, createVideo, publishVideo, getDailyMotionAccess, getRequestWork, updateRequestImage } from '../services/requests';
import Colors from '../Colors/Colors';
import { SERVER_ADDRESS } from '../services/server';

const options = {
  title: 'Select Avatar',
  mediaType: 'video',
  videoQuality: 'low',
  durationLimit: 10,
  //customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'videos',
  },
};

export default class Upload extends React.Component {

  player = null;

  constructor(props) {
    super(props)
    this.state = {

      title: this.props.navigation.getParam('title'),
      requestid: this.props.navigation.getParam('requestid'),
      workLinks: this.props.navigation.getParam('links'),
      progressVisible: false,
      progress: 0,
      token: '',
      workSample: [],
      fileUri: ''

    }

  }

  async componentDidMount() {

    this.getRequestWork()

    try {
      const token = await AsyncStorage.getItem('ACCESSTOKEN');

      if (token != null) {
        console.log("TOKEN  : " + token)
        this.setState({ token: token })

      }
    } catch (error) {
      // console.error('AsyncStorage#setItem error: ' + error.message);
    }

  }

  getRequestWork() {
    getRequestWork(this.state.requestid).then((res) => {
      if (res.status == '1') {
        this.setState({ workSample: res.data.imagevideo })
      }

    }).catch((err) => console.log(err))
  }

  launchCamera() {
    // Open Image Library:
    ImagePicker.launchImageLibrary(options, (response) => {
      // Same code as in above section!


      this.setState({ progressVisible: true, fileUri: response.uri })

      this.uploadUrl()

    });
  }

  launchGallery() {
    ImagePickerr.openPicker({
      mediaType: "photo",
      //multiple: true,
      compressImageQuality: 0.1,

    }).then((image) => {

      updateRequestImage(this.state.requestid, image.path).then((res) => {
        console.log("IIIIII : " + JSON.stringify(res))

        if(res.status == "1"){
          Toast.show({ text: "Image has been uploaded successfully", buttonText: 'okay', duration: 3000 })
          this.getRequestWork();
        }

      }).catch(err => console.log(err))

    })
  }

  uploadUrl() {
    uploadUrl(this.state.token).then((res) => {
      console.log("UPLOAD URL :  " + JSON.stringify(res))

      if (res.error != undefined) {
        this.getAccessToken()
      }
      else {

        this.uploadVideo(res.upload_url, this.state.fileUri)
      }
    }).catch(err => this.setState({ progressVisible: false }))

  }

  getAccessToken() {
    getDailyMotionAccess().then((res) => {

      console.log("RESS :  " + JSON.stringify(res))

      if (res.status == "1") {
        AsyncStorage.setItem("ACCESSTOKEN", res.result.access_token)
        this.setState({ token: res.result.access_token })

        this.uploadUrl()

      } else {
        this.setState({ progressVisible: false })
        Toast.show({ text: "Something went wrong, please try again", buttonText: 'okay', duration: 3000 })
        return
      }
    }).catch((err) => this.setState({ progressVisible: false }))
  }

  uploadVideo(upload_url) {

    RNFetchBlob.fetch('POST', upload_url, {
      // dropbox upload headers

      'Content-Type': 'multipart/form-data',
      // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
      // Or simply wrap the file path with RNFetchBlob.wrap().
    }, [
      // element with property `filename` will be transformed into `file` in form data

      { name: 'file1', filename: 'artist.mp4', data: RNFetchBlob.wrap(this.state.fileUri) },
      // custom content type

    ]).uploadProgress((written, total) => {
      console.log('uploaded: ', written / total)
      this.setState({ progress: written / total })
    })
      .then((res) => {
        console.log("UPLOADDED : " + JSON.stringify(res.json()))
        var response = res.json()
        if (response.error != undefined) {
          //this.setState({ progressVisible: false })
          Toast.show({ text: "Something went wrong, please try again", buttonText: 'okay', duration: 3000 })
          return;
        }

        this.createVideo(response.url);

      })
      .catch((err) => {
        // error handling ..

        Toast.show({ text: "Something went wrong, please try again", buttonText: 'okay', duration: 3000 })
      })

  }

  createVideo(url) {
    createVideo(url, this.state.token).then((res) => {
      console.log("CREATE VIDEO : " + JSON.stringify(res))
      if (res.error != undefined) {
        this.setState({ progressVisible: false })
        Toast.show({ text: "Something went wrong, please try again", buttonText: 'okay', duration: 3000 })
        return
      }
      else {
        this.publishVideo(res.id)

      }
    }).catch((error) => this.setState({ progressVisible: false }))
  }

  publishVideo(id) {
    publishVideo(id, this.state.token, this.state.requestid).then((ress) => {
      console.log("PUBLISHED :  " + JSON.stringify(ress))
      if (ress.status == '1') {
        Toast.show({ text: "Your video is successfully uploaded", buttonText: 'okay', duration: 3000 })
        this.getRequestWork()
        this.setState({ progressVisible: false })
      } else {
        this.setState({ progressVisible: false })
        Toast.show({ text: "Something went wrong, please try again", buttonText: 'okay', duration: 3000 })
      }
    }).catch(err => this.setState({ progressVisible: false }))
  }


  render() {
    return (

      <ScrollView style={{ flex: 1 }}>

        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.progressVisible}
        >

          <View
            // onPress={() => this.setModalVisible(!this.state.modalVisible)}
            style={{
              flex: 1, justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
            <View
              style={styles.modal}>

              <Text style={{ paddingBottom: 10 }}>Please wait while your video is being uploaded...</Text>

              <ProgressBarAndroid
                styleAttr="Horizontal"
                indeterminate={false}
                progress={this.state.progress}
              />

            </View>

          </View>
        </Modal>

        <Header style={{ backgroundColor: Colors.appColor }}>
          <Left style={{ flex: 1, flexDirection: "row" }}>
            <Button transparent
              onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />

            </Button>
            <Text style={{ fontSize: 18, padding: 10, color: '#fff', fontWeight: 'bold' }}>{'Upload Work Sample '}</Text>
          </Left>

          <Right></Right>
        </Header>




        <View style={{ flexDirection: 'row' }}>

          <TouchableOpacity
            onPress={this.launchGallery.bind(this)}
            //onPress={() => this.props.navigation.navigate('Camera')}
            style={{
              flex: 1,
              height: 50, justifyContent: 'center', backgroundColor: '#ddd', margin: 20,
              marginLeft: 10, marginRight: 10, marginTop: 20, borderRadius: 5
            }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '700' }}>Upload Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.launchCamera.bind(this)}
            //onPress={() => this.props.navigation.navigate('Camera')}
            style={{
              flex: 1,
              height: 50, justifyContent: 'center', backgroundColor: '#ddd', margin: 20,
              marginLeft: 10, marginRight: 10, marginTop: 20, borderRadius: 5
            }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '700' }}>Upload Video</Text>
          </TouchableOpacity>

        </View>



        <View>
          <Text style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}>{this.state.workSample.length > 0 ? 'Your Work Samples' : "You haven't uploaded any sample yet, upload to get noticed"}</Text>

          <FlatList
            // keyboardShouldPersistTaps='always'
            data={this.state.workSample}
            // extraData={this.state}
            keyExtractor={(item,index) => index.toString()}
            renderItem={({ item, index }) => (

              item.filetype == 'video' ?
                <View style={{width:width, height: 175, }}>

                  <WebView
                    style={{ width: width, height: Dimensions.get('window').height }}
                    automaticallyAdjustContentInsets={true}
                    source={{ html: `<iframe frameborder="0" width="100%" height="400" controls="0" src="https://www.dailymotion.com/embed/video/${item.video}?queue-enable=false&sharing-enable=false&ui-logo=0" allowfullscreen></iframe>` }}
                  />

                </View> 
                :
                <Image
                  resizeMode={'cover'}
                  style={{  height: 200, margin:3 }}
                  source={{ uri: SERVER_ADDRESS + '/images/' + item.image }}
                />

            )}
          />
        </View>


      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {

    alignSelf: 'center',
    width: 80, height: 80,
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 3, borderColor: '#ddd',
    padding: 15,
    paddingHorizontal: 20,

    margin: 10,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modal: {
    borderRadius: 5,
    marginLeft: 50, marginRight: 50, marginTop: 60, marginBottom: 60,
    backgroundColor: '#fff', padding: 15, paddingLeft: 20, paddingRight: 20


  },
});