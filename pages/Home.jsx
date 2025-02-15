import { ActivityIndicator, Dimensions, FlatList, Image, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FeaturedCategories } from "../API/actions/categoryActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RecentJobs } from "../API/actions/jobActions";
import NavigationDrawer from "../Components/NavigationDrawer";
import LogoutConfirmationModal from "../Components/LogoutConfirmationModal";
import Ripple from "react-native-material-ripple";
import LoginRequireModal from "../Components/LoginRequireModal";
import CompleteProfileSeekerModal from "../Components/CompleteProfileSeekerModal";
import { fetchSeeker } from "../API/actions/seekerActions";
import { getApiJobsRecent } from "../API/actions/jobsApi";
import ProfileVerficationModal from "../Components/ProfileVerification";


function Home({ route, navigation }) {

	const dispatch = useDispatch();
	const [login, isLogin] = useState(true);
	const [search, setSearch] = useState('');
	const seeker = useSelector(state => state.seeker.seeker)
	const categories = useSelector(state => state.category.featured_categories)
	const recentJobs = useSelector(state => state.job.recentJobs)

	// console.log("seeker", seeker)


	useEffect(() => {
		dispatch(RecentJobs())
	}, [dispatch])


	const error = useSelector(state => state.error.featuredCategoryError)
	const success = useSelector(state => state.success.featuredCategorySuccess)
	const nodata = useSelector(state => state.nodata.featuredCategoryNoData)
	const check = useSelector(state => state.seeker.check)

	const [ID, setID] = useState()

	const [loginval, setLoginVal] = useState(false)

	const [visible, setVisible] = useState(false)
	const toggleVisibility = () => setVisible(!visible)

	useEffect(() => {
		if (!categories) {
			dispatch(FeaturedCategories())
		} else {
			setIsLoading(false)
		}
	}, [dispatch, categories]);

	const [isloading, setIsLoading] = useState(true)

	useEffect(() => {
		if (error || success || nodata) {
			setIsLoading(false)
			// dispatch({ type: RESET })
		}
	}, [error, success, nodata])

	useEffect(() => {
		if (ID) {
			if (!seeker) {
				dispatch(fetchSeeker(ID))
			} else if ((seeker.id).toString() !== ID) {
				dispatch(fetchSeeker(ID))
			}
		}
	}, [dispatch, seeker, ID]);

	useEffect(() => {
		if (!recentJobs) {
			dispatch(getApiJobsRecent(search))
		}
	}, [dispatch, recentJobs, search]);


	useEffect(() => {
		GetData()
	}, []);

	const GetData = async () => {
		const value = await AsyncStorage.getItem('LOGIN')
		console.log('value', value)
		const userID = await AsyncStorage.getItem("ID")
		console.log('id', userID)
		setLoginVal(value);
		setID(userID)
	}

	useEffect(() => {
		if (loginval === 'true') {
			isLogin(true)
		} else {
			isLogin(false)
		}
	}, [loginval])

	// console.log("loginval" , loginval)


	const Logout = async () => {
		await AsyncStorage.setItem("LOGIN", 'false')
		await AsyncStorage.setItem("ID", '')
		await AsyncStorage.setItem("USER", '')
		await AsyncStorage.setItem("NAME", '')
		await AsyncStorage.setItem("EMAIL", '')
		await AsyncStorage.setItem("USERNAME", '')
		setLoginVal(false)
		toggleLoadingVisibility()
	}
	// log out===================
	const [handleSignOut, setHandleSignOut] = useState(false)
	const toggleLoadingVisibility = () => setHandleSignOut(!handleSignOut);

	const [requireVisible, setRequireVisible] = useState(false)
	const toggleRequireVisible = () => setRequireVisible(!requireVisible)


	const [completeVisible, setCompleteVisible] = useState(false)
	const toggleCompleteVisible = () => setCompleteVisible(!completeVisible)

	useEffect(() => {
		if (login) {
			console.log("login is true")
			console.log("chuna lagna laga ha  ")
			if (check === "complete") {
				setCompleteVisible(false)
				console.log("chuna ni laga ")
			} else if (check === undefined) {
				setCompleteVisible(false)
				console.log("chuna ni laga ")
			} else {
				setCompleteVisible(true)
				console.log("chuna lag gia ")
			}
		}
	}, [check, login]);

	console.log("check", check)
	// console.log("login", login)

	const [profileVerifiedVisibility, setProfileVerifiedVisibility] = useState(false)

	const toggleProfile = () => setProfileVerifiedVisibility(!profileVerifiedVisibility)


	const [isComplete, setIsComplete] = useState(false)
	const [plan, setPlan] = useState(false)
	const [cv, setCv] = useState(false)
	const [cover, setCover] = useState(false)

	const JobClick = (val) => {
		let num = Number(val.company)

		if (isNaN(num)) {
			navigation.push('ApiDescription', { ID: val.id })
		} else {
			navigation.push('JobDetails', { ID: val.id })
		}
	}


	const height = Dimensions.get("window").height;


	return (
		<View style={{ flex: 1 }} >
			{isloading ?
				<View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
					<ActivityIndicator size={60} color="#13A3E1" />
				</View>
				:
				<>
					<CompleteProfileSeekerModal visible={completeVisible} toggleCompleteVisible={toggleCompleteVisible} isComplete={isComplete} plan={plan} cv={cv} cover={cover} navigation={navigation} />
					<NavigationDrawer visible={visible} navigation={navigation} toggleVisibility={toggleVisibility} isLogin={login} toggleLoadingVisibility={toggleLoadingVisibility} />
					<LogoutConfirmationModal toggleLoadingVisibility={toggleLoadingVisibility} visible={handleSignOut} Logout={Logout} />
					<LoginRequireModal visible={requireVisible} toggleRequireVisible={toggleRequireVisible} navigation={navigation} />

					<ProfileVerficationModal visible={profileVerifiedVisibility} toggleCompleteVisible={toggleProfile} isComplete={isComplete} navigation={navigation} />

					<ScrollView style={{ flex: 1, backgroundColor: '#F1F1F1', marginBottom: -75 }} keyboardShouldPersistTaps="handled" onPress={() => setHandleSignOut(false)} >
						<View style={{ flexDirection: 'column', width: '100%', height: 240, backgroundColor: '#13A3E1' }}>
							<View style={{ flexDirection: 'row', height: 130 }}>
								<Pressable onPress={() => toggleVisibility()}><Image style={{
									width: 22,
									height: 20,
									marginTop: 70,
									marginLeft: 30,
									marginBottom: 250,
									tintColor: '#fff'
								}} source={require('../assets/menu.png')} alt={'Okay'} /></Pressable>
								<View style={{ width: '100%', marginTop: 0, paddingEnd: 90 }}>
									<Pressable
									><Image style={{ width: 150, height: 40, marginTop: 60, alignSelf: 'center' }}
										source={require('../assets/logo.png')} alt={'Okay'} /></Pressable>
								</View>
							</View>
							<View style={{
								flexDirection: 'row',
								alignItems: 'center',
								backgroundColor: '#fff',
								marginHorizontal: 30,
								height: 50,
								borderRadius: 25,
								paddingHorizontal: 20,
								marginTop: 10,

							}}>
								<TextInput onChangeText={text => setSearch(text)}
									onSubmitEditing={() => navigation.push('Search', { query: search })}
									keyboardType="email-address"
									style={{
										height: 50, width: '90%'
									}} placeholder={'Start your Job Search'} />
								<Pressable onPress={() => navigation.push('Search', { query: search })} style={{ marginLeft: 'auto', }}>
									<Image style={{ width: 25, height: 25 }} source={require('../assets/search-interface-symbol.png')} />
								</Pressable>
							</View>
						</View>

						{login ?
							<Ripple rippleColor="white" rippleOpacity={0.3} rippleDuration={600} rippleSize={400}
								onPress={() => navigation.push('Recommendedjobs')} aria-hidden={true} style={{
									backgroundColor: '#F0A51E',
									borderRadius: 25,
									height: 100,
									padding: 15,
									marginTop: 15,
									marginHorizontal: 25,
									alignItems: 'center',
									flexDirection: 'row'
								}}>
								<View style={{ flexDirection: 'column', paddingHorizontal: 8 }}>
									<Text style={{
										color: '#000',
										fontFamily: 'poppins_medium',
										fontSize: 18,

										textAlign: 'center'
									}}>Recommended jobs</Text>
									<Text style={{
										color: 'white',
										fontFamily: 'poppins_medium',
										fontSize: 12,
										width: 170,
										textAlign: 'center'
									}}>View Jobs Suits You</Text>

								</View>

								<Image style={{
									width: 70,
									height: 70,
									marginLeft: 'auto'
								}} source={require('../assets/recommended_jobs_icon.png')} alt={'Okay'} />
							</Ripple>

							: <Pressable onPress={() => navigation.push('UserType')} style={{
								backgroundColor: '#13A3E1',
								borderRadius: 25,
								alignItems: 'center',
								padding: 15,
								marginTop: 15,
								marginHorizontal: 25
							}}><Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Log In</Text></Pressable>
						}

						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								marginTop: 20,
								borderRadius: 25,
								alignItems: 'center',
								paddingHorizontal: 30
							}}>
							<Text ellipsizeMode={'tail'} numberOfLines={1}
								style={{ width: '60%', fontFamily: 'poppins_bold', fontSize: 15 }}>Categories</Text>
							<Ripple rippleColor="black" rippleOpacity={0.3} rippleDuration={300} rippleSize={100}
								style={{ marginLeft: 'auto', backgroundColor: '#d7d7d7', paddingHorizontal: 10, paddingVertical: 1, borderRadius: 10 }}
								onPress={() => navigation.push('Categories')}>
								<Text numberOfLines={1} style={{ fontFamily: 'poppins_light', fontSize: 12, }}
								>Show All</Text></Ripple>
						</View>
						<SafeAreaView style={{ flex: 1 }}>
							{error ?
								<View>
									<Image source={require('../assets/delete.png')} style={{ width: 30, height: 30, marginLeft: 190, marginBottom: -20, marginTop: 40 }} />
									<Text style={{ textAlign: 'center', marginVertical: 20, fontFamily: 'poppins_medium' }}>Network Error...!</Text>
								</View> :
								<FlatList scrollEnabled={false} nestedScrollEnabled={true}
									style={{ marginHorizontal: 30, marginTop: 10 }} data={categories} renderItem={({ item }) => (

										<Ripple rippleColor="#13A3E1" rippleOpacity={0.2} rippleDuration={300} rippleSize={200}
											onPress={() => navigation.push('JobsByCategory', { CATID: item.id })}
											style={{
												flex: 1,
												flexDirection: 'column',
												margin: 7,
												backgroundColor: '#fff',
												height: 100,
												justifyContent: 'center',
												alignItems: 'center',
												borderRadius: 20,
												elevation: 5,
												paddingHorizontal: 10
											}}>
											<Image style={{
												width: 25,
												height: 25,
											}} source={{ uri: `${item.image}` }}
												alt={'Okay'} />
											<Text style={{ fontFamily: 'poppins_bold', fontSize: 12, marginTop: 10, textAlign: 'center' }}>{item.name}</Text>
										</Ripple>
									)}
									numColumns={2} />
							}
						</SafeAreaView>

						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								marginTop: 20,
								borderRadius: 25,
								alignItems: 'center',
								paddingHorizontal: 30
							}}>
							<Text ellipsizeMode={'tail'} numberOfLines={1}
								style={{ width: '60%', fontFamily: 'poppins_bold', fontSize: 15 }}>Recent Jobs</Text>
							<Ripple rippleColor="black" rippleOpacity={0.3} rippleDuration={300} rippleSize={100} style={{ marginLeft: 'auto', backgroundColor: '#d7d7d7', paddingHorizontal: 10, paddingVertical: 1, borderRadius: 10 }}
								onPress={() => navigation.push('Jobs')}>
								<Text numberOfLines={1} style={{ fontFamily: 'poppins_light', fontSize: 12, }}
								>Show All</Text></Ripple>
						</View>
						{error ?
							<View>
								<Image source={require('../assets/delete.png')} style={{ width: 30, height: 30, marginLeft: 190, marginBottom: -20, marginTop: 40 }} />
								<Text style={{ textAlign: 'center', marginVertical: 20, fontFamily: 'poppins_medium' }}>Network Error...!</Text>
							</View> : <>
								<SafeAreaView style={{ flex: 1 }}>

									<FlatList scrollEnabled={false} nestedScrollEnabled={true}
										style={{ marginHorizontal: 30, marginTop: 10 }} data={recentJobs} renderItem={({ item }) => (
											<Ripple rippleColor="#13A3E1" rippleOpacity={0.5} rippleDuration={300} rippleSize={200}
												onPress={() => JobClick(item)}
												style={{
													flex: 1,
													flexDirection: 'row',
													margin: 5,
													backgroundColor: '#fff',
													borderColor: '#c2c2c2',
													borderWidth: 1,
													height: 50,
													borderRadius: 25,
													elevation: 5,
													alignItems: 'center',
													paddingHorizontal: 20
												}}>
												<Text ellipsizeMode={'tail'} numberOfLines={1}
													style={{ width: '60%', fontFamily: 'poppins_bold', fontSize: 12 }}>{item.title}</Text>
												<Text numberOfLines={1} style={{
													fontFamily: 'poppins_light',
													fontSize: 9,
													marginLeft: 'auto',

												}}>{item.city_name}</Text>
											</Ripple>
										)}
									/>
								</SafeAreaView>
							</>}
						<View style={{
							flex: 1,
							flexDirection: 'row',
							marginVertical: 20,
							marginHorizontal: 35
						}}>
							<Ripple rippleColor="#13A3E1" rippleOpacity={0.3} rippleDuration={300} rippleSize={200}
								onPress={() => navigation.push('Cities')}
								style={{
									flex: 0.5,
									flexDirection: 'column',
									marginRight: 7,
									backgroundColor: 'white',
									borderColor: '#c2c2c2',
									elevation: 5,
									paddingVertical: 19,
									justifyContent: 'center',
									alignItems: 'center',
									borderRadius: 25
								}}>
								<Text style={{ fontFamily: 'poppins_bold', fontSize: 13, marginTop: 10, textAlign: 'center', color: '#13A3E1' }}>{"Browse By\nCities"}</Text>
							</Ripple>
							<Ripple rippleColor="#13A3E1" rippleOpacity={0.3} rippleDuration={300} rippleSize={200}
								onPress={() => navigation.push('Companies')}
								style={{
									flex: 0.5,
									flexDirection: 'column',
									backgroundColor: 'white',
									borderColor: '#c2c2c2',
									elevation: 5,
									paddingVertical: 19,
									justifyContent: 'center',
									alignItems: 'center',
									borderRadius: 25
								}}>
								<Text style={{ fontFamily: 'poppins_bold', fontSize: 13, marginTop: 10, textAlign: 'center', color: '#13A3E1' }}>{"Browse By\nCompanies"}</Text>
							</Ripple>
						</View>
						<View style={{ height: 90 }} />
					</ScrollView>


					<View style={{ backgroundColor: '#F1F1F1', paddingVertical: 10, paddingBottom: 16 }}>



						<View style={{
							flexDirection: 'row',
							backgroundColor: '#13A3E1',
							height: 60,
							borderRadius: 30,
							marginHorizontal: 20,
							paddingHorizontal: 20,
							width: '92%',
						}}>
							<Ripple rippleColor="white" rippleOpacity={0.3} rippleDuration={900} rippleSize={200}
								onPress={() => {
									if (login) {
										navigation.push('saved')
									} else {
										toggleRequireVisible()
									}
								}}
								style={{
									height: '100%',
									flex: 1,
									flexDirection: 'column',
									justifyContent: 'center',
									marginLeft: -6,
									alignItems: 'center',
									width: '20%'
								}} >
								<View >
									<Image style={{
										width: 20,
										height: 17,
										tintColor: '#fff',
										marginLeft: 'auto',
										marginRight: 'auto'
									}} source={require('../assets/saved.png')} alt={'Okay'} />
									<Text numberOfLines={1}
										style={{ fontFamily: 'poppins_medium', fontSize: 9, color: '#fff', marginTop: 2 }}>Saved</Text>
								</View>
							</Ripple>

							<Ripple rippleColor="white" rippleOpacity={0.3} rippleDuration={900} rippleSize={200}
								onPress={() => {
									// if (login) {
									// 	if (check === "complete") {
									navigation.push('applied')
									// 	} else {
									// 		toggleProfile()
									// 	}
									// } else {
									// 	toggleRequireVisible()
									// }
								}}
								style={{
									height: '100%',
									flex: 1,
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									width: '22%',

								}}>
								<View >
									<Image style={{
										width: 20,
										height: 20,
										tintColor: '#fff',
										marginLeft: 'auto',
										marginRight: 'auto'
									}} source={require('../assets/applied.png')} alt={'Okay'} />
									<Text numberOfLines={1}
										style={{ fontFamily: 'poppins_medium', fontSize: 9, color: '#fff', marginTop: 2 }}>Applied</Text>
								</View>
							</Ripple>

							<Ripple rippleColor="white" rippleOpacity={0.3} rippleDuration={900} rippleSize={200}
								onPress={() => {
									if (login) {
										navigation.push('Offers')
									} else {

										toggleRequireVisible()
									}
								}}
								style={{
									height: '100%',
									flex: 1,
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									width: '20%'
								}}>
								<View >
									<Image style={{
										width: 32,
										height: 28,
										tintColor: '#fff',
										marginLeft: 'auto',
										marginRight: 'auto'
									}} source={require('../assets/offersss.png')} alt={'Okay'} />
									<Text numberOfLines={1}
										style={{ fontFamily: 'poppins_medium', fontSize: 12, color: '#fff', marginTop: 2, marginLeft: 3 }}>Offers</Text>
									<View style={{ height: 4, width: 50, borderRadius: 2, backgroundColor: '#F0A51E', marginLeft: -4 }} />
								</View>
							</Ripple>
							<Ripple rippleColor="white" rippleOpacity={0.3} rippleDuration={900} rippleSize={200}
								onPress={() => {
									if (login) {
										navigation.push('History')
									} else {

										toggleRequireVisible()
									}
								}}
								style={{
									height: '100%',
									flex: 1,
									flexDirection: 'column',
									justifyContent: 'center',
									marginLeft: -4,
									alignItems: 'center',
									width: '20%'
								}}>
								<Image style={{
									width: 20,
									height: 19,
									tintColor: '#fff',
									marginLeft: 'auto',
									marginRight: 'auto'
								}} source={require('../assets/history.png')} alt={'Okay'} />
								<Text numberOfLines={1} style={{
									fontFamily: 'poppins_medium',
									fontSize: 9,
									color: '#fff',
									marginTop: 2
								}}>History</Text>
							</Ripple>
							<Ripple rippleColor="white" rippleOpacity={0.3} rippleDuration={900} rippleSize={200}
								onPress={() => {
									if (login) {
										navigation.push('Profile')
									} else {
										toggleRequireVisible()
									}
								}}
								style={{
									height: '100%',
									flex: 1,
									flexDirection: 'column',
									justifyContent: 'center',
									marginLeft: -4,
									alignItems: 'center',
									width: '20%'
								}}>
								<Image style={{
									width: 20,
									height: 18,
									tintColor: '#fff',
									marginLeft: 'auto',
									marginRight: 'auto'
								}} source={require('../assets/profile.png')} alt={'Okay'} />
								<Text numberOfLines={1} style={{
									fontFamily: 'poppins_medium',
									fontSize: 9,
									color: '#fff',
									marginTop: 2
								}}>Profile</Text>
							</Ripple>
						</View>
					</View>

					{/* <BannerAd
						unitId="ca-app-pub-3940256099942544/6300978111"
						size={BannerAdSize.FULL_BANNER}
						requestOptions={{
							requestNonPersonalizedAdsOnly: true,
						}}
					/> */}
				</>}
		</View>
	)
}

export default Home
