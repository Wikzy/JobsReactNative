import { Image, Text, Pressable, FlatList, SafeAreaView, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import {  CompanyJobs } from "../API/actions/jobActions";
import moment from "moment";
import { recordInteraction } from "../API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ripple from "react-native-material-ripple";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import NoData from "../Components/NoData";

function JobsByCompany({ route, navigation }) {

    const { COMID } = route.params

    const jobs = useSelector(state => state.job.companyJobs)
    const error = useSelector(state => state.error.companyJobError)

    const success = useSelector(state => state.success.companyJobSuccess)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false);
    const [data, setData] = useState()

    const [ID, setID] = useState()

  

    useEffect(() => {
		if (jobs) {
			setData(jobs)
		}
	}, [jobs]);

    useEffect(() => {
        if (!data) {
            dispatch(CompanyJobs(ID, COMID))
            setData(jobs)
        }
    }, [dispatch])

 
    useEffect(() => {
        if (data) {
            setLoading(false)
        }
    }, [data])

    useEffect(() => {
        if (data?.length === 0) {
            setNoData(true)
        } else {
            setNoData(false)

        }
    }, [data])


    const JobClick = (id) => {
        recordInteraction(id, ID, '', '', 'JOB').then(res => console.log(res))
        navigation.push('JobDetails', { ID: id })
    }

    useEffect(() => {
        GetData()
    }, []);
    const GetData = async () => {
        const id = await AsyncStorage.getItem('ID')
        setID(id);
    }

  
    const height = Dimensions.get("window").height;

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, backgroundColor: '#F1F1F1' }}>
                <View style={{ backgroundColor: '#F1F1F1' }}>
                    <View style={{ flexDirection: 'row', height: 90 }}>
                        <Pressable onPress={() => navigation.goBack()} style={{ padiingRight: 5 }}><Image style={{
                            width: 22,
                            height: 20,
                            marginTop: 70,
                            marginLeft: 30,
                            tintColor: '#000'
                        }} source={require('../assets/back_arrow.png')} alt={'Okay'} /></Pressable>
                        <View style={{ width: '100%', marginTop: 0, paddingEnd: 90 }}>
                            <Pressable
                            // onPress={() => navigation.push('Recommendedjobs')}
                            ><Image
                                    style={{ width: 150, height: 40, marginTop: 60, alignSelf: 'center' }}
                                    source={require('../assets/logo.png')} alt={'Okay'} /></Pressable>
                        </View>
                    </View>
                    <View>
                        <Text style={{
                            fontSize: 18,
                            fontFamily: 'poppins_bold',
                            width: '100%',
                            paddingHorizontal: 30,
                            textAlign: 'left',
                            marginVertical: 20,
                            padding: 0
                        }}>Jobs</Text>
                    </View>
                    {loading ?
                        <View style={{ marginTop: 200 }}>
                            <ActivityIndicator size={60} color="#13A3E1" />
                        </View>
                        : <>
                            {noData ?
                               <NoData text={"No Jobs Found"} />
                                :

                                <SafeAreaView>
                                    <FlatList nestedScrollEnabled={false} scrollEnabled={false}
                                        style={{ marginHorizontal: 0, marginTop: 10 }} data={data} renderItem={({ item }) => (
                                            <Ripple rippleColor="#13A3E1" rippleOpacity={0.2} onPress={() => JobClick(item.id)}><View style={{
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
                                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                                    <Text style={{
                                                        color: '#207A00',
                                                        backgroundColor: 'rgba(0,180,18,0.2)',
                                                        paddingHorizontal: 10,
                                                        paddingTop: 4,
                                                        fontSize: 10,
                                                        fontFamily: 'poppins_medium',
                                                        borderRadius: 5
                                                    }}>NEW</Text>
                                                    <Text style={{
                                                        marginLeft: 'auto',
                                                        textAlign: 'right',
                                                        fontFamily: 'poppins_medium',
                                                        fontSize: 13
                                                    }}>{moment(item.created).format("MMM Do YY")}</Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <View style={{ flex: 0.8 }}>
                                                        <Text numberOfLines={1} style={{
                                                            fontFamily: 'poppins_bold',
                                                            marginTop: 5,
                                                            fontSize: 15
                                                        }}>{item.title}</Text>
                                                        <Text style={{
                                                            fontFamily: 'poppins_regular',
                                                            marginTop: 0,
                                                            fontSize: 12
                                                        }}>{item.company_name}</Text>
                                                    </View>
                                                   
                                                </View>
                                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                                    <Text style={{
                                                        fontFamily: 'poppins_bold',

                                                        fontSize: 16,
                                                    }}>{item.category_name}</Text>
                                                    <Text style={{
                                                        marginLeft: 'auto',
                                                        textAlign: 'right',
                                                        fontFamily: 'poppins_medium',
                                                        fontSize: 13
                                                    }}>{item.qualification}</Text>
                                                </View>
                                                <View style={{
                                                    marginTop: 4,
                                                    backgroundColor: '#d9d9d9',
                                                    paddingHorizontal: 20,
                                                    paddingVertical: 2,
                                                    borderRadius: 10,
                                                    marginLeft: 'auto',
                                                    marginRight: 'auto'
                                                }}>
                                                    <Text style={{ fontFamily: 'poppins_medium', fontSize: 13, textAlign: 'center', }}>
                                                        Salary {item.salary}
                                                    </Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', flex: 1, marginTop: 7, }}>
                                                    <View style={{
                                                        backgroundColor: '#13a3e1',
                                                        paddingHorizontal: 10,
                                                        paddingTop: 5,
                                                        borderRadius: 14
                                                    }}>
                                                        <Text style={{ color: 'white', fontSize: 15, fontFamily: 'poppins_medium', }}>{item.type}</Text>
                                                    </View>
                                                    <Text style={{
                                                        marginLeft: 'auto',
                                                        textAlign: 'right',
                                                        fontFamily: 'poppins_medium',
                                                        fontSize: 13,
                                                        paddingTop: 6,
                                                    }}>{item.city_name}</Text>
                                                </View>


                                            </View></Ripple>
                                        )} />
                                </SafeAreaView>
                            }
                        </>}
                </View>
            </ScrollView>
             
            <BannerAd
                unitId="ca-app-pub-3940256099942544/6300978111"
                size={BannerAdSize.FULL_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                />
                 
        </View>
    )
}

export default JobsByCompany
