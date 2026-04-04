import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // <-- import hook
import { SafeAreaProvider, SafeAreaView  } from 'react-native-safe-area-context';

import { BASE_URL } from './config/config';

const LoginScreen = () => {
  const navigation = useNavigation(); // <-- use navigation hook

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        navigation.replace('HomeScreen'); // agar already login hai to redirect
      }
    };
    checkLogin();
  }, []);
useEffect(() => {
  const checkAppStatus = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}app_status.php`
      );

      const result = await response.json();

      if (result.data === 'Close') {
        navigation.replace('AppClosedScreen');
        return;
      }

      // Agar Open hai to login check kare
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        navigation.replace('HomeScreen');
      }

    } catch (error) {
      Alert.alert('Error', 'Unable to check app status');
    }
  };

  checkAppStatus();
}, []);

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert('Error', 'Please enter mobile number and password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile,
          password: password,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        await AsyncStorage.setItem('userId', result.user.id);
        navigation.replace('HomeScreen'); // login ke baad redirect
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Server not responding');
    }

    setLoading(false);
  };

  return (
<SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
    <View style={styles.container}>
      {/* LOGO */}
      <Image
        source={require('./assets/logo.png')}
        style={styles.logo}
      />

      {/* APP NAME */}
      <Text style={styles.appName}>Bajrangee</Text>

      {/* FORM */}
      <TextInput
        placeholder="Mobile Number"
        placeholderTextColor="#ffa41c"
        keyboardType="number-pad"
        maxLength={10}
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
      />

<View style={styles.passwordContainer}>
  <TextInput
    placeholder="Password"
    placeholderTextColor="#ffa41c"
    secureTextEntry={!showPassword}
    style={styles.passwordInput}
    value={password}
    onChangeText={setPassword}
  />

  <TouchableOpacity
    style={styles.eyeButton}
    onPress={() => setShowPassword(!showPassword)}
  >
    <Text style={{ color: '#ffa41c', fontSize: 16 }}>
      {showPassword ? 'Hide' : 'Show'}
    </Text>
  </TouchableOpacity>
</View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#000',
  },
  logo: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#ffa41c',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ffa41c',
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    color:'#ffa41c',
  },
  button: {
    backgroundColor: '#ffa41c',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffa41c',
    borderRadius: 8,
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#ffa41c',
  },

  eyeButton: {
    paddingHorizontal: 12,
  },
});
