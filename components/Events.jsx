import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import axios from "axios";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AddEventModal from "./AddEventModal"; // Adjust the import path accordingly
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

// Mapping of country names to actual image paths
const countryImages = {
  Slovakia: require("../assets/images/slovakia.jpg"),
  France: require("../assets/images/france.jpg"),
  "Czech Republic": require("../assets/images/cz.jpg"),
  Italy: require("../assets/images/italy.jpg"),
};

const Events = ({ currentUserId, showAddEventButton }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://moto-app.onrender.com/api/events" // Replace with your local IP address
      );
      let allEvents = response.data.data;

      if (currentUserId) {
        allEvents = allEvents.filter(
          (event) => event.user.currentUser._id === currentUserId
        );
      }

      setEvents(allEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentUserId]);

  const addEventToList = (newEvent) => {
    setEvents([newEvent, ...events]);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFilterModalVisible(false);
  };

  const filteredEvents = selectedCountry
    ? events.filter((event) => event.country === selectedCountry)
    : events;

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: "11%",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#FFD800",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 15,
            flex: 1,
            marginRight: 5,
          }}
          onPress={() => handleCountrySelect(null)}
        >
          <Text style={{ color: "black", fontWeight: "bold" }}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#FFD800",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 15,
            flex: 1,
            marginLeft: 5,
          }}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={{ color: "black", fontWeight: "bold" }}>Filter</Text>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showAddEventButton && (
        <TouchableOpacity
          style={{
            backgroundColor: "#FFD800",
            marginHorizontal: "11%",
            padding: 10,
            borderRadius: 5,
            margin: 15,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 15,
          }}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add-circle-outline" size={24} color="black" />
          <Text style={{ color: "black", fontWeight: "bold" }}>Add Event</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={filteredEvents}
        numColumns={2}
        keyExtractor={(item, index) => item._id + index}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        columnWrapperStyle={{ justifyContent: "center" }}
        renderItem={({ item, index }) => (
          <EventCard item={item} index={index} />
        )}
      />
      <AddEventModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        addEventToList={addEventToList}
      />
      <Modal
        transparent={true}
        visible={filterModalVisible}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => handleCountrySelect(null)}>
              <Text style={styles.modalItem}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCountrySelect("Slovakia")}>
              <Text style={styles.modalItem}>Slovakia</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCountrySelect("France")}>
              <Text style={styles.modalItem}>France</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCountrySelect("Czech Republic")}
            >
              <Text style={styles.modalItem}>Czech Republic</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCountrySelect("Italy")}>
              <Text style={styles.modalItem}>Italy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const EventCard = ({ item, index }) => {
  const countryImage = countryImages[item.country]; // Get the country image path based on the country

  return (
    <Link href={`/${item._id}`} asChild>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          width: wp(38),
          height: wp(64),
          borderWidth: 1.5,
          gap: 1,
          margin: 5, // Add margin to separate cards
          padding: 5, // Add padding inside the card
          backgroundColor: "white", // Add background color to the card
          borderRadius: 5, // Add border radius to the card
          justifyContent: "space-between",
        }}
      >
        <Image
          source={{ uri: item.image }}
          resizeMode="cover"
          style={{
            width: wp(28),
            height: wp(20),
            alignSelf: "center",
            borderRadius: 10, // Add border radius to the image
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 2,
          }}
        >
          <View style={{ width: wp(30), height: wp(8) }}>
            <Text style={{ fontSize: hp(1.6), fontWeight: "bold" }}>
              {item.title}
            </Text>
          </View>
          {item.access === 0 ? (
            <Ionicons name="airplane-outline" size={wp(5)} color="black" />
          ) : (
            <Ionicons name="car-outline" size={wp(5)} color="black" />
          )}
        </View>
        <Text style={{ fontSize: hp(1.3), fontWeight: "semibold" }}>
          {item.description}
        </Text>
        <Text style={{ fontSize: hp(1.3), fontWeight: "bold" }}>
          Date: {item.date}
        </Text>
        <Text style={{ fontSize: hp(1.3), fontWeight: "bold" }}>
          ID: {item._id}
        </Text>
        <Text style={{ fontSize: hp(1.3), fontWeight: "bold" }}>
          Section: {item.section}
        </Text>
        <Text style={{ fontSize: hp(1.3), fontWeight: "bold" }}>
          Created by: {item.user.currentUser.username}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: wp(80),
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 18,
    paddingVertical: 10,
  },
  modalCancel: {
    fontSize: 18,
    paddingVertical: 10,
    color: "red",
    textAlign: "center",
  },
});

export default Events;
