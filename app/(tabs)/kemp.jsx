import React, { useState, useEffect, useCallback } from "react";
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
  Alert,
  StatusBar,
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
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";

const kemp = () => {
  const initialState = {
    title: "",
    description: "",
    image: "",
    map: "",
    coordinates: "",
    access: 0,
    date: "",
    section: "camp",
    country: "Italy",
  };

  const [eventData, setEventData] = useState(initialState);
  const [open, setOpen] = useState(false); // Open and closes the modal
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);

  const user = useSelector((state) => state.user);
  const router = useRouter();

  const countries = [
    { key: "Slovakia", value: "Slovakia" },
    { key: "France", value: "France" },
    { key: "Czech Republic", value: "Czech Republic" },
    { key: "Italy", value: "Italy" },
  ];

  const accessOptions = [
    { key: 0, value: "Caravan" },
    { key: 1, value: "Car" },
    { key: 2, value: "Off-road" },
  ];

  useEffect(() => {
    const requestPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    };
    requestPermission();
  }, []);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleFileUpload = useCallback(async (uri) => {
    try {
      const storage = getStorage(app);
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = new Date().getTime() + ".jpg";
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImagePercent(Math.round(progress));
        },
        (error) => {
          setImageError(true);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setEventData((prevEventData) => ({
            ...prevEventData,
            image: downloadURL,
          }));
        }
      );
    } catch (error) {
      console.log("File upload error: ", error);
      setImageError(true);
    }
  }, []);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image, handleFileUpload]);

  const handleChange = (name, value) => {
    setEventData({ ...eventData, [name]: value });
  };

  const handleCountryChange = (value) => {
    setEventData({ ...eventData, country: value });
  };

  const handleAccessChange = (value) => {
    setEventData({ ...eventData, access: value });
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

    if (
      !title ||
      !image ||
      !date ||
      !coordinates ||
      access === "" ||
      !country
    ) {
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
          section: "camp",
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
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" />
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
                source={require("@/assets/images/ADD.png")}
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
                source={require("@/assets/images/camps.png")}
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
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
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
                    id="title"
                    value={eventData.title}
                    onChangeText={(text) => handleChange("title", text)}
                    className="block w-full rounded-md py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-black-300 placeholder:text-black-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    multiline={true}
                    type="text"
                    name="description"
                    id="description"
                    value={eventData.description}
                    onChangeText={(text) => handleChange("description", text)}
                    className="block w-full rounded-md py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-black-300 placeholder:text-black-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </View>
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="IMAGE"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  IMAGE
                </Text>
                <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
              </View>
              <View style={{ marginTop: hp(1) }}>
                <TouchableOpacity
                  onPress={handleImagePick}
                  style={{
                    borderWidth: 1,
                    borderColor: "#FFD800",
                    borderRadius: 2,
                    backgroundColor: "white",
                    padding: 10,
                  }}
                >
                  <Text>Pick an image</Text>
                </TouchableOpacity>
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 100,
                      height: 100,
                      resizeMode: "contain",
                      marginTop: 10,
                    }}
                  />
                )}
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="MAP"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  MAP
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
                  <TextInput
                    type="text"
                    name="map"
                    id="map"
                    value={eventData.map}
                    onChangeText={(text) => handleChange("map", text)}
                    className="block w-full rounded-md py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-black-300 placeholder:text-black-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </View>
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="COORDINATES"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  COORDINATES
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
                    name="coordinates"
                    id="coordinates"
                    value={eventData.coordinates}
                    onChangeText={(text) => handleChange("coordinates", text)}
                    className="block w-full rounded-md py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-black-300 placeholder:text-black-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </View>
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="COUNTRY"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  COUNTRY
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
                    data={countries}
                    setSelected={handleCountryChange}
                    placeholder="Select Country"
                    searchPlaceholder="Search"
                    boxStyles={{ borderWidth: 0 }}
                    dropdownStyles={{ borderColor: "#FFD800", borderWidth: 0 }}
                    inputStyles={{ color: "black" }}
                  />
                </View>
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="ACCESS"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  ACCESS
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
                    data={accessOptions}
                    setSelected={handleAccessChange}
                    placeholder="Select Access"
                    search={false}
                    boxStyles={{ borderWidth: 0 }}
                    dropdownStyles={{ borderColor: "#FFD800", borderWidth: 0 }}
                    inputStyles={{ color: "black" }}
                  />
                </View>
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="DATE"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  DATE
                </Text>
                <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
              </View>
              <View style={{ marginTop: hp(1) }}>
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={{
                    borderWidth: 1,
                    borderColor: "#FFD800",
                    borderRadius: 2,
                    backgroundColor: "white",
                    padding: 10,
                  }}
                >
                  <Text>{eventData.date || "Select Date"}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleDateChange}
                  onCancel={hideDatePicker}
                />
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: "#FFD800",
                  borderRadius: 5,
                  padding: 10,
                  alignItems: "center",
                }}
                disabled={isSubmitting}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <StatusBar style="auto" />
    </>
  );
};

const styles = StyleSheet.create({
  successText: {
    color: "green",
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default kemp;
