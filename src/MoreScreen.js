import React from 'react';
import {View, Text,  StyleSheet,  TouchableOpacity,  Alert,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MoreScreen = ({ navigation }) => {

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    Alert.alert('Logout', 'You have been logged out');
    navigation.replace('LoginScreen');
  };

  const MenuItem = ({ icon, title, onPress, danger }) => (
    <TouchableOpacity
      style={[styles.item, danger && styles.dangerItem]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={22}
        color={danger ? '#ff4d4d' : '#000'}
        style={styles.icon}
      />
      <Text style={[styles.itemText, danger && styles.dangerText]}>
        {title}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={danger ? '#ff4d4d' : '#aaa'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <MenuItem
        icon="person-outline"
        title="Profile"
        onPress={() => navigation.navigate('ProfileScreen')}
      />

      <MenuItem
        icon="list-outline"
        title="My Joined Daily Contest"
        onPress={() => navigation.navigate('JoinedContestScreen')}
      />

      <MenuItem
        icon="ribbon-outline"
        title="My Joined Festival Contest"
        onPress={() => navigation.navigate('JoinedFestivalContestScreen')}
      />

      <MenuItem
        icon="calendar-outline"
        title="Upcoming Contest"
        onPress={() =>
          navigation.navigate('HomeScreen', {
            screen: 'Upcoming',
          })
        }
      />

      <MenuItem
        icon="trophy-outline"
        title="Winning"
        onPress={() =>
          navigation.navigate('HomeScreen', {
            screen: 'Winning',
          })
        }
      />

      <MenuItem
        icon="lock-closed-outline"
        title="Change Password"
        onPress={() => navigation.navigate('ChangePasswordScreen')}
      />

      <MenuItem
        icon="log-out-outline"
        title="Logout"
        danger
        onPress={handleLogout}
      />
    </View>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    color: '#ffa41c',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  icon: {
    marginRight: 15,
  },
  itemText: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  dangerItem: {
    backgroundColor: '#1a0000',
  },
  dangerText: {
    color: '#ff4d4d',
    fontWeight: 'bold',
  },
});
