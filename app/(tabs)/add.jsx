/* import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Checkbox from "expo-checkbox";
import DatePicker from "react-native-modern-datepicker";
import { getToday, getFormatedDate } from "react-native-modern-datepicker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SelectList } from "react-native-dropdown-select-list";

const Add = () => {
  const [isChecked1, setChecked1] = useState(false);
  const [isChecked2, setChecked2] = useState(false);
  const [isChecked3, setChecked3] = useState(false);
  const [isChecked4, setChecked4] = useState(false);

  const today = new Date();
  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1),
    "YYYY/MM/DD"
  );

  const [open, setOpen] = useState(false); // open and closes the modal
  const [date, setDate] = useState("12/12/2023"); // date variable

  function handleOnPress() {
    setOpen(!open);
  }

  function handleChange(propDate) {
    setDate(propDate);
  }

  const [selected, setSelected] = React.useState("");

  const data = [
    { key: "1", value: "SERBIA BOSNIA AND HERCEGOVINA" },
    { key: "2", value: "Stockholm / SWEDEN" },
    { key: "3", value: "SLOVAKIA" },
    { key: "4", value: "HUNGARY" },
    { key: "5", value: "AUSTRIA" },
  ];

  return (
    <ScrollView
      style={{
        flex: 1,
        flexDirection: "column" /* backgroundColor: "#BCBCBB" */ /*,
      }}
    >
      <SafeAreaView>
        <View style={{ marginHorizontal: wp(5), marginTop: hp(5) }}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
              source={require("@/assets/images/objavit_crop.png")}
              style={{ width: wp(55), height: wp(30), resizeMode: "contain" }}
            />
            <Text
              style={{
                fontSize: hp(3.5),
                borderColor: "#FFD800",
                borderBottomWidth: 4,
              }}
              className="text-black font-bold text-center tracking-wide pt-5 mb-5"
            >
              ADD
            </Text>
          </View>
          <View style={{ marginBottom: hp(1) }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                htmlFor="Coordinates"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                Coordinates
              </Text>
              <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
            </View>
            <View style={{ marginVertical: hp(1) }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#FFD800",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <TextInput
                  type="text"
                  name="Coordinates"
                  id="Coordinates"
                  style={{
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(2),
                    color: "black",
                  }}
                  //placeholder="janesmith"
                />
              </View>
            </View>
          </View>
          <View style={{ marginBottom: hp(2) }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                htmlFor="Access"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                Access
              </Text>
              <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
            </View>
            <View style={{ marginTop: hp(1) }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#FFD800",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <TextInput
                  type="text"
                  name="Access"
                  id="Access"
                  style={{
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(2),
                    color: "black",
                  }}
                  //placeholder="janesmith"
                />
              </View>
            </View>
          </View>
          <View style={{ marginBottom: hp(2) }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                htmlFor="Country"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                Country
              </Text>
              <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
            </View>
            <View style={{ marginTop: hp(1) }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#FFD800",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <SelectList
                  setSelected={(val) => setSelected(val)}
                  data={data}
                  save="value"
                  boxStyles={{ borderRadius: 0, borderWidth: 0 }} //override default styles
                  search={false}
                  dropdownStyles={{ borderRadius: 0, borderWidth: 1 }}
                />
              </View>
            </View>
          </View>
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>SECTION</Text>
              <Text style={{ color: "red", marginRight: 8 }}>*</Text>
            </View>
            <View style={styles.container}>
              <View style={styles.section}>
                <Checkbox
                  value={isChecked1}
                  onValueChange={setChecked1}
                  color={isChecked1 ? "black" : "#FFD800"}
                />
                <Text style={styles.paragraph}>THE PLACE</Text>
              </View>
              <View style={styles.section}>
                <Checkbox
                  value={isChecked2}
                  onValueChange={setChecked2}
                  color={isChecked2 ? "black" : "#FFD800"}
                />
                <Text style={styles.paragraph}>KEMP</Text>
              </View>
              <View style={styles.section}>
                <Checkbox
                  value={isChecked3}
                  onValueChange={setChecked3}
                  color={isChecked3 ? "black" : "#FFD800"}
                />
                <Text style={styles.paragraph}>ROUTE</Text>
              </View>
              <View style={styles.section}>
                <Checkbox
                  value={isChecked4}
                  onValueChange={setChecked4}
                  color={isChecked4 ? "black" : "#FFD800"}
                />
                <Text style={styles.paragraph}>ITINERARY</Text>
              </View>
            </View>
          </View>
          <View style={{ marginBottom: hp(2) }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                htmlFor="TITLE"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                TITLE
              </Text>
              <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
            </View>
            <View style={{ marginTop: hp(1) }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#FFD800",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <TextInput
                  type="text"
                  name="TITLE"
                  id="TITLE"
                  style={{
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(2),
                    color: "black",
                  }}
                  //placeholder="janesmith"
                />
              </View>
            </View>
          </View>
          <View style={{ marginBottom: hp(2) }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                htmlFor="DESCRIPTION"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                DESCRIPTION
              </Text>
              <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
            </View>
            <View style={{ marginTop: hp(1) }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#FFD800",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <TextInput
                  type="text"
                  name="DESCRIPTION"
                  id="DESCRIPTION"
                  style={{
                    paddingHorizontal: wp(2),
                    color: "black",
                  }}
                  //placeholder="janesmith"
                  numberOfLines={4}
                  multiline={true}
                />
              </View>
            </View>
          </View>
          <View style={{ marginBottom: hp(2) }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                htmlFor="UPLOAD IMAGE"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                UPLOAD IMAGE
              </Text>
              <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
            </View>
            <View style={{ marginTop: hp(1) }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#FFD800",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <TouchableOpacity activeOpacity={1} style={[styles.button3]}>
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
                  >
                    Browse
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ marginBottom: hp(2) }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                htmlFor="UPLOAD MAP"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                UPLOAD MAP
              </Text>
            </View>
            <View style={{ marginTop: hp(1) }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#FFD800",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <TouchableOpacity activeOpacity={1} style={[styles.button3]}>
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
                  >
                    Browse
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ marginBottom: hp(2) }}>
            <View style={{ flexDirection: "row", paddingBottom: 6 }}>
              <Text
                htmlFor="A DATE"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                A DATE
              </Text>
              <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
            </View>
            <TouchableOpacity
              onPress={handleOnPress}
              style={{
                borderWidth: 1,
                borderColor: "#FFD800",
                borderRadius: 2,
                backgroundColor: "white",
              }}
            >
              <AntDesign
                name="calendar"
                size={24}
                color="#FFD800"
                style={{
                  paddingVertical: hp(1),
                  paddingHorizontal: wp(2),
                  alignSelf: "flex-end",
                }}
              />
            </TouchableOpacity>
            <Modal animationType="slide" transparent={true} visible={open}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DatePicker
                    mode="calendar"
                    selected={date}
                    onDateChanged={handleChange}
                    minimumDate={startDate}
                  />
                  <TouchableOpacity onPress={handleOnPress}>
                    <Text>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          <View
            style={{
              alignItems: "center",
              marginBottom: 50,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity activeOpacity={1} style={[styles.button2]}>
              <Text style={[styles.btnText2]}>To Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  button2: {
    alignItems: "center",
    backgroundColor: "#FFD800",
    padding: 10,
    width: "100%",
    borderRadius: 2.65,
    elevation: 4,
    marginTop: 25,
  },

  btnText2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  container: {
    marginVertical: 6,
    marginHorizontal: 25,
    marginBottom: 15,
    gap: 5,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button3: {
    alignItems: "center",
    backgroundColor: "#FFD800",
    padding: 10,
    width: "40%",
  },
});
export default Add;
 */
