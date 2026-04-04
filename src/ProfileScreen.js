import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, SafeAreaView  } from 'react-native-safe-area-context';
import { BASE_URL } from './config/config';

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await fetch(`${BASE_URL}profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      const result = await response.json();
      if (result.status) {
        setUser(result.data);
      }
    } catch (error) {
      console.log('Profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffa41c" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

    <View style={{ flex: 1 }}>
      {/* 🔹 Custom Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.replace('HomeScreen')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {/* Profile Top */}
        <View style={styles.profileHeader}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.mobile}>{user.cn}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <InfoRow icon="person-circle" label="Name" value={user.name} />
          <InfoRow icon="location" label="Address" value={user.address} />
          <InfoRow icon="call" label="Contact Number" value={user.cn} />
          <InfoRow icon="logo-whatsapp" label="Whatsapp Number" value={user.wn} />
          <InfoRow icon="wallet" label="Wallet Balance" value={`₹${user.balance}`} />
        </View>
      </ScrollView>
    </View>
      </SafeAreaView>

  );
};

export default ProfileScreen;

/* ---------- Reusable Info Row ---------- */
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <Ionicons name={icon} size={20} color="#ffa41c" />
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  /* Header */
  headerBar: {
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

  /* Profile */
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  mobile: {
    color: '#777',
    marginTop: 4,
  },

  /* Card */
  card: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#777',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
});
