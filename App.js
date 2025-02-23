import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import AlarmSettingScreen from "./screens/AlarmSettingScreen";
import MyPageScreen from "./screens/MyPageScreen";
import AlarmPage1 from "./screens/AlarmPage1";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AlarmSetting" component={AlarmSettingScreen} />
        <Stack.Screen name="AlarmPage1" component={AlarmPage1} />
        <Stack.Screen name="MyPage" component={MyPageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
