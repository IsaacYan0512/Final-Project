import React, {useState, useRef} from 'react';
import { SafeAreaView, StyleSheet, Dimensions, FlatList, Image, Text, View, TouchableOpacity } from 'react-native';

const {width, height} = Dimensions.get('window');

const COLORS = {primary: '#FFE7C9' , white: '#FFF'};

const slides = [
    {
        id: '1',
        image: require('../images/onboard/onboard1.png'),
        title: 'Zero waste',
        subtitle: 'Make the environment better'
    }, 
    {
        id: '2',
        image: require('../images/onboard/onboard2.png'),
        title: 'Reduce',
        subtitle: '1 Ton of recycled paper can save up to 15 trees'
    }, 
    {
        id: '3',
        image: require('../images/onboard/onboard3.png'),
        title: 'Waste Management App',
        subtitle: 'Scan barcodes or take photos to recycle'
    }
];


const Slide = ({item}) => {
    return (
        <View style={{flex: 1, flexDirection: 'column', alignItems:'center', padding:0, margin: 0}}>
            <Image 
                source={item.image}
                style={{height: '75%', width, resizeMode: 'contain'}}
            />
            <Text style={{
                fontSize: 30, 
                fontFamily: 'Figtree', 
                marginBottom: 10, 
                fontWeight: 'bold', 
                color: '#654321', 
                }}>{item.title}</Text>
            <Text style={{
                width: '60%', 
                overflow: 'hidden',
                textAlign: 'center', 
                fontSize: 18, 
                margin: 0, 
                padding: 0,
                fontFamily: 'Figtree', 
                fontWeight: 'bold',
                color: '#177245',
                }}>{item.subtitle}</Text>
        </View>
    );
};



const OnboardingScreen = ({navigation}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);
    
    const ref = useRef()

    const goTonextSlide = () => {
        const nextSlide = currentSlide + 1;
        if (nextSlide != slides.length) {
            const offset = nextSlide * width;
            ref?.current.scrollToOffset({offset});
            setCurrentSlide(currentSlide + 1);
        }
    }

    const updateCurrentSlideIndex = e => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlide(currentIndex)
    }

    const skip = () => {
        const lastSlide = slides.length - 1;
        const offset = lastSlide * width;
        ref?.current.scrollToOffset({offset});
        setCurrentSlide(lastSlide)
    }

    const Footer = () => {
        return (
            <View style={{height: height * 0.15, justifyContent: 'space-between', paddingHorizontal: 20,}}>
                {/* Render Indicator */}
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                    {slides.map((_, index) => (
                        <View 
                            key={index}
                            style={[
                                styles.indicator,
                                currentSlide == index && {
                                    backgroundColor: '#008013',
                                    width: 25,
                                    borderRadius: 80,
                                },
                            ]}
                        />
                    ))}
                </View>
                {/* Render buttons */}
                <View style={{marginBottom: 20}}>
                    {currentSlide == slides.length - 1 ? (
                        <View style={{height: 50}}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => navigation.navigate('homeScreen')}
                            >
                                <Text style={{fontWeight: 'bold', fontSize: 15}}>GET STARTED</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.btn,
                                    {
                                        borderColor: COLORS.white,
                                        borderWidth: 1,
                                        backgroundColor: '#008013',
                                        
                                    },
                                ]}
                                onPress={skip}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 15,
                                        color: COLORS.white
                                    }}>
                                    SKIP
                                </Text>
                            </TouchableOpacity>
                            <View style={{width: 15}}/>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={goTonextSlide}
                                style={styles.btn}>
                                <Text 
                                    style={{
                                        fontWeight: 'bold', 
                                        fontSize: 15, 
                                        color: 'black',}}>NEXT</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        )
    }
    return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.primary}}>
        <FlatList 
            ref={ref}
            contentContainerStyle={{height: height * 0.75}}
            onMomentumScrollEnd={updateCurrentSlideIndex}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
            pagingEnabled
            data={slides}
            renderItem={({item}) => <Slide item={item} />}
        />
        <Footer />
    </SafeAreaView>);
}



const styles = StyleSheet.create({
    indicator: {
        height: 5,
        width: 10,
        backgroundColor: '#00A619',
        marginHorizontal: 3,
        alignItems: 'center',
        borderRadius: 80
    },
    btn: {
        flex: 1,
        height: 50,
        borderRadius: 5,
        backgroundColor: '#2FF924',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#FFF',
        borderRadius: 100,
    }
});
export default OnboardingScreen;