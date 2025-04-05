import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './src/Home';
import Settings from './src/Settings';
// import Icon from 'react-native-vector-icons/FontAwesome';
// global.Buffer = global.Buffer || require('buffer').Buffer;
const Tab = createBottomTabNavigator();
// const HomeIcon = ({ color, size }: { color: string; size: number }) => (
//   <Icon name="home" size={size} color={color} />
// );

// const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
//   <Icon name="settings" size={size} color={color} />
// );

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="首页"
          component={Home}
          options={{
            tabBarIcon: () => null,
          }}
        />
        <Tab.Screen
          name="设置"
          component={Settings}
          options={{
            tabBarIcon: () => null,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
