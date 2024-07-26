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
import Constants from "expo-constants";

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");

  return (
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.wrapper}>
        <Image
          source={require("@/assets/images/header.jpg")}
          style={{
            width: wp(100),
            height: wp(37),
            resizeMode: "contain",
            marginTop: "0%",
            marginBottom: "3%",
          }}
        />
      </View>
      <Events />

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
  wrapper: {
    paddingTop: Constants.statusBarHeight,
  },
});

export default Settings;
