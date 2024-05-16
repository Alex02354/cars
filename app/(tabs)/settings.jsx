import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Events from "../../components/Events";
import Entypo from "@expo/vector-icons/Entypo";
import Divider from "../../components/Divider";

const settings = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");

  return (
    <ScrollView
      style={{ flex: 1, flexDirection: "column", backgroundColor: "#BCBCBB" }}
    >
      <Image
        source={require("@/assets/images/header.jpg")}
        style={{
          width: wp(100),
          height: wp(37),
          resizeMode: "contain",
        }}
      />
      <View className="mx-10">
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/miesta.png")}
            style={{
              width: wp(55),
              height: wp(30),
              resizeMode: "contain",
            }}
          />
        </View>
        <Divider />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/priroda.png")}
            style={{
              width: wp(45),
              height: wp(30),
              resizeMode: "contain",
              flex: 1,
            }}
          />
          <Image
            source={require("@/assets/images/stavby.png")}
            style={{
              width: wp(23),
              height: wp(15),
              resizeMode: "contain",
              alignSelf: "center",
              flex: 1,
            }}
          />
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/vyhlady.png")}
            style={{
              width: wp(40),
              height: wp(23),
              resizeMode: "contain",
            }}
          />
        </View>

        <View className="flex-row justify-between mt-10 items-center mb-1">
          <Text style={[styles.btnText]}>Places</Text>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.button]}
            className="flex-row px-6"
          >
            <Text
              style={[
                styles.btnText,
                selectedTab === "Filter" && styles.activeText,
              ]}
              className="mr-5"
            >
              Filter
            </Text>
            <Entypo name="triangle-down" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <Events />
        </View>
      </View>
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
    </ScrollView>
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

export default settings;
