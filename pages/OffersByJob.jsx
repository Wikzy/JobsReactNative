import { ActivityIndicator, FlatList, Image, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FetchSentOffers, FetchSentOffersByJob } from "../API/actions/offersActions";
import moment from "moment";
import Ripple from "react-native-material-ripple";
import NoData from "../Components/NoData";

function OffersByJob({ route, navigation }) {

    const { job } = route.params;

    const dispatch = useDispatch();
    const offers = useSelector(state => state.offers.jobOffers)
    const success = useSelector(state => state.success.sentOfferJobSuccess)
    const error = useSelector(state => state.error.sentOfferJobError)
    const nodata = useSelector(state => state.nodata.sentOfferJobNoData)

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (success || error || nodata) {
            setIsLoading(false)
        }
    }, [success, error, nodata])

    useEffect(() => {
        if (job) {
            dispatch(FetchSentOffersByJob(job))
        }
    }, [dispatch, job]);


    return (
        <View style={{ flex: 1 }}>
            {isLoading ? <View style={{ marginTop: 400 }}>
                <ActivityIndicator size={60} color="#13A3E1" />
            </View>
                : <>
                    {error ?
                        <View>
                            <Image source={require('../assets/delete.png')} style={{ width: 30, height: 30, marginLeft: 190, marginBottom: -20, marginTop: 40 }} />
                            <Text style={{ textAlign: 'center', marginVertical: 20, fontFamily: 'poppins_medium' }}>Network Error...!</Text>
                        </View> : <>
                        {nodata ?
                            <NoData text={"No Jobs Found"} /> :
            <>
                <ScrollView style={{ flex: 1, backgroundColor: '#F1F1F1', marginBottom: -75 }}>
                    <View style={{
                        flexDirection: 'column',
                        width: '100%',
                        height: 90,
                        marginBottom: 40
                    }}>
                        <View style={{ flexDirection: 'row', height: 130 }}>
                            <Pressable onPress={() => navigation.goBack()}
                                style={{ paddingRight: 5 }}><Image style={{
                                    width: 22,
                                    height: 20,
                                    marginTop: 70,
                                    marginLeft: 30,
                                    marginBottom: 20,
                                    tintColor: 'gray'
                                }} source={require('../assets/back_arrow.png')}
                                    alt={'Okay'} />
                            </Pressable>
                            <View style={{ width: '100%', marginTop: 0, paddingEnd: 90 }}>
                                <Image style={{
                                    width: 150,
                                    height: 40,
                                    marginTop: 60,
                                    alignSelf: 'center'
                                }}
                                    source={require('../assets/logo.png')} alt={'Okay'} />
                            </View>
                        </View>
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 19, fontFamily: 'poppins_semibold', marginBottom: 10 }}>Offer Sent</Text>


                    <SafeAreaView>
                        <FlatList nestedScrollEnabled={false} scrollEnabled={false}
                            style={{ marginHorizontal: 0, marginTop: 10 }} data={offers} renderItem={({ item }) => (
                                <View style={{
                                    marginLeft: 25,
                                    marginRight: 25,
                                    marginBottom: 8,
                                    borderColor: '#4C4C4C',
                                    borderRadius: 15,
                                    paddingHorizontal: 25,
                                    paddingVertical: 15,
                                    display: "flex",
                                    flexDirection: "column",
                                    backgroundColor: '#fff'
                                }}>
                                    <View style={{ flex: 1 }}>

                                        <Text style={{
                                            marginLeft: 'auto',
                                            textAlign: 'right',
                                            fontFamily: 'poppins_medium',
                                            fontSize: 13
                                        }}>{moment(item.date).format("MMM Do YY")}</Text>
                                    </View>
                                    <View>
                                        <View style={{}}>
                                            <Text style={{
                                                fontFamily: 'poppins_bold',
                                                marginTop: 5,
                                                fontSize: 15,
                                                textAlign: "center",
                                                color: '#0044a9',
                                            }}>{item.offerType}</Text>
                                            <Text style={{
                                                fontFamily: 'poppins_medium',
                                                marginTop: 6,
                                                fontSize: 16,
                                            }}>{item.seeker_name}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Text style={{
                                            fontFamily: 'poppins_bold',
                                            fontSize: 16,
                                            marginVertical: 5,
                                            textTransform: 'capitalize'
                                        }}>{item.role}</Text>
                                    </View>
                                    <View style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Text style={{
                                            fontFamily: 'poppins_medium',
                                            fontSize: 13,
                                            textAlign: 'center',
                                            marginTop: 4,
                                            backgroundColor: '#d9d9d9',
                                            paddingHorizontal: 10,
                                            paddingVertical: 6,
                                            borderRadius: 10,
                                        }}>
                                            Salary ${item.salary}
                                        </Text>
                                    </View>
                                    <Ripple
                                         onPress={() => navigation.push('OfferResponse', { ID: item.id })}
                                        rippleColor="white" style={{ marginTop: 4, marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Text style={{
                                            backgroundColor: '#13A3E1',
                                            textAlign: "center",
                                            borderRadius: 10,
                                            fontSize: 16,
                                            fontFamily: 'poppins_bold',
                                            color: 'white',
                                            marginVertical: 4,
                                            paddingVertical: 4,
                                            paddingHorizontal: 34
                                        }}>View Response</Text>
                                    </Ripple>
                                </View>
                            )} />
                    </SafeAreaView>


                    <View style={{ height: 90 }} />
                </ScrollView>
                   </> }
            </>}
            </>}

        </View>
    )
}

export default OffersByJob
