import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView  } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { BASE_URL } from './config/config';

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords And Confirm Password do not match');
      return;
    }

    const userId = await AsyncStorage.getItem('userId');

    try {
      const response = await fetch(`${BASE_URL}change_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const result = await response.json();

      if (result.status) {
        Alert.alert('Success', result.message, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Server error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form */}
      <View style={styles.card}>
        <TextInput
          placeholder="Old Password"
          secureTextEntry
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
        />

        <TextInput
          placeholder="New Password"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          placeholder="Confirm New Password"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleChangePassword}>
          <Text style={styles.btnText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </View>
      </SafeAreaView>

  );
};

export default ChangePasswordScreen;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    height: 55,
    backgroundColor: '#ffa41c',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: '#ffa41c',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
