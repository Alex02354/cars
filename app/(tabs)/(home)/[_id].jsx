import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import MapComponent from "../../../components/map"; // Adjust the path as needed
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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

  const { title, image, description, coordinates, map, date } = event;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.title}>{date}</Text>
      <Image
        source={{ uri: image }}
        style={{ width: wp(80), height: wp(50), borderRadius: 10 }}
      />

      <Text style={styles.description}>{description}</Text>
      <Text>Location:</Text>
      {coordinates && coordinates.length === 2 && (
        <MapComponent latitude={coordinates[0]} longitude={coordinates[1]} />
      )}
      <Text>Route:</Text>
      {map && map.trim() !== "" && (
        <Image
          source={{ uri: map }}
          style={{
            width: wp(80),
            height: wp(50),
            borderRadius: 10,
            marginVertical: 10,
          }}
        />
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
    textAlign: "center",
    marginBottom: 20,
  },
});

export default EventDetail;
