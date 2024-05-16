import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { bodyParts } from "../constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Events = () => {
  return (
    <View>
      <FlatList
        data={bodyParts}
        numColumns={2}
        keyExtractor={(item, index) => item.name + index}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        columnWrapperStyle={{ justifyContent: "space-between", gap: 0 }}
        renderItem={({ item, index }) => (
          <EventCard item={item} index={index} />
        )}
        scrollEnabled={false} // Set scrollEnabled to false
      />
    </View>
  );
};

export default Events;

const EventCard = ({ item, index }) => {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          width: wp(38),
          height: wp(49),
          borderWidth: 1.5,
          gap: 0,
        }}
        className="flex justify-between p-2 mb-4 bg-white rounded-[5px]"
      >
        <Image
          source={item.image}
          resizeMode="cover"
          style={{
            width: wp(28),
            height: wp(20),
            alignSelf: "center",
          }}
          className="rounded-[10px]"
        />
        <View className="flex flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.6) }}
            className="text-black font-semibold text-left tracking-wide flex-2"
          >
            {item?.name}
          </Text>
          <Image
            source={item.image2}
            resizeMode="contain"
            style={{
              width: wp(8),
              height: wp(4),
              alignSelf: "flex-end",
              flex: 1.5,
            }}
          />
        </View>
        <Text
          style={{ fontSize: hp(1.3) }}
          className="text-black font-semibold text-left tracking-wide"
        >
          {item?.description}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
