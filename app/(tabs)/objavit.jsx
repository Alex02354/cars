import React from "react";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Text,
  FlatList,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import Divider from "../../components/Divider";
import Constants from "expo-constants";
import Events from "../../components/Events"; // Import the Events component

const Objavit = () => {
  const router = useRouter();

  const renderHeader = () => (
    <>
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
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("@/assets/images/discover.png")}
              style={{
                width: wp(55),
                height: wp(30),
                resizeMode: "contain",
              }}
            />
          </View>
          <Divider />
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
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <FlatList
        data={[]} // An empty array to ensure the FlatList renders
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={null}
        ListHeaderComponentStyle={{ flex: 1 }}
        ListFooterComponentStyle={{ flex: 1 }}
        ListEmptyComponent={
          <View style={styles.container}>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => {
                  router.push({ pathname: "/miesta2" });
                }}
                style={styles.touchable}
              >
                <Image
                  source={require("@/assets/images/places.png")}
                  style={styles.miestaImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push({ pathname: "/kemp2" });
                }}
                style={styles.touchable}
              >
                <Image
                  source={require("@/assets/images/camps.png")}
                  style={styles.kempyImage}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => {
                  router.push({ pathname: "/itinerar2" });
                }}
                style={styles.touchable}
              >
                <Image
                  source={require("@/assets/images/itineraries.png")}
                  style={styles.itinerarImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push({ pathname: "/trasy2" });
                }}
                style={styles.touchable}
              >
                <Image
                  source={require("@/assets/images/routes.png")}
                  style={styles.trasyImage}
                />
              </TouchableOpacity>
            </View>
            <Events
              currentUserId={null}
              showAddEventButton={false}
              showSectionFilters={false}
              hideSectionFilters={true} // Hide section filter buttons
            />
          </View>
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
  kempyImage: {
    width: wp(40),
    height: wp(30),
    resizeMode: "contain",
  },
  itinerarImage: {
    width: wp(45),
    height: wp(30),
    resizeMode: "contain",
  },
  trasyImage: {
    width: wp(38),
    height: wp(30),
    resizeMode: "contain",
  },
  wrapper: {
    paddingTop: Constants.statusBarHeight,
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
});

export default Objavit;
