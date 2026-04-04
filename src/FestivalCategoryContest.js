import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal
} from 'react-native';
import CustomHeader from './components/CustomHeader';
import { BASE_URL } from './config/config';

export default function FestivalCategoryContest({ navigation }) {

  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [prizeModalVisible, setPrizeModalVisible] = useState(false);
  const [selectedPrizePool, setSelectedPrizePool] = useState([]);
  const [selectedContestTitle, setSelectedContestTitle] = useState("");

  useEffect(() => {
    fetchFestivalContests();
  }, []);

  const fetchFestivalContests = async () => {
    try {
      const res = await fetch(`${BASE_URL}festival_contest.php`);
      const json = await res.json();

      if (json.status) {
        setContests(json.data);
      } else {
        setContests([]);
      }

    } catch (err) {
      console.log(err);
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  const renderContest = ({ item }) => (
    <View style={styles.card}>

      <Text style={styles.cardTitle}>{item.title}</Text>

      <Text style={styles.prize}>🏆 Prize : ₹{item.prize}</Text>
      <Text style={styles.text}>💰 Entry : ₹{item.cost}</Text>

      <Text style={styles.text}>
        📅 {item.draw_date} {item.draw_time}
      </Text>

      <TouchableOpacity
        style={styles.prizeBtn}
        onPress={() => {
          setSelectedPrizePool(
            Array.isArray(item.prizepool) ? item.prizepool : []
          );
          setSelectedContestTitle(item.title);
          setPrizeModalVisible(true);
        }}
      >
        <Text style={styles.prizeBtnText}>VIEW PRIZE POOL</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.joinBtn}
        onPress={() =>
          navigation.navigate('JoinFestivalContest', { contest: item })
        }
      >
        <Text style={styles.joinText}>JOIN NOW</Text>
      </TouchableOpacity>

    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>

      <ScrollView showsVerticalScrollIndicator={false}>


        <View style={styles.section}>

          <Text style={styles.sectionTitle}>🎉 Festival Contests</Text>

          {contests.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No festival contests available
            </Text>
          ) : (
            <FlatList
              data={contests}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderContest}
              scrollEnabled={false}
            />
          )}

        </View>

      </ScrollView>

      {/* PRIZE MODAL */}
      <Modal
        visible={prizeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPrizeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>

          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              {selectedContestTitle} Prize Pool
            </Text>

            {selectedPrizePool.length === 0 ? (
              <Text style={{ textAlign: "center", marginVertical: 20 }}>
                Prize Pool Not Available
              </Text>
            ) : (
              <FlatList
                data={selectedPrizePool}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.prizeRow}>
                    <Text style={styles.slot}>Winner x{item.slot}</Text>
                    <Text style={styles.amount}>₹{item.prize}</Text>
                  </View>
                )}
              />
            )}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setPrizeModalVisible(false)}
            >
              <Text style={styles.closeText}>CLOSE</Text>
            </TouchableOpacity>

          </View>

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  section: {
    marginTop: 20,
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  prize: {
    fontSize: 14,
    fontWeight: '600',
    color: 'green',
  },

  text: {
    fontSize: 13,
    color: '#555',
  },

  joinBtn: {
    marginTop: 10,
    backgroundColor: '#ffa41c',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  joinText: {
    color: '#fff',
    fontWeight: '700',
  },

  prizeBtn: {
    marginTop: 8,
    backgroundColor: "#eee",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center"
  },

  prizeBtnText: {
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center"
  },

  prizeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
  },

  slot: {
    fontSize: 14,
  },

  amount: {
    fontSize: 14,
    fontWeight: "700",
    color: "green"
  },

  closeBtn: {
    marginTop: 15,
    backgroundColor: "#ff5252",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center"
  },

  closeText: {
    color: "#fff",
    fontWeight: "700"
  }

});