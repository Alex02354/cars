import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";

const EventDetail = () => {
  const router = useRouter();
  const { _id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user.currentUser); // Replace with the actual path to the user in your Redux state

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://moto-app.onrender.com/events/${_id}`
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

  const toggleFavourite = async () => {
    try {
      const updatedEvent = {
        ...event,
        favourite: !event.favourite,
        user: { currentUser: user },
      };
      const response = await axios.put(
        `https://moto-app.onrender.com/events/${event._id}`,
        updatedEvent
      );
      setEvent(response.data.data);
    } catch (error) {
      console.error("Error updating favourite status:", error);
      setError(error.message);
    }
  };

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!event) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Image source={{ uri: event.image }} style={styles.image} />
      <Text style={styles.description}>{event.description}</Text>
      <TouchableOpacity
        style={styles.favouriteButton}
        onPress={toggleFavourite}
      >
        <FontAwesome
          name={event.favourite ? "heart" : "heart-o"}
          size={32}
          color={event.favourite ? "red" : "gray"}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
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
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  favouriteButton: {
    marginTop: 20,
  },
});

export default EventDetail;
