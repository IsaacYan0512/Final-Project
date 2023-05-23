import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, SafeAreaView, TextInput, KeyboardAvoidingView, ScrollView, Keyboard, TouchableWithoutFeedback, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
const COLORS = {primary: '#FFE7C9' , white: '#FFF'};

const CameraScreen = ({navigation}) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState('');
    


    const navigator = useNavigation();
    const getResult = () => {
        if (barcode === '') {
            return null
        } else {
            navigator.navigate('Result', {
                barcode: barcode
            });
        } 
    }

    const handleAI = () => {
        navigator.navigate('AICamera');
    }


    // Scanning part
    const askForCameraPermission = () => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })()
    }

    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);

    // What happens when we scan the bar code
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setBarcode(data)
        console.log('Type: ' + type + '\nData: ' + data)
    };

    // Check permissions and return the screens
    if (hasPermission === null) {
        return (
        <View style={styles.container}>
            <Text>Requesting for camera permission</Text>
        </View>)
    }
    if (hasPermission === false) {
        return (
        <View style={styles.container}>
            <Text style={{ margin: 10 }}>No access to camera</Text>
            <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
        </View>)
    }


    //  049000067316

    // Return the View
    return (
        <SafeAreaView style={styles.container}>
            
            <KeyboardAvoidingView style={styles.inputContainer} behavior={Platform.OS === 'ios' ? "padding" : "height"}>
                    <TextInput
                        placeholder="Enter barcode"
                        keyboardType="number"
                        style={styles.barcodeInput}
                        onChangeText={(newBarcode) => {
                            setBarcode(newBarcode);
                            console.log(barcode)}}/>
            </KeyboardAvoidingView>
            <View style={styles.camera}>
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ height: '100%', width: '100%' }} />
            </View>           
            {scanned && <TouchableOpacity style={{marginBottom: 20}} onPress={() => setScanned(false)} color='tomato'>
                <Text style={{fontFamily: 'JetBrains', fontSize: 18, color: '#ee4900'}}>Scan again?</Text>
            </TouchableOpacity>     }   
            {/* {scanned && <Button style={{}} title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />} */}
            
            <View style={{height: 50, width: '90%', flexDirection: 'row'}}>          
                <TouchableOpacity
                    style={[styles.btn, {
                        shadowColor: '#171717',
                        shadowOffset: {width: 0, height: 3},
                        shadowOpacity: 0.5,
                        shadowRadius: 0,
                    }]}
                    onPress={getResult}
                >
                        <Image source={require('../images/button/button.png')} style={{height: 30, width: 30, resizeMode: 'contain', margin: 10}}/>
                        <Text style={{fontFamily: 'JetBrains',}}>{barcode}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btnAI, {
                        shadowColor: '#171717',
                        shadowOffset: {width: 0, height: 3},
                        shadowOpacity: 0.5,
                        shadowRadius: 0,
                    }]}
                    onPress={handleAI}
                >
                        <Image source={require('../images/button/upload.png')} style={{height: 40, width: 40, resizeMode: 'contain', margin: 10}}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // '#ddf0f6', #dbfadc, 80dbff
    container: {
        flex: 1,
        backgroundColor: '#ddf0f6',
        height: '100%',
        alignItems: 'center'
    },
    camera: {
        position: 'absolute',
        top: '12%',
        alignItems: 'center',
        height: '70%',
        width: '90%',
        overflow: 'hidden',
        borderRadius: 10,
        backgroundColor: COLORS.primary
    },
    inputContainer: {
        flex: 1,
        alignItems: 'center',
        margin: '10%'
    },
    barcode: {
        fontSize: 32,
        fontFamily: 'Figtree',
        fontWeight: 'bold',
        color: '#654321',
        marginBottom: '3%'
    },
    barcodeInput: {
        backgroundColor: 'white',
        height: 30,
        width: 250,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#062639',
        textAlign: 'center'
    },
    maintext: {
        textAlign: 'center',
        showsVerticalScrollIndicator: true,
        fontSize: 24,
        margin: 10,
        width: 250,
        height: 30,
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: 'white',
        borderRadius: '25%',
        border: '1px solid red'
    },
    btn: {
        width: '65%',
        flexDirection: 'row',
        marginRight: 15,
        height: 50,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: '#2FF924',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#FFF',
        borderRadius: 100,
    },
    btnAI: {
        width: '30%',
        flexDirection: 'row',
        height: 50,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,        
        backgroundColor: '#7de21d',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    }
    });

export default CameraScreen