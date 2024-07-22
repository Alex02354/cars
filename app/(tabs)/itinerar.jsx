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
  Alert,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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

const itinerar = () => {
  const initialState = {
    title: "",
    description: "",
    image: "",
    map: "",
    coordinates: "",
    access: 0,
    date: "",
    section: "itinerary",
    country: "Italy",
  };

  const [eventData, setEventData] = useState(initialState);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(null);
  const [mapImage, setMapImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [mapImagePercent, setMapImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [mapImageError, setMapImageError] = useState(false);

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

  const handleMapImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setMapImage(result.assets[0].uri);
    }
  };

  const handleFileUpload = useCallback(
    async (uri, setImageProgress, setImageError, setEventField) => {
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
            setImageProgress(Math.round(progress));
          },
          (error) => {
            setImageError(true);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setEventData((prevEventData) => ({
              ...prevEventData,
              [setEventField]: downloadURL,
            }));
          }
        );
      } catch (error) {
        console.log("File upload error: ", error);
        setImageError(true);
      }
    },
    []
  );

  useEffect(() => {
    if (image) {
      handleFileUpload(image, setImagePercent, setImageError, "image");
    }
  }, [image, handleFileUpload]);

  useEffect(() => {
    if (mapImage) {
      handleFileUpload(mapImage, setMapImagePercent, setMapImageError, "map");
    }
  }, [mapImage, handleFileUpload]);

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
    const formattedDate = selectedDate.toISOString().split("T")[0];
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
    const { title, image, date, coordinates, access, country, map } = eventData;

    if (
      !title ||
      !image ||
      !map ||
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
      console.log("Submitting event data:", eventData);

      const formattedDate = new Date(date).toISOString().split("T")[0];

      const response = await axios.post(
        "https://moto-app.onrender.com/api/events",
        {
          ...eventData,
          coordinates: eventData.coordinates.split(",").map(Number),
          user,
          favourite: false,
          date: formattedDate,
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
          country: countries[0].name,
          favourite: false,
        });
        router.push("/(tabs)");
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
      <ScrollView style={{ flex: 1, flexDirection: "column" }}>
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
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                source={require("@/assets/images/ADD.png")}
                style={{ width: wp(55), height: wp(30), resizeMode: "contain" }}
              />
            </View>
            <Divider />
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                source={require("@/assets/images/itineraries.png")}
                style={{ width: wp(55), height: wp(30), resizeMode: "contain" }}
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
                    borderRadius: 6,
                    backgroundColor: "white",
                  }}
                >
                  <TextInput
                    style={styles.input}
                    id="TITLE"
                    name="TITLE"
                    type="TITLE"
                    required
                    placeholder="title"
                    value={eventData.title}
                    onChangeText={(text) => handleChange("title", text)}
                  />
                </View>
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  Description
                </Text>
              </View>
              <View style={{ marginTop: hp(1) }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#FFD800",
                    borderRadius: 6,
                    backgroundColor: "white",
                  }}
                >
                  <TextInput
                    style={styles.input}
                    id="description"
                    name="description"
                    placeholder="description"
                    value={eventData.description}
                    onChangeText={(text) => handleChange("description", text)}
                  />
                </View>
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="image"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  Image
                </Text>
                <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
              </View>
              <View style={{ marginTop: hp(1) }}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{ ...styles.uploadButton, flex: 1 }}
                    onPress={handleImagePick}
                  >
                    <Text style={styles.uploadButtonText}>Choose Image</Text>
                  </TouchableOpacity>
                  {image && (
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: wp(20),
                        height: wp(20),
                        marginLeft: wp(2),
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="map"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  Map Image
                </Text>
                <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
              </View>
              <View style={{ marginTop: hp(1) }}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{ ...styles.uploadButton, flex: 1 }}
                    onPress={handleMapImagePick}
                  >
                    <Text style={styles.uploadButtonText}>
                      Choose Map Image
                    </Text>
                  </TouchableOpacity>
                  {mapImage && (
                    <Image
                      source={{ uri: mapImage }}
                      style={{
                        width: wp(20),
                        height: wp(20),
                        marginLeft: wp(2),
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="date"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  Date
                </Text>
                <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
              </View>
              <View
                style={{
                  marginTop: hp(1),
                  borderWidth: 0,
                  borderColor: "#FFD800",

                  backgroundColor: "white",
                }}
              >
                <TouchableOpacity onPress={showDatePicker}>
                  <Text style={styles.dateText}>
                    {eventData.date ? eventData.date : "Select Date"}
                  </Text>
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
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="coordinates"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  Coordinates
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
                    style={styles.input}
                    id="coordinates"
                    name="coordinates"
                    type="text"
                    required
                    placeholder="lat,lng"
                    value={eventData.coordinates}
                    onChangeText={(text) => handleChange("coordinates", text)}
                  />
                </View>
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="access"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  Access
                </Text>
                <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#FFD800",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <SelectList
                  setSelected={handleAccessChange}
                  data={accessOptions}
                  save="key"
                  defaultOption={accessOptions[0]}
                  boxStyles={{ borderWidth: 0 }}
                  dropdownStyles={{ borderColor: "#FFD800", borderWidth: 0 }}
                  inputStyles={{ color: "black" }}
                  placeholder="Select Access"
                />
              </View>
            </View>
            <View style={{ marginBottom: hp(2) }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-black-900"
                >
                  Country
                </Text>
                <Text style={{ color: "red", marginRight: wp(2) }}>*</Text>
              </View>
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
                  save="key"
                  defaultOption={countries[0]}
                  boxStyles={{ borderWidth: 0 }}
                  dropdownStyles={{ borderColor: "#FFD800", borderWidth: 0 }}
                  inputStyles={{ color: "black" }}
                  placeholder="Select Country"
                  searchPlaceholder="Search"
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
  input: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFD800",
    borderRadius: 6,
  },
  uploadButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFD800",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#FFD800",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  submitButtonText: {
    fontSize: 16,
    color: "#000",
  },
  successText: {
    color: "green",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
});

export default itinerar;
