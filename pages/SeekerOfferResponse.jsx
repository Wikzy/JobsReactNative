import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Image, TextInput, Text, Pressable, FlatList, SafeAreaView, ScrollView, View } from "react-native";
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { FetchOffers } from '../API/actions/offersActions';

const SeekerOfferResponse = ({ route, navigation }) => {

    const { ID } = route.params

    useEffect(() => {
        console.log(ID)
    }, [ID])


    const dispatch = useDispatch();

    const offers = useSelector(state => state.offers.offers)


    useEffect(() => {
        if (ID) {
            dispatch(FetchOffers(ID))
        }
    }, [dispatch, ID]);

    useEffect(() => {

        console.log(offers)

    }, [offers]);

    return (
        <ScrollView style={{ backgroundColor: '#F1F1F1' }}>
            <View style={{ backgroundColor: '#EAEAEA', }}>
                <View style={{ flexDirection: 'row', height: 90 }}>
                    <Pressable onPress={() => navigation.goBack()} style={{ padiingRight: 5 }}>
                        <Image style={{ width: 22, height: 20, marginTop: 70, marginLeft: 30, tintColor: '#000' }}
                            source={require('../assets/back_arrow.png')} alt={''} /></Pressable>
                    <View style={{ width: '100%', marginTop: 0, paddingEnd: 90 }}>
                        <Pressable onPress={() => navigation.push('OfferRejected')}><Image
                            style={{ width: 150, height: 40, marginTop: 60, alignSelf: 'center' }}
                            source={require('../assets/logo.png')} alt={'Okay'} /></Pressable>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={{ marginBottom: 8, borderColor: '#4C4C4C', borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingVertical: 15, display: "flex", flexDirection: "column", backgroundColor: '#fff', marginTop: 40 }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={{ paddingHorizontal: 10, paddingTop: 4, fontSize: 14, fontFamily: 'poppins_bold', borderRadius: 5, marginLeft: 25, }}>
                                {offers[0]?.company_name}
                            </Text>
                            <Text style={{ marginLeft: 'auto', textAlign: 'right', fontFamily: 'poppins_medium', fontSize: 13, marginRight: 25 }}>{moment(offers[0]?.date).add(0, 'days').calendar()}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={{ fontFamily: 'poppins_bold', marginTop: 15, fontSize: 20, textAlign: "center", }}>{offers[0]?.seeker_name}</Text>
                                <Text style={{ fontFamily: 'poppins_medium', marginTop: 0, fontSize: 14, textAlign: "center" }}>{offers[0]?.email}</Text>
                            </View>
                        </View>
                        <View >
                            <Text style={{ fontSize: 18, fontFamily: 'poppins_medium', marginLeft: 25, marginTop: 10 }}>Proposal: </Text>
                            <Text style={{ marginHorizontal: 20, fontSize: 14, fontFamily: 'poppins_medium', minHeight: 420, marginTop: 20 }}>{offers[0]?.offer}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: "center", gap: 20, marginTop: 10 }}>
                            <Text  onPress={() => navigation.push('AcceptResponse',{ID:offers[0]?.company})} style={{ fontSize: 16, fontFamily: 'poppins_semibold', backgroundColor: '#143D59', color: 'white', width: 150, textAlign: "center", paddingVertical: 5, borderRadius: 20, }}>Accept</Text>
                            <Text style={{ fontSize: 16, fontFamily: 'poppins_semibold', backgroundColor: '#13A3E1', color: 'white', width: 150, textAlign: "center", paddingVertical: 5, borderRadius: 20, }}>Negotiate</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default SeekerOfferResponse
