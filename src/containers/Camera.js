import React from 'react'

import { StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import { Text, View, Icon } from 'native-base';

import { RNCamera } from 'react-native-camera'
import Video from 'react-native-video'
import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};


export default class Camera extends React.Component {

  camera = null;
  player = null;

  constructor() {
    super()
    this.state = {
      frontCamera: false,
      uri: '',
      recording: false,
      rendering: false,
      processing: false,
      currentTime: 0,
      paused: false,
      duration: 10
    }
  }


  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      this.setState({ uri: data.uri })
      console.log(data.uri);
    }
  };

  async startRecording() {
    if (this.camera) {
      const options = { maxDuration: 10 }
      this.setState({ recording: true });
      // default to mp4 for android as codec is not set
      const data = await this.camera.recordAsync(options);
      this.setState({ uri: data.uri })
      console.log("FILE", data.uri); // -- it returns - 
    }
  }

  stopRecording() {
    this.camera.stopRecording();
  }

  onVideoLoad(e) {
    this.setState({ currentTime: e.currentTime, duration: e.duration });
  }
  onVideoEnd() {
    this.player.seek(0);
    this.setState({ currentTime: 0, paused: true });
  }


  playOrPauseVideo(paused) {
    this.setState({ paused: !paused });
  }
  onProgress(e) {
    this.setState({ currentTime: e.currentTime });
  }

  getCurrentTimePercentage(currentTime, duration) {
    if (currentTime > 0) {
      return parseFloat(currentTime) / parseFloat(duration);
    } else {
      return 0;
    }
  }

  launchCamera() {
    console.log("BINEDDDDD")
    // Open Image Library:
    ImagePicker.launchImageLibrary(options, (response) => {
      // Same code as in above section!

      console.log("RESSS  =- =  " + JSON.stringify(response))
    });
  }

  render() {

    let { currentTime, duration, paused } = this.state;
    const completedPercentage = this.getCurrentTimePercentage(currentTime, duration) * 100;
    return (
      <View style={{ flex: 1 }}>


        {/* <Video source={{ uri: this.state.uri }}   // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref
          }}                                      // Store reference
          // onBuffer={this.onBuffer}                // Callback when remote video is buffering
          // onError={this.videoError}               // Callback when video cannot be loaded
          style={styles.backgroundVideo} /> */}

     {this.state.uri != '' ?
          <TouchableOpacity
            onPress={this.playOrPauseVideo.bind(this, paused)}
            style={{ flex: 1 }}>
            {/* <Image style={{ flex: 1 }}
            source={{ uri: this.state.uri }}>

          </Image> */}

            <Video source={{ uri: this.state.uri }}   // Can be a URL or a local file.
              ref={(ref) => {
                this.player = ref
              }}                                      // Store reference
              // onBuffer={this.onBuffer}                // Callback when remote video is buffering
              // onError={this.videoError}
              onEnd={this.onVideoEnd.bind(this)}               // Callback when video cannot be loaded
              onLoad={this.onVideoLoad.bind(this)}
              onProgress={this.onProgress.bind(this)}
              paused={paused}
              style={styles.backgroundVideo} />

            <Icon onPress={() => this.setState({ uri: '' })}
              style={{ position: 'absolute', right: 20, top: 10 }} name='close'></Icon>
          </TouchableOpacity>
          :
          <View style={{ flex: 1 }}>

            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={this.state.frontCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              captureAudio={true}
            ></RNCamera>

            <View style={{
              width: Dimensions.get('window').width, position: 'absolute', bottom: 0,
              justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
            }}>

              <TouchableOpacity
                onPress={this.launchCamera.bind(this)}
                style={{ alignSelf: 'center', position: 'absolute', left: 50, height: 50, width: 50, backgroundColor: '#fff' }}>
                {/* <Icon style={{ fontSize: 50, color: '#fff' }} name='camera' ></Icon> */}
              </TouchableOpacity>


              <TouchableOpacity onPress={this.startRecording.bind(this)}
                style={styles.capture}>

              </TouchableOpacity>

              <TouchableOpacity
                //onPress={this.stopRecording.bind(this)}
                onPress={() => this.state.frontCamera ? this.setState({ frontCamera: false }) : this.setState({ frontCamera: true })}
                style={{ alignSelf: 'center', position: 'absolute', right: 50 }}>
                <Icon style={{ fontSize: 50, color: '#fff' }} name='camera' ></Icon>
              </TouchableOpacity>
            </View>

          </View>
     }








      </View>
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
});