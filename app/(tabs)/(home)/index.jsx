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
import Constants from "expo-constants";

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handleTabPress = (tabName) => {
    setSelectedTab(tabName);
  };

  const renderHeader = () => (
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
                source={require("@/assets/images/discover.png")}
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
                source={require("@/assets/images/ADD.png")}
                style={{
                  width: wp(41),
                  height: wp(29),
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
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
  wrapper: {
    paddingTop: Constants.statusBarHeight,
  },
});

export default HomeScreen;
