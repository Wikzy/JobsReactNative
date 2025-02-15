import {  Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SeekerByEmail } from "../API/actions/seekerActions";
import Toast from "react-native-toast-message";

function ForgotPassword({ route, navigation }) {

    const dispatch = useDispatch()

    const seekerEmail = useSelector(state => state.seeker.seekerEmail)

    const [email, setEmail] = useState()
    const [code, setCode] = useState()
    const [phone, setPhone] = useState()

    const fetch = (email) => {
        dispatch(SeekerByEmail(email))
        if (!seekerEmail) {
            Toast.show({ type: 'error', position: 'top', text1: 'Email not exist' })
        }
    }

    useEffect(() => {
        console.log(seekerEmail)
        if (seekerEmail) {
            navigation.push('Verify', { code: seekerEmail?.code, verifyPhone: seekerEmail?.phone, forgot: true, type: "SEEKER", verify: false, ID: seekerEmail?.id })
        }
    }, [seekerEmail]);


    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Pressable onPress={() => navigation.goBack()}><Image style={{ width: 22, height: 20, marginTop: 70, marginLeft: 30, tintColor: 'gray', }} source={require('../assets/back_arrow.png')} alt={'Okay'} /></Pressable>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ height: 150, width: 150, marginTop: 70, borderRadius: 500, padding: 120 }} source={require('../assets/verify.png')} />
                <Text style={{ color: '#000', fontFamily: 'poppins_semibold', fontSize: 18, width: '85%', textAlign: 'center', marginTop: 20, alignSelf: 'center' }}>Forgot Password?</Text>
                <Text style={{ color: 'gray', marginHorizontal: 40, textAlign: 'center', marginTop: 20 }}>Add your Phone number we'll Send You a verification code</Text>
                <Text style={{ color: 'gray' }}>so we know you are real</Text>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    keyboardType='email-address'
                    autoCapitalize="none"
                    style={{
                        height: 50,
                        backgroundColor: '#fff',
                        width: '85%',
                        borderRadius: 25,
                        marginTop: 25,
                        paddingHorizontal: 20,
                        color: '#626262',
                        elevation: 10
                    }} placeholder={'Enter your Email'} />

                <Pressable onPress={() => fetch(email)} style={{
                    width: '50%',
                    backgroundColor: '#13A3E1',
                    alignItems: 'center',
                    borderRadius: 15,
                    marginTop: 40,
                    paddingVertical: 7,
                }}><Text style={{ color: '#fff', fontFamily: 'poppins_semibold', fontSize: 15 }}>Send </Text></Pressable>
            </View>
            <Toast position='top' bottomOffset={20} />
        </ScrollView>
    );
}

export default ForgotPassword
