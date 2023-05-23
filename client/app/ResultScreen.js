import React, { useState, useEffect, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { Text, View, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { CheckBox } from "@rneui/themed";
import axios from "axios";
const {width, height} = Dimensions.get('window')
const COLORS = {primary: '#FFE7C9' , white: '#FFF'};

const slides = [
    {
        id: '1',
        content: 'result'
    },
    {
        id: '2',
        content: 'How to recycle'
    }
]

const ResultScreen = () => {
    const [item, setItem] = useState(null)
    const [isRecyclable, setIsRecyclable] = useState(null)
    const [title, setTitle] = useState('');
    const [image, setImage] = useState();
    const [AIimage, setAIimage] = useState();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [instructionTitle, setInstructionTitle] = useState('')
    const [instruction, setInstruction] = useState('')
    const [recycle, setRecycle] = useState(null)


    const route = useRoute();
    const barcode = route.params.barcode;
    const resultAi = route.params.result;
    const photo = route.params.photo;
    // 9312828005954
    const getBarcode = async () => {
        try {
            const response = await axios.get('https://wastemanagement-mobile.herokuapp.com/barcode', {
                params: {barcode}
            })
            setItem(response.data)
            console.log(response.data)
            setTitle(response.data.title)
            setImage(response.data.image)
            setIsRecyclable(response.data.isRecyclable)
        } catch (error) {
            console.log(error)
        }
    }

    const displayAi = () => {
        setAIimage(photo)
        if (resultAi === 'Recycle') {
            setIsRecyclable(true)
        } else {
            setIsRecyclable(false)
        }
    }

    useEffect(() => {
        if (barcode) {
            getBarcode()
        }
        else {
            console.log(resultAi)
            displayAi()
        }
    }, []);

    const updateCurrentSlideIndex = e => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlide(currentIndex)
    }

    const handleSubmit = () => {

    }

    const handleSubmitTrue =  () => {
        setRecycle(true)
        setIsRecyclable(true)
    }

    const handleSubmitFalse = () => {
        setRecycle(false)
        setIsRecyclable(false)
    }

    const handleInsert = async () => {
        try {
            const response = await axios.post('https://wastemanagement-mobile.herokuapp.com/additem', {title, barcode, image, recycle})
            console.log(response.status)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        handleInsert()
    }, [recycle])

    const handlePress1 = () => {
        setInstructionTitle('RECYCLABLE')
        setInstruction('This can be placed in your kerbside recycling.')
    }

    const handlePress2 = () => {
        setInstructionTitle('CONDITIONALLY RECYCLABLE')
        setInstruction('Can be recycled ONLY if the instructions below symbol are followed. Otherwise, these items are not recyclable.')
    }

    const handlePress3 = () => {
        setInstructionTitle('NOT RECYCLABLE')
        setInstruction('This cannot be placed in kerbside recycling. Please dispose in your rubbish bin.')
    }

    const Form = () => {
        return (
            <View style={styles.radioContainer}>
                <TouchableOpacity onPress={handleSubmitTrue} style={[styles.recycleBtn, {backgroundColor: '#2b871a'}]}><Text style={{fontSize: 18, fontFamily: 'JetBrains', color: '#ffffff'}}>RECYCLE!</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleSubmitFalse} style={[styles.recycleBtn, {backgroundColor: '#ed1515'}]}><Text style={{fontSize: 18, fontFamily: 'JetBrains', color: '#ffffff'}}>NOT RECYCLE</Text></TouchableOpacity>
            </View>
        )
    }

    const Footer = () => {
        return (
            <View style={{height: 5, marginBottom: 10, width: '100%'}}>
                {/* Render Indicator */}
                <View style={{flexDirection: 'row', justifyContent: 'center', height: 10}}>
                    {slides.map((_, index) => (
                        <View 
                            key={index}
                            style={[
                                styles.indicator,
                                currentSlide == index && {
                                    backgroundColor: '#005FD1',
                                    width: '40%',
                                    height: 10,
                                    borderRadius: 80,
                                },
                            ]}
                        />
                    ))}
                </View>
            </View>
        )
    }

    

    return (
        // style={styles.result}
        <SafeAreaView style={styles.result} >
                <ScrollView 
                    horizontal={true} 
                    contentContainerStyle={{height: height* 0.75, width: width * 2}}
                    onMomentumScrollEnd={updateCurrentSlideIndex}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    >
                    {
                    AIimage ? (
                        <View style={[styles.container, styles.shadowProp]}>
                            <View style={styles.viewContainer}><Image source={{uri: AIimage}} style={{
                                width: 300,
                                height: 500,
                                borderRadius: '20px'
                            }}/></View>
                        </View>
                    ) : (
                        <View style={[styles.container, styles.shadowProp]}>
                            <View style={styles.viewContainer}><Text style={styles.title}>{title}</Text></View>
                            <View style={styles.viewContainer}><Text style={styles.barcode}>{barcode}</Text></View>
                            <View style={styles.viewContainer}><Image source={{uri: image}} style={styles.image}/></View>
                        </View>
                    )
                        
                    }
                    
                    <View style={styles.container}>
                        {
                        isRecyclable === true ? (
                            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../images/bin/yellow-bin.png')} style={{width: 250, height: 350}}/>
                                <Text style={{textAlign: 'center', fontSize: 24, fontFamily: 'JetBrains'}}>Place the item in <Text style={{color: '#ffd10a', fontFamily: 'JetBrainsBold', fontSize: 28}}>yellow bin</Text></Text>
                            </View>
                        ) 
                        : isRecyclable === null ? (
                            <View style={styles.mainContainer}>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoHeader}>How To Recycle?</Text>
                                    <Text style={styles.information}>Check for these labels on your item</Text>
                                    <View style={styles.imageContainer}>
                                        <TouchableOpacity onPress={handlePress1}>
                                            <Image style={styles.infoInstruction} source={require('../images/bin/arl1.png')} />
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity onPress={handlePress2}>
                                            <Image style={styles.infoInstruction} source={require('../images/bin/arl2.png')}/>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity onPress={handlePress3}>
                                            <Image style={styles.infoInstruction} source={require('../images/bin/arl3.png')}/>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{alignSelf: 'center', fontFamily: 'JetBrains', color: '#837eb2', marginBottom: 20, fontSize: 12}}>Tap on icons for information!</Text>
                                    <View style={styles.instructionContainer}>
                                        <Text style={styles.instructionTitle}>{instructionTitle}</Text>
                                        <View style={{marginTop: 25}}><Text style={styles.instruction}>{instruction}</Text></View>
                                    </View>
                                </View>
                                <Form />
                                
                            </View>
                        ) 
                        : isRecyclable === false ? (
                                <View style={{flex:1, justifyContent: 'center', alignItems: 'center', width: '80%'}}>
                                <Image source={require('../images/bin/red-bin.png')} style={{width: 250, height: 350}}/>
                                <Text style={{textAlign: 'center', fontSize: 24, fontFamily: 'JetBrains'}}>Place the item in <Text style={{color: '#ff2745', fontFamily: 'JetBrainsBold', fontSize: 28}}>red bin</Text></Text>
                            </View>
                        )
                        : (
                            <View></View>
                        )
                    }
                    </View>
                </ScrollView>
                <Footer />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    result: {
        flex: 1,
        backgroundColor: '#ddf0f6',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        height: '105%',
        width: '45%',
        margin: '3%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewContainer: {
        margin: '10%'
    },
    barcode: {
        fontFamily: 'Figtree',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '400',
        color: '#9DA9B0'
    },
    title: {
        fontFamily: 'JetBrains',
        fontSize: 24,
        textAlign: 'center',
        color: '#003D60'
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: '20px'
    },
    indicator: {
        height: 10,
        width: '40%',
        backgroundColor: '#9EC7FA',
        marginHorizontal: 3,
        alignItems: 'center',
        borderRadius: 80
    },
    radioContainer: {
        width: '90%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'    
    },
    recycleBtn: {
        marginBottom: 30,
        width: '45%',
        height: '25%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
        
    },
    infoContainer: {
        width: '85%',
        height: '65%'
    },
    infoHeader: {
        marginTop: 10,
        fontFamily: 'JetBrains',
        fontSize: 26,
        textAlign: 'center'
    },
    information: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 13,
        fontFamily: 'JetBrains',
        color: '#2b871a'
    },
    infoInstruction: {
        width: 100,
        height: 150,
        marginTop: 10
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    instructionContainer: {
        marginBottom: -120,
        width: '100%',
        height: '60%',
        backgroundColor: '#0010de',
        borderRadius: 20,
    },
    instructionTitle: {
        margin: 20,
        textAlign: 'center',
        fontFamily: 'Figtree',
        fontSize: 20,
        color: '#ffffff'
    },
    instruction: {
        textAlign: 'center',
        fontFamily: 'JetBrains',
        fontSize: 14,
        color: '#ffffff',
        width: '80%',
        alignSelf: 'center'
    }
});

export default ResultScreen;