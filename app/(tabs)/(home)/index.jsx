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
import Events from "../../../components/Events";
import AddEventModal from "../../../components/AddEventModal"; // Adjust the path as per your project structure
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [modalVisible, setModalVisible] = useState(false);

  const handleTabPress = (tabName) => {
    setSelectedTab(tabName);
  };

  const router = useRouter();

  const renderHeader = () => (
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Image
        source={require("@/assets/images/header.jpg")}
        style={{
          width: wp(100),
          height: wp(37),
          resizeMode: "contain",
          marginTop: "6%",
        }}
      />
      <View style={{ marginHorizontal: "11%" }}>
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}
        >
          <TouchableOpacity
            onPress={() => {
              handleTabPress("TRASY");
              router.push({ pathname: "/objavit" });
            }}
          >
            <Image
              source={require("@/assets/images/car1.png")}
              style={{
                width: wp(45),
                height: wp(30),
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleTabPress("TRASY");
              router.push({ pathname: "/pridat" });
            }}
          >
            <Image
              source={require("@/assets/images/car2.png")}
              style={{
                width: wp(45),
                height: wp(30),
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
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
            onPress={() => {
              handleTabPress("ALL");
            }}
            style={[styles.button, selectedTab === "ALL" && styles.activeTab]}
          >
            <Text
              style={[
                styles.btnText,
                selectedTab === "ALL" && styles.activeText,
              ]}
            >
              ALL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleTabPress("MIESTA");
              router.push({ pathname: "/miesta" });
            }}
            style={[
              styles.button,
              selectedTab === "MIESTA" && styles.activeTab,
            ]}
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
            onPress={() => {
              handleTabPress("KEMP");
              router.push({ pathname: "/kemp" });
            }}
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
            onPress={() => {
              handleTabPress("TRASY");
              router.push({ pathname: "/trasy" });
            }}
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
            onPress={() => {
              handleTabPress("ITINERÁR");
              router.push({ pathname: "/itinerar" });
            }}
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
        <View
          className="flex-row justify-between items-center"
          style={{ marginHorizontal: "0%", marginTop: 10 }}
        ></View>
        <View
          style={{
            alignItems: "center",
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {/* Render other tab buttons as needed */}
        </View>
        {/* <View
          className="flex-row justify-between items-center"
          style={{ marginHorizontal: "0%", marginTop: 10 }}
        >
          <Text style={[styles.btnText]}>All</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
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
        </View> */}
      </View>
      <StatusBar style="auto" />
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
    <View style={{ flex: 1 }}>
      <FlatList
        data={[]} // An empty array to ensure the FlatList renders
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={null}
        ListHeaderComponentStyle={{ flex: 1 }}
        ListFooterComponentStyle={{ flex: 1 }}
        ListEmptyComponent={<Events showAddEventButton={true} />} // Render Events here directly when there is no data
      />
      <AddEventModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
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
