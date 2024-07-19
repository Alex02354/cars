import React, { useState } from "react";
import {
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
import axios from "axios";
import { useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SelectList } from "react-native-dropdown-select-list";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Divider from "../../components/Divider";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const miesta = () => {
  const initialState = {
    title: "",
    description: "",
    image: "",
    map: "",
    coordinates: "",
    access: 0,
    date: "",
    section: "places",
    country: "Italy",
  };

  const [eventData, setEventData] = useState(initialState);
  const [open, setOpen] = useState(false); // Open and closes the modal
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const user = useSelector((state) => state.user);
  const router = useRouter();

  const countries = [
    { key: "1", value: "Slovakia" },
    { key: "2", value: "France" },
    { key: "3", value: "Czech Republic" },
    { key: "4", value: "Italy" },
  ];

  const accessOptions = [
    { label: "Caravan", value: 0 },
    { label: "Car", value: 1 },
    { label: "Off-road", value: 2 },
    // Add other options as needed
  ];

  const handleChange = (name, value) => {
    setEventData({ ...eventData, [name]: value });
  };

  const handleCountryChange = (value) => {
    setEventData({ ...eventData, country: value });
  };

  const handleDateChange = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Format as per MongoDB date format (YYYY-MM-DD)
    setEventData({ ...eventData, date: formattedDate });
    setDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleSubmit = async () => {
    const { title, image, date, coordinates, access, country } = eventData;

    if (!title || !image || !date || !coordinates || !access || !country) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      console.log("Submitting event data:", eventData); // Log event data before submission

      // Ensure date is in the correct format
      const formattedDate = new Date(date).toISOString().split("T")[0];

      const response = await axios.post(
        "https://moto-app.onrender.com/api/events",
        {
          ...eventData,
          coordinates: eventData.coordinates.split(",").map(Number),
          user, // Include the user in the event data
          favourite: false,
          date: formattedDate, // Use the formatted date string
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Event added successfully!");
        setEventData({
          title: "",
          description: "",
          image: "",
          map: "",
          coordinates: "",
          access: 0,
          date: "",
          section: "kemp",
          country: countries[0].name, // Reset to Slovakia
          favourite: false, // Reset favourite to false
        }); // Clear form data and reset to default country
        router.push("/(tabs)"); // Navigate to the home screen
      } else {
        setErrorMessage(`Failed to add event: ${response.data.message}`);
      }
    } catch (err) {
      setErrorMessage(`Error adding event: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        flexDirection: "column" /* backgroundColor: "#BCBCBB" */,
      }}
    >
      <Image
        source={require("@/assets/images/header.jpg")}
        style={{
          width: wp(100),
          height: wp(37),
          resizeMode: "contain",
          marginTop: "6%",
        }}
      />
      <SafeAreaView>
        <View className="mx-10">
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("@/assets/images/car2.png")}
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
          {successMessage && (
            <Text style={styles.successText}>{successMessage}</Text>
          )}
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
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
                  name="title"
                  value={eventData.title}
                  onChangeText={(text) => handleChange("title", text)}
                  style={{
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(2),
                    color: "black",
                  }}
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
                  name="description"
                  value={eventData.description}
                  onChangeText={(text) => handleChange("description", text)}
                  style={{
                    paddingHorizontal: wp(2),
                    color: "black",
                  }}
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
                <TextInput
                  type="text"
                  name="image"
                  value={eventData.image}
                  onChangeText={(text) => handleChange("image", text)}
                  style={{
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(2),
                    color: "black",
                  }}
                />
              </View>
            </View>
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
                  name="coordinates"
                  value={eventData.coordinates}
                  onChangeText={(text) => handleChange("coordinates", text)}
                  style={{
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(2),
                    color: "black",
                  }}
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
                <Picker
                  selectedValue={eventData.access}
                  onValueChange={(value) => handleChange("access", value)}
                  style={{
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(2),
                    color: "black",
                  }}
                >
                  {accessOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
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
                  setSelected={handleCountryChange}
                  data={countries}
                  save="value"
                  boxStyles={{ borderRadius: 0, borderWidth: 0 }} // override default styles
                  search={false}
                  dropdownStyles={{ borderRadius: 0, borderWidth: 1 }}
                />
              </View>
            </View>
          </View>
          <View style={{ marginBottom: hp(2) }}>
            <View style={{ flexDirection: "row", paddingBottom: 0 }}>
              <Text
                htmlFor="A DATE"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                A DATE
              </Text>
              <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
            </View>
            <TouchableOpacity
              onPress={showDatePicker}
              style={{
                borderWidth: 1,
                borderColor: "#FFD800",
                borderRadius: 2,
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                value={eventData.date}
                editable={false}
                style={{
                  paddingVertical: hp(1),
                  paddingHorizontal: wp(2),
                  color: "black",
                }}
              />
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
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateChange}
              onCancel={hideDatePicker}
            />
          </View>

          <View
            style={{
              alignItems: "center",
              marginBottom: 50,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.button2]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={[styles.btnText2]}>
                {isSubmitting ? "Submitting..." : "To Send"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
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
    width: "100%",
    borderRadius: 2.65,
    elevation: 4,
    marginTop: 25,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  successText: {
    color: "green",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
});

export default miesta;
