import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.30:3000/events" // Replace with your local IP address
      );
      setEvents(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={events}
        numColumns={2}
        keyExtractor={(item, index) => item._id + index}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        columnWrapperStyle={{ justifyContent: "center" }}
        renderItem={({ item, index }) => (
          <EventCard item={item} index={index} />
        )}
      />
    </View>
  );
};

const EventCard = ({ item, index }) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        width: wp(38),
        height: wp(49),
        borderWidth: 1.5,
        gap: 0,
        margin: 5, // Add margin to separate cards
        padding: 5, // Add padding inside the card
        backgroundColor: "white", // Add background color to the card
        borderRadius: 5, // Add border radius to the card
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
          marginVertical: 5,
        }}
      >
        <Text style={{ fontSize: hp(1.6), fontWeight: "bold" }}>
          {item.title}
        </Text>
        <Image
          source={{ uri: item.image }}
          resizeMode="contain"
          style={{
            width: wp(8),
            height: wp(4),
          }}
        />
      </View>
      <Text style={{ fontSize: hp(1.3), fontWeight: "semibold" }}>
        {item.description}
      </Text>
      <Text style={{ fontSize: hp(1.3), fontWeight: "bold" }}>
        Date: {item.date}
      </Text>
      <Text style={{ fontSize: hp(1.3), fontWeight: "bold" }}>
        Created by: {item.user.currentUser.username}
      </Text>
    </TouchableOpacity>
  );
};

export default Events;
