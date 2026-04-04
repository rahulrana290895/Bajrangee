import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomHeader from './components/CustomHeader';
import { BASE_URL } from './config/config';

const Tab = createMaterialTopTabNavigator();
const getDaysOfCurrentMonth = () => {
  const today = new Date();
  const currentDay = today.getDate();
  let days = [];
  for (let i = 1; i <= currentDay; i++) {
    days.push(i);
  }
  return days;
};
const DayChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateTimeSlots = () => {
    let times = [];
    for (let hour = 9; hour <= 18; hour++) {
      times.push(`${hour}:00`);
      if (hour !== 18) times.push(`${hour}:30`);
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

useFocusEffect(
  useCallback(() => {
    setLoading(true);

    fetch(`${BASE_URL}get_month_chart.php?type=Day`)
      .then(res => res.json())
      .then(json => {
        const grouped = {};

        if (json.status && json.data) {
          json.data.forEach(item => {
            const day = new Date(item.date).getDate();
            const time = item.time;

            if (!grouped[day]) {
              grouped[day] = {};
            }

            grouped[day][time] = item.number;
          });
        }

        const allDays = getDaysOfCurrentMonth();

        const formatted = allDays.map(day => ({
          day,
          numbers: timeSlots.map(t =>
            grouped[day] && grouped[day][t]
              ? grouped[day][t]
              : ""
          )
        }));

        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });

  }, [])
);


  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView horizontal>
      <ScrollView>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.header]}>Day</Text>
            {timeSlots.map((time, index) => (
              <Text key={index} style={[styles.cell, styles.header]}>
                {time}
              </Text>
            ))}
          </View>

          {data.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, styles.dayCell]}>
                {item.day}
               </Text>
              {item.numbers.map((num, i) => (
                <Text
                  key={i}
                  style={[
                    styles.cell,
                    num ? styles.resultCell : null
                  ]}
                >
                  {num}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};
const NightChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateTimeSlots = () => {
    let times = [];
    for (let hour = 23; hour <= 23; hour++) {
      times.push(`${hour}:00`);
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

useFocusEffect(
  useCallback(() => {
    setLoading(true);

    fetch(`${BASE_URL}get_month_chart.php?type=Night`)
      .then(res => res.json())
      .then(json => {
        const grouped = {};

        if (json.status && json.data) {
          json.data.forEach(item => {
            const day = new Date(item.date).getDate();
            const time = item.time;
            if (!grouped[day]) {
              grouped[day] = {};
            }
            grouped[day][time] = item.number;
          });
        }

        const allDays = getDaysOfCurrentMonth();

        const formatted = allDays.map(day => ({
          day,
          numbers: timeSlots.map(t =>
            grouped[day] && grouped[day][t]
              ? grouped[day][t]
              : ""
          )
        }));

        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });

  }, [])
);


  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView horizontal>
      <ScrollView>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.header]}>Day</Text>
            {timeSlots.map((time, index) => (
              <Text key={index} style={[styles.cell, styles.header]}>
                {time}
              </Text>
            ))}
          </View>

          {data.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, styles.dayCell]}>
                {item.day}
              </Text>
              {item.numbers.map((num, i) => (
                <Text
                  key={i}
                  style={[
                    styles.cell,
                    num ? styles.resultCell : null
                  ]}
                >
                  {num}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};
const ChartScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader navigation={navigation} />
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: false,
          tabBarLabelStyle: { fontWeight: 'bold', color: '#000' },
          tabBarStyle: { backgroundColor: '#ffa41c' },
          tabBarIndicatorStyle: { backgroundColor: '#000' },
        }}
      >
        <Tab.Screen name="Day Chart" component={DayChart} />
        <Tab.Screen name="Night Chart" component={NightChart} />
      </Tab.Navigator>
    </View>
  );
};
export default ChartScreen;
const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    padding: 8,
    width: 60,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#ccc',
    fontWeight: 'bold',
    width: 60,
  },
  dayCell: {
    backgroundColor: '#fff',
    fontWeight: 'bold',
    width: 60,
  },
  resultCell: {
    backgroundColor: '#d4edda',
    fontWeight: 'bold',
    width: 60,
  },
});