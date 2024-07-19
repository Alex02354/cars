import React from "react";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import Divider from "../../components/Divider";

const Pridat = () => {
  const router = useRouter();

  return (
    <>
      <Image
        source={require("@/assets/images/header.jpg")}
        style={styles.headerImage}
      />
      <View style={styles.container}>
        <View style={styles.centeredView}>
          <Image
            source={require("@/assets/images/car1.png")}
            style={styles.carImage}
          />
        </View>
        <Divider />
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              router.push({ pathname: "/miesta2" });
            }}
            style={styles.touchable}
          >
            <Image
              source={require("@/assets/images/miesta.png")}
              style={styles.miestaImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push({ pathname: "/kemp" });
            }}
            style={styles.touchable}
          >
            <Image
              source={require("@/assets/images/kempy.png")}
              style={styles.kempyImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              router.push({ pathname: "/itinerar" });
            }}
            style={styles.touchable}
          >
            <Image
              source={require("@/assets/images/itinerar.png")}
              style={styles.itinerarImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push({ pathname: "/trasy" });
            }}
            style={styles.touchable}
          >
            <Image
              source={require("@/assets/images/trasy.png")}
              style={styles.trasyImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: wp(100),
    height: wp(37),
    resizeMode: "contain",
    marginTop: "6%",
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
});

export default Pridat;
