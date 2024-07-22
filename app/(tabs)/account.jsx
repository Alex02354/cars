import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
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

  return (
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Image
        source={require("@/assets/images/header.jpg")}
        style={{
          width: wp(100),
          height: wp(37),
          resizeMode: "contain",
          marginTop: "6%",
          marginBottom: "3%",
        }}
      />
      <Events currentUserId={user._id} showAddEventButton={false} />
      <StatusBar style="auto" />
    </>
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
