import { Image, TextInput, Text, Pressable, FlatList, SafeAreaView, ScrollView, Dimensions } from "react-native";
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import { AllCompanies } from "../API/actions/companyActions";
import { ActivityIndicator } from "react-native";
import Ripple from "react-native-material-ripple";
import NoData from "../Components/NoData";




function Companies({ navigation }) {

    const companies = useSelector(state => state.company.companies)
    const noData = useSelector(state => state.nodata.allCompanyNoData)
    const error = useSelector(state => state.error.allCompanyError)
    const success = useSelector(state => state.success.allCompanySuccess)
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (success || noData || error) {
            setIsLoading(false)
        }
    }, [success, error, noData])

    useEffect(() => {
        if (!companies) {
            dispatch(AllCompanies())
        } else {
            setIsLoading(false)
        }
    }, [dispatch, navigation, companies]);

    useEffect(() => {
        if (companies) {
            setData(companies)
        }
    }, [companies]);

    const search = (query) => {
        const searched = companies.filter((company) => {
            return (company.name).toLowerCase().includes(query.toLowerCase());
        })
        setData(searched)
    }

    const [noSearch, setNoSearch] = useState(false)

    useEffect(() => {
        if (data?.length === 0) {
            setNoSearch(true)
        } else {
            setNoSearch(false)
        }
    }, [data])





    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, backgroundColor: '#F1F1F1' }}>
                {isLoading ?
                    <View style={{ marginTop: 400 }}>
                        <ActivityIndicator size={60} color="#13A3E1" />
                    </View>
                    :
                    <>
                        {noData ?
                            <NoData text={"No Companies Found"} /> :
                            <>
                                {error ?
                                    <View style={{ marginTop: 360 }}>
                                        <Image source={require('../assets/delete.png')} style={{
                                            width: 30,
                                            height: 30,
                                            marginLeft: 190,
                                            marginBottom: -20,
                                            marginTop: 40
                                        }} />
                                        <Text
                                            style={{ textAlign: 'center', marginVertical: 20, fontFamily: 'poppins_medium' }}>Network
                                            Error...!</Text>
                                    </View>
                                    :
                                    <>
                                        <View >
                                            <View style={{ flexDirection: 'row', height: 90 }}>
                                                <Pressable onPress={() => navigation.goBack()}
                                                    style={{ padiingRight: 5 }}><Image style={{
                                                        width: 22,
                                                        height: 20,
                                                        marginTop: 70,
                                                        marginLeft: 30,
                                                        tintColor: '#000'
                                                    }} source={require('../assets/back_arrow.png')} alt={'Okay'} /></Pressable>
                                                <View style={{ width: '100%', marginTop: 0, paddingEnd: 90 }}>
                                                    <Pressable >
                                                        <Image
                                                            style={{ width: 150, height: 40, marginTop: 60, alignSelf: 'center' }}
                                                            source={require('../assets/logo.png')} alt={'Okay'} />
                                                    </Pressable>
                                                </View>
                                            </View>
                                            <View>
                                                <TextInput onChangeText={text => search(text)} style={{
                                                    backgroundColor: '#fff',
                                                    marginHorizontal: 30,
                                                    height: 50,
                                                    borderRadius: 25,
                                                    paddingHorizontal: 20,
                                                    marginTop: 30,
                                                    borderColor: 'black',
                                                    fontSize: 17,
                                                    elevation: 10
                                                }} placeholder={'Search'} />
                                                <Text style={{
                                                    fontSize: 18,
                                                    fontFamily: 'poppins_bold',
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    marginVertical: 20,
                                                    padding: 0
                                                }}>Browse by Companies</Text>
                                            </View>
                                            {noSearch ?
                                                <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16, marginTop: '20%' }}>No Search Found</Text>
                                                :
                                                <SafeAreaView>
                                                    <FlatList scrollEnabled={false} nestedScrollEnabled={true}
                                                        style={{ marginHorizontal: 0, marginTop: 10 }} data={data}
                                                        renderItem={({ item }) => (
                                                            <Ripple rippleColor="#13A3E1" rippleOpacity={0.2}
                                                                onPress={() => navigation.push('JobsByCompany', { COMID: item.id })}
                                                                style={{
                                                                    marginLeft: 25,
                                                                    marginRight: 25,
                                                                    borderWidth: 0.5,
                                                                    marginBottom: 7,
                                                                    borderColor: '#4C4C4C',
                                                                    borderRadius: 22,
                                                                    padding: 15,
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    backgroundColor: '#fff'
                                                                }}>
                                                                <Image style={{ width: 45, height: 45, marginLeft: 10 }}
                                                                    source={require('../assets/buildings.png')} />
                                                                <Text style={{
                                                                    marginTop: 8,
                                                                    fontSize: 16,
                                                                    fontFamily: 'poppins_semibold',
                                                                    marginLeft: 20
                                                                }}>{item.name}</Text>
                                                            </Ripple>
                                                        )} />
                                                </SafeAreaView>
                                            }
                                        </View>
                                    </>
                                }
                            </>}
                    </>}
            </ScrollView>
        </View>
    )
}

export default Companies
