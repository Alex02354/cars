import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Events from "../../components/Events";
import Entypo from "@expo/vector-icons/Entypo";
import { useSelector } from "react-redux";

const Account = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const user = useSelector((state) => state.user.currentUser); // Replace with the actual path to the user in your Redux state

  const renderHeader = () => (
    <>
      <Image
        source={require("@/assets/images/header.jpg")}
        style={{
          width: wp(100),
          height: wp(37),
          resizeMode: "contain",
        }}
      />
      <View style={{ marginHorizontal: "11%" }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/vyhlady.png")}
            style={{
              width: wp(55),
              height: wp(30),
              resizeMode: "contain",
            }}
          />
        </View>
        <View className="flex-row justify-between items-center">
          <Text style={[styles.btnText]}>My profile</Text>
        </View>
      </View>
    </>
  );

  const renderFooter = () => (
    <View
      style={{
        alignItems: "center",
        marginBottom: 50,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity activeOpacity={1} style={[styles.button2]}>
        <Text style={[styles.btnText2]}>View More</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={[]} // An empty array to ensure the FlatList renders
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      renderItem={null}
      ListHeaderComponentStyle={{ flex: 1 }}
      ListFooterComponentStyle={{ flex: 1 }}
      ListEmptyComponent={
        <Events currentUserId={user._id} showAddEventButton={false} />
      } // Pass the current user ID to the Events component
    />
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#FFD800",
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 30,
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

export default Account;
