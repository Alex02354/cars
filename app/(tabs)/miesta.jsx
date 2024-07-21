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
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";

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
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);

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
              source={require("@/assets/images/places.png")}
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
                  id="title"
                  value={eventData.title}
                  onChangeText={(text) => handleChange("title", text)}
                  className="form-control block w-full p-2"
                  placeholder="Title of the place..."
                />
              </View>
            </View>
          </View>

          <View style={{ marginBottom: hp(2) }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                htmlFor="TITLE"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                DESCRIPTION
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
                  name="description"
                  id="description"
                  value={eventData.description}
                  onChangeText={(text) => handleChange("description", text)}
                  className="form-control block w-full p-2"
                  placeholder="Description of the place..."
                  multiline={true}
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
                  setSelected={(value) => handleCountryChange(value)}
                  data={countries}
                  save="value"
                  placeholder="Select a country"
                  searchPlaceholder="Search..."
                  dropdownStyles={{ borderRadius: 0, borderWidth: 0 }}
                  boxStyles={{ borderRadius: 0, borderWidth: 0 }} // override default styles
                  defaultOption={{
                    key: eventData.country,
                    value: eventData.country,
                  }}
                />
              </View>
            </View>
          </View>

          <View style={{ marginBottom: hp(2) }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-black-900"
              >
                DATE
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
                  padding: 2,
                }}
              >
                <TouchableOpacity onPress={showDatePicker}>
                  <TextInput
                    type="text"
                    name="date"
                    id="date"
                    value={eventData.date}
                    onChangeText={(text) => handleChange("date", text)}
                    className="form-control block w-full p-2"
                    placeholder="Select a date..."
                    editable={false}
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleDateChange}
                  onCancel={hideDatePicker}
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
                  padding: 2,
                }}
              >
                <Picker
                  selectedValue={eventData.access}
                  onValueChange={(itemValue) =>
                    handleChange("access", itemValue)
                  }
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
                  className="form-control block w-full p-2"
                  placeholder="Map URL..."
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
                  className="form-control block w-full p-2"
                  placeholder="Coordinates (latitude, longitude)..."
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
              <TouchableOpacity onPress={handleImagePick}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#FFD800",
                    borderRadius: 2,
                    backgroundColor: "white",
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={{ width: 100, height: 100 }}
                    />
                  ) : (
                    <AntDesign name="plus" size={24} color="black" />
                  )}
                </View>
              </TouchableOpacity>
              {imagePercent > 0 && (
                <Text
                  style={styles.uploadText}
                >{`Uploading: ${imagePercent}%`}</Text>
              )}
              {imageError && (
                <Text style={styles.errorText}>Image upload failed.</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  successText: {
    color: "green",
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    marginVertical: 5,
  },
  uploadText: {
    color: "blue",
    marginVertical: 5,
  },
  submitButton: {
    backgroundColor: "#FFD800",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  submitButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default miesta;
