import {
    ActivityIndicator,
    BackHandler,
    FlatList,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchSeeker, updateSeeker } from "../API/actions/seekerActions";
import { AllCities } from "../API/actions/cityActions";
import { AllCountries } from "../API/actions/countryActions";
import { RESET, RESET_SEEKER } from "../Utils/Constants";
import city from "../API/reducers/city";
import CitySelectModal from "../Components/CitySelectModal";
import CountrySelectModal from "../Components/CountrySelectModal";
import GenderModal from "../Components/GenderModal";
import DatePicker from "react-native-date-picker";
import Ripple from "react-native-material-ripple";
import PhoneInput from "react-native-phone-number-input";

function PersonalInfo({ navigation }) {

    const [stateCheck, setStateCheck] = useState(false)
    const seeker = useSelector(state => state.seeker.seeker)
    const cities = useSelector(state => state.city.cities)
    const countries = useSelector(state => state.country.countries)
    const success = useSelector(state => state.seeker.success)
    const [completed, setCompleted] = useState(false)
    const [verified, setVerified] = useState(false)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (seeker && cities && countries && success == 'false') {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [seeker, cities, countries, success])

    const dispatch = useDispatch();
    const [ID, setID] = useState()
    const [seekerData, setSeekerData] = useState({
        name: '',
        city: '',
        country: '',
        username: '',
        phone: '',
        address: '',
        dob: '',
        gender: '',
        id: ''
    })

    const [cityName, setNameCity] = useState('')
    const [countryName, setCountryName] = useState('')
    const [gen, setGen] = useState('')
    const [trigger, setTrigger] = useState(false)

    const [cityVisible, setCityVisible] = useState(false)
    const [countryVisible, setCountryVisible] = useState(false)

    const [changed, setChanged] = useState(false)

    const toggleVisibility = () => setCityVisible(!cityVisible)
    const toggleCountryVisibility = () => setCountryVisible(!countryVisible)

    useEffect(() => {
        GetData()
    }, []);
    const GetData = async () => {
        const value = await AsyncStorage.getItem('ID')
        setID(value);
    }

    useEffect(() => {
        if (ID) {
            if (!seeker) {
                dispatch(fetchSeeker(ID))
            } else if ((seeker.id).toString() !== ID) {
                dispatch(fetchSeeker(ID))
            }
        }
    }, [dispatch, seeker, ID, navigation, trigger]);

    useEffect(() => {
        if (seeker) {
            setSeekerData({
                ...seekerData,
                name: seeker?.name,
                city: seeker?.city,
                country: seeker?.country,
                username: seeker?.username,
                phone: seeker?.phone,
                address: seeker?.address,
                dob: seeker?.dob,
                gender: seeker?.gender,
                id: seeker?.id
            })
            setGen(seeker?.gender)
            setNameCity(seeker?.city_name)
            setCountryName(seeker?.country_name)
        }
        if (seeker?.address && seeker?.city && seeker?.country && seeker?.dob && seeker?.email && seeker?.gender && seeker?.id && seeker?.name && seeker?.password && seeker?.phone && seeker?.username) {
            setCompleted(true)
        } else {
            setCompleted(false)
        }
        if (seeker?.verified === "true") {
            setVerified(true)
        } else {
            setVerified(false)
        }
    }, [seeker])

    const updateGender = (gender) => {
        setSeekerData({ ...seekerData, gender: gender })
        setGen(gender)
    }

    useEffect(() => {
        console.log(seekerData)
    }, [seekerData]);

    const update = () => {
        console.log(seekerData)
        dispatch(updateSeeker(seekerData.name, seekerData.city, seekerData.country, seekerData.username, seekerData.phone, seekerData.address, seekerData.dob, seekerData.gender, seekerData.id))
        toggleLoadingVisibility()
        dispatch({ type: RESET })
        setTrigger(!trigger)
    }

    const [loadingVisible, setLoadingVisible] = useState(false)
    const toggleLoadingVisibility = () => setLoadingVisible(!loadingVisible);

    useEffect(() => {
        if (success) {
            setLoadingVisible(false)
        }
    }, [success]);

    useEffect(() => {
        if (!cities) {
            dispatch(AllCities())
        }
    }, [dispatch, cities]);

    useEffect(() => {
        if (!countries) {
            dispatch(AllCountries())
        }
    }, [dispatch, countries]);

    const cityClick = (item) => {
        setSeekerData({ ...seekerData, city: item.id })
        toggleVisibility()
        setNameCity(item.name)
    }

    const countryClick = (item) => {
        setSeekerData({ ...seekerData, country: item.id })
        toggleCountryVisibility()
        setCountryName(item.name)
    }

    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    // gendermodal==============

    const [gender, setGender] = useState(false)
    const toggleGenderVisibility = () => setGender(!gender)

    return (
        <View style={{ flex: 1 }}>
            <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
            <CitySelectModal visible={cityVisible} toggleVisibility={toggleVisibility} list={cities} click={cityClick} />
            <CountrySelectModal visible={countryVisible} toggleVisibility={toggleCountryVisibility} list={countries}
                click={countryClick} />
            <GenderModal visible={gender} toggleVisibility={toggleGenderVisibility} set={updateGender} />
            <Modal visible={loadingVisible} animationType={"fade"} transparent={true}>
                <View style={{
                    flex: 1,
                    alignContent: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(66, 66, 66, 0.4)'
                }}>
                    <View style={{
                        margin: 35,
                        elevation: 24,
                        borderRadius: 25,
                        backgroundColor: '#fff',
                        opacity: 1,
                        padding: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 100
                    }}>
                        <Text style={{ paddingBottom: 16, fontSize: 14, fontFamily: 'poppins_medium' }}>Please Wait
                            ...</Text>
                        <ActivityIndicator size={60} color="#13A3E1" />
                    </View>
                </View>
            </Modal>

            <ScrollView style={{ flex: 1, backgroundColor: 'white', }}>
                <View style={{ flexDirection: 'column', width: '100%', height: 240, backgroundColor: '#13A3E1' }}>
                    <View style={{ flexDirection: 'row', height: 130 }}>
                        <Pressable onPress={() => navigation.goBack()} style={{ padiingRight: 5 }}><Image style={{
                            width: 22,
                            height: 20,
                            marginTop: 70,
                            marginLeft: 30,
                            marginBottom: 250,
                            tintColor: '#fff'
                        }} source={require('../assets/back_arrow.png')} alt={'Okay'} /></Pressable>
                        <View style={{ width: '100%', marginTop: 0, paddingEnd: 90 }}>
                            <Image style={{ width: 150, height: 40, marginTop: 60, alignSelf: 'center' }}
                                source={require('../assets/logo.png')} alt={'Okay'} />
                        </View>
                    </View>
                    <Text style={{
                        color: '#fff',
                        fontSize: 20,
                        fontFamily: 'poppins_bold',
                        width: '100%',
                        textAlign: 'center',
                        marginTop: 10
                    }}>Personal Info</Text>
                    {!completed ?
                        <Text style={{
                            color: '#fff',
                            fontSize: 12,
                            fontFamily: 'poppins_semibold',
                            width: '60%',
                            alignSelf: 'center',
                            textAlign: 'center',
                            marginTop: 5,
                            backgroundColor: '#ff0000',
                            borderRadius: 10,
                            paddingTop: 1
                        }}>Complete Your Profile</Text>
                        : ''}
                </View>
                {loading ?
                    <View style={{ marginTop: 200 }}>
                        <ActivityIndicator size={60} color="#13A3E1" />
                    </View>
                    :
                    <>
                        <View style={{
                            flexDirection: 'column',
                            borderColor: '#b2b2b2',
                            backgroundColor: '#fff',
                            marginHorizontal: 10,
                            marginRight: 30,
                            marginLeft: 30,
                            borderRadius: 30,
                            marginTop: 20
                        }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{
                                    flex: 0.7,
                                    backgroundColor: '#E6E6E6',
                                    borderTopLeftRadius: 30,
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 14,
                                        fontFamily: 'poppins_light',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}>Name</Text>
                                </View>
                                <View style={{
                                    flex: 1.3,
                                    borderTopRightRadius: 30,
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <TextInput onChangeText={(text) => setSeekerData({ ...seekerData, name: text })}
                                        placeholder={'Missing!!!'} style={{
                                            color: '#000',
                                            fontSize: 14,
                                            fontFamily: 'poppins_medium',
                                            width: '100%',
                                            textAlign: 'left'
                                        }}>{seeker?.name}</TextInput>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginTop: -1 }}>
                                <View style={{
                                    flex: 0.7,
                                    backgroundColor: '#E6E6E6',
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 14,
                                        fontFamily: 'poppins_light',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}>Birthday</Text>
                                </View>
                                <View style={{
                                    flex: 1.3,
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <TextInput editable={false}
                                        onChangeText={(text) => setSeekerData({ ...seekerData, dob: text })}
                                        placeholder={'Missing!!!'} style={{
                                            color: '#000',
                                            fontSize: 14,
                                            fontFamily: 'poppins_medium',
                                            width: '100%',
                                            textAlign: 'left'
                                        }}>{seeker?.dob}</TextInput>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, marginTop: -1 }}>
                                <View style={{
                                    flex: 0.7,
                                    backgroundColor: '#E6E6E6',
                                    borderBottomLeftRadius: 30,
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 14,
                                        fontFamily: 'poppins_light',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}>Gender</Text>
                                </View>
                                <Pressable onPress={() => toggleGenderVisibility()}
                                    style={{
                                        flex: 1.3,
                                        borderBottomRightRadius: 30,
                                        borderColor: '#b2b2b2',
                                        borderWidth: 1,
                                        paddingHorizontal: 20,
                                        paddingVertical: 5
                                    }}>
                                    <View>
                                        <TextInput
                                            editable={false}
                                            onTouchStart={() => toggleGenderVisibility()}
                                            placeholder={'Missing!!!'} style={{
                                                color: '#000',
                                                fontSize: 14,
                                                fontFamily: 'poppins_medium',
                                                width: '100%',
                                                textAlign: 'left'
                                            }}>{gen}</TextInput>
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            borderColor: '#b2b2b2',
                            backgroundColor: '#fff',
                            marginHorizontal: 10,
                            marginRight: 30,
                            marginLeft: 30,
                            borderRadius: 30,
                            marginTop: 20
                        }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{
                                    flex: 0.7,
                                    backgroundColor: '#E6E6E6',
                                    borderTopLeftRadius: 30,
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 14,
                                        fontFamily: 'poppins_light',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}>Email</Text>
                                </View>
                                <View style={{
                                    flex: 1.3,
                                    borderTopRightRadius: 30,
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <TextInput editable={false} placeholder={'Missing!!!'} style={{
                                        color: '#000',
                                        fontSize: 14,
                                        fontFamily: 'poppins_medium',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}>{seeker?.email}</TextInput>
                                </View>
                            </View>

                            {/* <View style={{ flexDirection: 'row', flex: 1, marginTop: -1 }}>
                                <View style={{
                                    flex: 0.7,
                                    backgroundColor: '#E6E6E6',
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 14,
                                        fontFamily: 'poppins_light',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}>Phone</Text>
                                </View>
                                <View style={{
                                    flex: 1.3,
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            onChangeText={(text) => setSeekerData({ ...seekerData, phone: text })}
                                            placeholder={'Missing!!!'} style={{
                                                fontSize: 14,
                                                fontFamily: 'poppins_medium',
                                                textAlign: 'left',
                                                width: '90%'
                                            }}>{seeker?.phone}</TextInput>
                                        {verified ?
                                            <Image style={{ width: 14, height: 14, marginLeft: 'auto' }}
                                                source={require('../assets/verified.png')} />
                                            :
                                            <Image style={{ width: 14, height: 14, marginLeft: 'auto' }}
                                                source={require('../assets/unverified.png')} />
                                        }
                                    </View>
                                </View>
                            </View> */}

                            <View style={{ flexDirection: 'row', flex: 1, marginTop: -1 }}>
                                <View style={{
                                    flex: 0.7,
                                    backgroundColor: '#E6E6E6',
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 14,
                                        fontFamily: 'poppins_light',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}>Address</Text>
                                </View>
                                <View style={{
                                    flex: 1.3,
                                    borderColor: '#b2b2b2',
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 5
                                }}>
                                    <TextInput onChangeText={(text) => setSeekerData({ ...seekerData, address: text })}
                                        placeholder={'Missing!!!'} style={{
                                            color: '#000',
                                            fontSize: 14,
                                            fontFamily: 'poppins_medium',
                                            width: '100%',
                                            textAlign: 'left'
                                        }}>{seeker?.address}</TextInput>
                                </View>
                            </View>


                            <View style={{
                                flexDirection: 'column',
                                borderColor: '#b2b2b2',
                                backgroundColor: '#fff',
                                borderRadius: 30,
                            }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <View style={{
                                        flex: 0.7,
                                        backgroundColor: '#E6E6E6',

                                        borderColor: '#b2b2b2',
                                        borderWidth: 1,
                                        paddingHorizontal: 20,
                                        paddingVertical: 5
                                    }}>
                                        <Text style={{
                                            color: '#000',
                                            fontSize: 14,
                                            fontFamily: 'poppins_light',
                                            width: '100%',
                                            textAlign: 'left'
                                        }}>City</Text>
                                    </View>
                                    <View style={{
                                        flex: 1.3,

                                        borderColor: '#b2b2b2',
                                        borderWidth: 1,
                                        paddingHorizontal: 20,
                                        paddingVertical: 5
                                    }}>
                                        <Pressable onPress={() => toggleVisibility()}><TextInput editable={false}
                                            onFocus={() => toggleVisibility()}
                                            placeholder={'Missing!!!'}
                                            style={{
                                                color: '#000',
                                                fontSize: 14,
                                                fontFamily: 'poppins_medium',
                                                width: '100%',
                                                textAlign: 'left'
                                            }}>{cityName}</TextInput></Pressable>
                                    </View>
                                </View>



                                <View style={{ flexDirection: 'row', flex: 1, marginTop: -1 }}>
                                    <View style={{
                                        flex: 0.7,
                                        backgroundColor: '#E6E6E6',
                                        borderBottomLeftRadius: 30,
                                        borderColor: '#b2b2b2',
                                        borderWidth: 1,
                                        paddingHorizontal: 20,
                                        paddingVertical: 5
                                    }}>
                                        <Text style={{
                                            color: '#000',
                                            fontSize: 14,
                                            fontFamily: 'poppins_light',
                                            width: '100%',
                                            textAlign: 'left'
                                        }}>Country</Text>
                                    </View>
                                    <View style={{
                                        flex: 1.3,
                                        borderBottomRightRadius: 30,
                                        borderColor: '#b2b2b2',
                                        borderWidth: 1,
                                        paddingHorizontal: 20,
                                        paddingVertical: 5
                                    }}>
                                        <Pressable onPress={() => toggleCountryVisibility()}><TextInput editable={false}
                                            onFocus={() => toggleCountryVisibility()}
                                            placeholder={'Missing!!!'}
                                            style={{
                                                color: '#000',
                                                fontSize: 14,
                                                fontFamily: 'poppins_medium',
                                                width: '100%',
                                                textAlign: 'left'
                                            }}>{countryName}</TextInput></Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column', marginTop: 20, marginHorizontal: 30 }}>
                            <View style={{ height: 60, borderColor: '#b2b2b2', borderWidth: 1, borderRadius: 10, padding: 4, backgroundColor: 'white' }}>
                                <PhoneInput
                                    layout='first'
                                    defaultCode='PK'
                                    textContainerStyle={{ backgroundColor: 'white', paddingLeft: -5 }}
                                    textInputStyle={{ paddingLeft: 10 }}

                                />
                            </View>
                            <Image style={{ width: 14, height: 14, marginLeft: 'auto', position: 'absolute', top: 22, left: '92%' }}
                                source={require('../assets/verified.png')} />
                        </View>





                        <Pressable onPress={() => update()} style={{
                            backgroundColor: '#13A3E1',
                            borderRadius: 25,
                            alignItems: 'center',
                            padding: 15,
                            marginTop: 15,
                            marginHorizontal: 25
                        }}>
                            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}
                            >Update
                            </Text>
                        </Pressable>
                        {seeker?.type === "GOOGLE" ?
                            <Pressable onPress={() => null}
                                style={{
                                    borderColor: '#000',
                                    borderWidth: 1,
                                    borderRadius: 25,
                                    alignItems: 'center',
                                    padding: 15,
                                    marginTop: 15,
                                    marginHorizontal: 25
                                }}><Text style={{ color: '#000', fontWeight: '800', fontSize: 15 }}>Logged In using
                                    Google</Text></Pressable>
                            :
                            <Pressable onPress={() => navigation.push('ChangePassword', { verifyPhone: seeker?.phone })}
                                style={{
                                    borderColor: '#000',
                                    borderWidth: 1,
                                    borderRadius: 25,
                                    alignItems: 'center',
                                    padding: 15,
                                    marginTop: 15,
                                    marginHorizontal: 25
                                }}><Text style={{ color: '#000', fontWeight: '800', fontSize: 15 }}>Change
                                    Password</Text></Pressable>
                        }
                        {!verified ?
                            <Pressable onPress={() => navigation.push('Verify', { verifyPhone: seeker?.phone })}
                                style={{
                                    borderColor: '#000',
                                    backgroundColor: '#000',
                                    borderWidth: 1,
                                    borderRadius: 25,
                                    alignItems: 'center',
                                    padding: 15,
                                    marginTop: 15,
                                    marginHorizontal: 25,
                                    marginBottom: 20
                                }}><Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Verify
                                    Phone</Text></Pressable>
                            :
                            ''
                        }

                        <Ripple rippleColor="white"
                            onPress={() => navigation.push('Plans')}
                            style={{
                                backgroundColor: 'green',
                                borderRadius: 25,
                                alignItems: 'center',
                                padding: 15,
                                marginTop: 15,
                                marginHorizontal: 25,
                                marginBottom: 25
                            }}>
                            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}
                            >Update Your Account
                            </Text>
                        </Ripple>

                    </>}
            </ScrollView>
        </View>
    )
}

export default PersonalInfo
