import * as React from 'react';
import {View, Text, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import UserType from "./pages/UserType";
import Register from "./pages/Register";
import OnBoarding from "./pages/OnBoarding";
import Home from "./pages/Home";
import {useFonts} from "expo-font";
import AppLoading from "./pages/AppLoading";
import ChangePassword from "./pages/ChangePassword";
import Verify from "./pages/Verify";
import VerificationCode from "./pages/VerificationCode";
import {applyMiddleware, compose, legacy_createStore as createStore} from "redux";
import reducers from "./API/reducers/";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import Profile from "./pages/Profile";
import PersonalInfo from "./pages/PersonalInfo";
import AccountInfo from "./pages/AccountInfo";

const store = createStore(reducers, compose(applyMiddleware(thunk)))

const Stack = createNativeStackNavigator();

function App() {

    let [fontLoad] = useFonts({
        'poppins_thin': require('./assets/fonts/poppins_thin.ttf'),
        'poppins_extralight': require('./assets/fonts/poppins_extra_light.ttf'),
        'poppins_light': require('./assets/fonts/poppins_light.ttf'),
        'poppins_regular': require('./assets/fonts/poppins_regular.ttf'),
        'poppins_medium': require('./assets/fonts/poppins_medium.ttf'),
        'poppins_semibold': require('./assets/fonts/poppins_semi_bold.ttf'),
        'poppins_bold': require('./assets/fonts/poppins_bold.ttf'),
        'poppins_extrabold': require('./assets/fonts/poppins_extra_bold.ttf'),
        'poppins_black': require('./assets/fonts/poppins_black.ttf'),
    });

    if (!fontLoad) {
        return <AppLoading/>
    }

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Splash" component={Splash} options={{title: "Splash", headerShown: false}}/>
                    <Stack.Screen name="UserType" component={UserType}
                                  options={{title: "UserType", headerShown: false}}/>
                    <Stack.Screen name="Login" component={Login} options={{title: "Login", headerShown: false}}/>
                    <Stack.Screen name="Register" component={Register}
                                  options={{title: "Register", headerShown: false}}/>
                    <Stack.Screen name="Onboarding" component={OnBoarding}
                                  options={{title: "Onboarding", headerShown: false}}/>
                    <Stack.Screen name="ChangePassword" component={ChangePassword}
                                  options={{title: "ChangePassword", headerShown: false}}/>
                    <Stack.Screen name="Verify" component={Verify} options={{title: "Verify", headerShown: false}}/>
                    <Stack.Screen name="VerificationCode" component={VerificationCode}
                                  options={{title: "VerificationCode", headerShown: false}}/>
                    <Stack.Screen name="Home" component={Home} options={{title: "Home", headerShown: false}}/>
                    <Stack.Screen name="Profile" component={Profile} options={{title: "Profile", headerShown: false}}/>
                    <Stack.Screen name="PersonalInfo" component={PersonalInfo} options={{title: "PersonalInfo", headerShown: false}}/>
                    <Stack.Screen name="AccountInfo" component={AccountInfo} options={{title: "AccountInfo", headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

export default App;
