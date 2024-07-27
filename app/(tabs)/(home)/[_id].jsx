import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import MapComponent from "../../../components/map"; // Adjust the path as needed
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Foundation } from "@expo/vector-icons";

const EventDetail = () => {
  const { _id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://moto-app.onrender.com/api/events/${_id}`
        );
        setEvent(response.data.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError(error.message);
      }
    };

    if (_id) {
      fetchEvent();
    }
  }, [_id]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!event) {
    return <Text>Loading...</Text>;
  }

  const { title, image, description, coordinates, map, date, section } = event;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.title}>{date}</Text>
      <Image
        source={{ uri: image }}
        style={{ width: wp(80), height: wp(70), borderRadius: 10 }}
      />

      <Text style={styles.description}>{description}</Text>
      <Text style={{ fontWeight: "500" }}>
        Section: {section.main} {section.sub}
      </Text>
      {coordinates && coordinates.length === 2 && (
        <MapComponent latitude={coordinates[0]} longitude={coordinates[1]} />
      )}

      {map && map.trim() !== "" && (
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => Linking.openURL(map)}
        >
          <Foundation name="map" size={24} color="black" />
          <Text style={styles.mapLink}>Map Link</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    marginTop: "6%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "justify",
    marginVertical: 20,
  },
  mapLink: {
    fontSize: 16,
    color: "black",
    textDecorationLine: "underline",
    fontWeight: "500",
    padding: 5,
  },
  mapButton: {
    borderRadius: 8,
    borderWidth: 0,
    margin: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD800",
  },
});

export default EventDetail;
