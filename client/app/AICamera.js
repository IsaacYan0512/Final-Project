import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Button } from 'react-native';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { StatusBar } from 'expo-status-bar';
import * as FS from 'expo-file-system';
const {width, height} = Dimensions.get('window')
const COLORS = {primary: '#FFE7C9' , white: '#FFF'};


const AICamera = () => {
    let cameraRef = useRef();
    const [hasCamPermission, setHasCamPermission] = useState();
    const [mediaLib, setMediaLib] = useState();
    const [photo, setPhoto] = useState();

    const navigator = useNavigation();

    useEffect(() => {
        (async () => {
            const camPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCamPermission(camPermission.status === 'granted');
            setMediaLib(mediaLibPermission === 'granted');
        })();
    }, [])

    if (hasCamPermission === undefined) {
        return <Text>Requesting permissions...</Text>
    } else if (!hasCamPermission) {
        return <Text>Permission for camera not granted. Please change this in settings.</Text>
    }

    const takePic = async () => {
        let options = {
            quality: 1,
            base64: true,
            exif: false,
        };
        let newPhoto = await cameraRef.current.takePictureAsync(options);
        setPhoto(newPhoto);
    };

    const handleGoback = () => {
        navigator.navigate('Barcode');
    }

    if (photo) {
        const sharePic = async () => {
            let schema = 'http://';
            let host = '172.20.10.5';
            let route = '/image';
            let port = '5000';
            let url = '';
            let content_type = 'image/jpeg';

            url = schema + host + ':' + port + route;

            let response = await FS.uploadAsync(url, photo.uri, {
                headers: {
                    'content-type': content_type,
                },
                httpMethod: 'POST',
                uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
            });

            console.log(response.headers);
            console.log(response.body);

            let result = response.body;

            navigator.navigate('Result', {
                result: result,
                photo: photo.uri
            });

            // This function is for sharing the photo
            // shareAsync(photo.uri).then(() => {
            //     setPhoto(undefined);
            // });


            // Sending Photo to AI model here: Follow this format
            // try {
            //     let config = { 
            //         headers: {  
            //             'Content-Type': 'application/json',
            //             'Access-Control-Allow-Origin': '*'
            //         }
            //     }
            //     const response = await axios.post('http://127.0.0.1:5000/',
            //     {label: 'Test', text: 'Test'}, config
            //     )

            //     // This is the response from AI server
            //     console.log(response.status) // It should be 201 for success, 404 for page not found, etc...
            //     console.log(response.data) // this should be recycle or not recycle

            //     // If the console.log(response.data) give results such as recycle or general waste then success. DONE

            // } catch(err) {
            //     console.log(err)
            // }
        };

        const savePhoto = () => {
            MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
                setPhoto(undefined);
            });
        };

        return (
            <View style={styles.container}>
                <Image style={styles.preview} source={{uri: "data:image/jpg;base64," + photo.base64}}/>
                <Button title="Share" onPress={sharePic} />
                {mediaLib ? <Button title='Save' onPress={savePhoto}/> : undefined}
                <Button title='Discard' onPress={() => setPhoto(undefined)}/>
            </View>
        )
    }

    return (
        <>
            <Camera style={styles.container} ref={cameraRef}>
                <View style={styles.exit}>
                    <TouchableOpacity onPress={handleGoback}>
                        <Image source={require('../images/button/exit-to-crop.png')} style={{height: 70, width: 70, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.btn} onPress={takePic}>
                        <Image source={require('../images/button/takePic.webp')} style={{height: 80, width: 80, borderRadius: '50%', resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                </View>
                <StatusBar style='auto'/>
            </Camera>
        </>
        

    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        bottom: 75,
        borderRadius: '50%'
    },
    exit: {
        width: 60,
        height: 60,
        position: 'absolute',
        top: 70,
        right: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    preview: {
        alignSelf: 'stretch',
        flex: 1
    }
})

export default AICamera;