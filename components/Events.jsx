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
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Mapping of country names to actual image paths
const countryImages = {
  Slovakia: require("../assets/images/slovakia.jpg"),
  France: require("../assets/images/france.jpg"),
  "Czech Republic": require("../assets/images/cz.jpg"),
  Italy: require("../assets/images/italy.jpg"),
};

const Events = ({
  currentUserId,
  showAddEventButton,
  filterSection,
  hideSectionFilters,
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedSection, setSelectedSection] = useState(filterSection);
  const [selectedTab, setSelectedTab] = useState("ALL");

  const handleTabPress = (tabName) => {
    setSelectedTab(tabName);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://moto-app.onrender.com/api/events"
      );
      let allEvents = response.data.data;
      if (currentUserId) {
        allEvents = allEvents.filter(
          (event) => event.user.currentUser._id === currentUserId
        );
      }
      setEvents(allEvents.sort((a, b) => new Date(b.date) - new Date(a.date)));
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

  const filteredEvents = events.filter((event) => {
    const countryMatches = selectedCountry
      ? event.country === selectedCountry
      : true;
    const sectionMatches = selectedSection
      ? event.section === selectedSection
      : true;
    return countryMatches && sectionMatches;
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      {!hideSectionFilters && (
        <>
          <View
            style={{
              alignItems: "center",
              margin: 10,
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={[styles.button, selectedTab === "ALL" && styles.activeTab]}
              onPress={() => {
                setSelectedSection(null);
                handleTabPress("ALL");
              }}
            >
              <Text
                style={[
                  styles.btnText,
                  selectedTab === "ALL" && styles.activeText,
                ]}
              >
                ALL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedTab === "ITINERARY" && styles.activeTab,
              ]}
              onPress={() => {
                setSelectedSection("itinerary");
                handleTabPress("ITINERARY");
              }}
            >
              <Text
                style={[
                  styles.btnText,
                  selectedTab === "ITINERARY" && styles.activeText,
                ]}
              >
                ITINERARIES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedTab === "PLACES" && styles.activeTab,
              ]}
              onPress={() => {
                setSelectedSection("places");
                handleTabPress("PLACES");
              }}
            >
              <Text
                style={[
                  styles.btnText,
                  selectedTab === "PLACES" && styles.activeText,
                ]}
              >
                PLACES
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "center",
              marginBottom: 10,
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                selectedTab === "CAMP" && styles.activeTab,
              ]}
              onPress={() => {
                setSelectedSection("camp");
                handleTabPress("CAMP");
              }}
            >
              <Text
                style={[
                  styles.btnText,
                  selectedTab === "CAMP" && styles.activeText,
                ]}
              >
                CAMPS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedTab === "ROUTES" && styles.activeTab,
              ]}
              onPress={() => {
                setSelectedSection("route");
                handleTabPress("ROUTES");
              }}
            >
              <Text
                style={[
                  styles.btnText,
                  selectedTab === "ROUTES" && styles.activeText,
                ]}
              >
                ROUTES
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <View
        style={{
          justifyContent: "space-between",
          marginHorizontal: "11%",
          gap: 50,
          flexDirection: "row",
          marginVertical: "2%",
        }}
      >
        <Text
          style={{ color: "black", fontWeight: "bold", alignSelf: "center" }}
        >
          Country
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#FFD800",
            padding: 8,
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
      {/* {showAddEventButton && (
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
      )} */}
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

  // Function to map access value to text
  const getAccessText = (access) => {
    switch (access) {
      case 0:
        return "caravan";
      case 1:
        return "car";
      case 2:
        return "offroad";
      default:
        return "unknown";
    }
  };

  return (
    <Link href={`/${item._id}`} asChild>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          width: wp(38),
          height: wp(50),
          borderWidth: 1.5,
          gap: 0,
          margin: 5, // Add margin to separate cards
          padding: 4, // Add padding inside the card
          backgroundColor: "white", // Add background color to the card
          borderRadius: 5, // Add border radius to the card
          justifyContent: "space-between",
        }}
      >
        <Image
          source={{ uri: item.image }}
          resizeMode="cover"
          style={{
            width: wp(30),
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
            <MaterialCommunityIcons
              name="rv-truck"
              size={wp(4)}
              color="black"
            />
          ) : item.access === 1 ? (
            <MaterialCommunityIcons
              name="car-side"
              size={wp(5)}
              color="black"
            />
          ) : (
            <MaterialCommunityIcons
              name="car-estate"
              size={wp(5)}
              color="black"
            />
          )}
        </View>
        <Text style={{ fontSize: hp(1.4), fontWeight: "bold" }}>
          Section: {item.section}
        </Text>
        <Text style={{ fontSize: hp(1.4), fontWeight: "bold" }}>
          Country: {item.country}
        </Text>
        <Text style={{ fontSize: hp(1.4), fontWeight: "bold" }}>
          Access: {getAccessText(item.access)}
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: wp("80%"),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
  modalCancel: {
    fontSize: 16,
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#FFD800",
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  button2: {
    alignItems: "center",
    backgroundColor: "#FFD800",
    padding: 10,
    paddingHorizontal: 35,
    borderRadius: 2.65,
    elevation: 4,
  },
  btnText: {
    color: "black",
    fontWeight: "bold",
  },
  btnText2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
  activeTab: {
    backgroundColor: "black",
  },
  activeText: { color: "#FFD800" },
});

export default Events;
