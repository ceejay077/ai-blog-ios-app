import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

function WelcomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Welcome to SEO Article Generator</Text>
      <Button title="Start" onPress={() => navigation.navigate('Setup')} />
    </View>
  );
}

function SetupScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Setup your article details here (Title, Keywords, Audience...)</Text>
      <Button title="Generate" onPress={() => navigation.navigate('Result')} />
    </View>
  );
}

function ResultScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Generated article will appear here...</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Setup" component={SetupScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
