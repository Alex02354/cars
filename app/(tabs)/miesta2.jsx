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
import Constants from "expo-constants";
import Divider from "../../components/Divider";
import { useRouter } from "expo-router";

const Miesta2 = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const router = useRouter();
  const renderHeader = () => (
    <>
      <View style={styles.wrapper}>
        <Image
          source={require("@/assets/images/header.jpg")}
          style={styles.headerImage}
        />
        <View style={styles.container}>
          <View style={styles.centeredView}>
            <Image
              source={require("@/assets/images/places.png")}
              style={styles.carImage}
            />
          </View>
          <Divider />
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                router.push({ pathname: "/nature" });
              }}
              style={styles.touchable}
            >
              <Image
                source={require("@/assets/images/places - natural.png")}
                style={styles.naturalImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push({ pathname: "/built" });
              }}
              style={styles.touchable}
            >
              <Image
                source={require("@/assets/images/places - built.png")}
                style={styles.viewsImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                router.push({ pathname: "/views" });
              }}
              style={styles.touchable}
            >
              <Image
                source={require("@/assets/images/places - views.png")}
                style={styles.viewsImage}
              />
            </TouchableOpacity>
          </View>
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
    <>
      <FlatList
        data={[]} // An empty array to ensure the FlatList renders
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={null}
        ListHeaderComponentStyle={{ flex: 1 }}
        ListFooterComponentStyle={{ flex: 1 }}
        ListEmptyComponent={
          <Events
            currentUserId={null}
            showAddEventButton={false}
            showSectionFilters={false}
            filterSection="places" // Pass the filterSection prop to Events
            hideSectionFilters={true} // New prop to hide section filter buttons
          />
        } // Render Events here directly when there is no data
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: wp(100),
    height: wp(37),
    resizeMode: "contain",
    marginTop: "0%",
  },
  container: {
    marginHorizontal: wp(10),
  },
  centeredView: {
    alignItems: "center",
    justifyContent: "center",
  },
  carImage: {
    width: wp(55),
    height: wp(30),
    resizeMode: "contain",
  },
  button2: {
    alignItems: "center",
    backgroundColor: "#FFD800",
    padding: 10,
    paddingHorizontal: 35,
    borderRadius: 2.65,
    elevation: 4,
  },
  btnText2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
  wrapper: {
    paddingTop: Constants.statusBarHeight,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: wp(2),
  },
  touchable: {
    flex: 1,
    alignItems: "center",
  },
  miestaImage: {
    width: wp(40),
    height: wp(30),
    resizeMode: "contain",
  },
  viewsImage: {
    width: wp(38),
    height: wp(30),
    resizeMode: "contain",
  },
  naturalImage: {
    width: wp(44),
    height: wp(32),
    resizeMode: "contain",
  },
});

export default Miesta2;
