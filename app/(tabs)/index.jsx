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

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");

  const handleTabPress = (tabName) => {
    setSelectedTab(tabName);
  };

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
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
        <Image
          source={require("@/assets/images/car1.png")}
          style={{
            width: wp(45),
            height: wp(30),
            resizeMode: "contain",
          }}
        />
        <Image
          source={require("@/assets/images/car2.png")}
          style={{
            width: wp(45),
            height: wp(30),
            resizeMode: "contain",
          }}
        />
      </View>
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
          activeOpacity={1}
          onPress={() => handleTabPress("ALL")}
          style={[styles.button, selectedTab === "ALL" && styles.activeTab]}
        >
          <Text
            style={[styles.btnText, selectedTab === "ALL" && styles.activeText]}
          >
            ALL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleTabPress("MIESTA")}
          style={[styles.button, selectedTab === "MIESTA" && styles.activeTab]}
        >
          <Text
            style={[
              styles.btnText,
              selectedTab === "MIESTA" && styles.activeText,
            ]}
          >
            MIESTA
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleTabPress("KEMP")}
          style={[styles.button, selectedTab === "KEMP" && styles.activeTab]}
        >
          <Text
            style={[
              styles.btnText,
              selectedTab === "KEMP" && styles.activeText,
            ]}
          >
            KEMP
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
          activeOpacity={1}
          onPress={() => handleTabPress("TRASY")}
          style={[styles.button, selectedTab === "TRASY" && styles.activeTab]}
        >
          <Text
            style={[
              styles.btnText,
              selectedTab === "TRASY" && styles.activeText,
            ]}
          >
            TRASY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleTabPress("ITINERÁR")}
          style={[
            styles.button,
            selectedTab === "ITINERÁR" && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.btnText,
              selectedTab === "ITINERÁR" && styles.activeText,
            ]}
          >
            ITINERÁR
          </Text>
        </TouchableOpacity>
      </View>
      <View className="mx-10">
        <View className="flex-row justify-between my-8 items-center mb-1">
          <Text style={[styles.btnText]}>All</Text>
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

export default HomeScreen;
