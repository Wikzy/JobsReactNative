import { Button, Image, ImageBackground, Text, View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { CheckSeeker } from "../API/actions/seekerActions";
import { CheckCV } from "../API/actions/cvActions";

function Splash({ navigation }) {

    const dispatch = useDispatch()

    const check = useSelector(state => state.seeker.check)
    const checkCV = useSelector(state => state.cv.check)

    const [user, setUser] = useState()
    const [ID, setID] = useState()

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


    useEffect(() => {
        GetData()
    }, []);

    const GetData = async () => {
        const id = await AsyncStorage.getItem('ID')
        const value = await AsyncStorage.getItem('USER')
        console.log(id)
        console.log(value)
        if (value === "PROVIDER" && id) {
            sleep(1000).then(async () => {
                navigation.replace('PostJob')
            })
        } else if (id && id !== "0") {
            setUser(value)
            setID(id)
        } else {
            sleep(1000).then(async () => {
                navigation.replace('Home')
                await AsyncStorage.setItem("ID", "0")
                await AsyncStorage.setItem("LOGIN", 'false')
            })
        }
    }

    useEffect(() => {
        if (ID) {
            if (user === "SEEKER") {
                dispatch(CheckCV(ID))
                dispatch(CheckSeeker(ID))
            }
        }
    }, [ID]);

    useEffect(() => {
        console.log(check)
        if (check) {
            console.log("CHECK")
            sleep(1000).then(async () => {
                if (user === "PROVIDER") {
                    navigation.replace('PostJob')
                } else if (user === "SEEKER") {
                    navigation.replace('Home')
                } else {
                    navigation.replace('Home')
                    await AsyncStorage.setItem("ID", "0")
                    await AsyncStorage.setItem("LOGIN", 'false')
                }
            })
        }
    }, [check]);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff',marginTop:'auto',marginBottom:'auto' }}>
            {/* <ImageBackground
                style={{ width: 270, height: 282, paddingLeft: 20, paddingRight: 40, justifyContent: 'center' }}
                source={require('../assets/circle_blue.png')}>
                <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: 'poppins_semibold', color: '#fff' }}>We will
                    connect with hiring agencies, job banks and recruiters to place your CV</Text>
            </ImageBackground> */}
            <Image style={{ width: 250, height: 150, marginTop: 'auto', alignSelf: 'center' }}
                source={require('../assets/splash_icon.png')} alt={'Okay'} />
            <Image style={{ width: 250, height: 50, marginTop: 10, alignSelf: 'center', padding: 10, zIndex: 1,marginBottom:'auto' }}
                source={require('../assets/logo.png')} alt={'Okay'} />
           
        </View>
    );
}

export default Splash
