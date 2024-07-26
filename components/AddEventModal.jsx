import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase"; // Adjust the import based on your project structure

const AddEventModal = ({ modalVisible, setModalVisible, addEventToList }) => {
  const countries = [
    { name: "Slovakia" },
    { name: "France" },
    { name: "Czech Republic" },
    { name: "Italy" },
  ];

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    map: "",
    coordinates: "",
    access: 0,
    date: "",
    section: { main: "camp", sub: "natural" }, // Default to the first sub-section
    country: countries[0].name,
    favourite: false,
    file: "", // Add file to the event data
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [image, setImage] = useState(null);

  const [file, setFile] = useState(null);

  const user = useSelector((state) => state.user); // Replace with your Redux state selector

  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [filePercent, setFilePercent] = useState(0);
  const [fileError, setFileError] = useState(false);

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

  const handleFilePick = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.type !== "cancel") {
      setFile(result.uri);
      setEventData({ ...eventData, file: result.uri });
    }
  };

  // handleFileUpload function updated to track progress and errors for both image and file
  const handleFileUpload = useCallback(async (uri, isImage) => {
    try {
      const storage = getStorage(app);
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = new Date().getTime() + (isImage ? ".jpg" : "");
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          isImage
            ? setImagePercent(Math.round(progress))
            : setFilePercent(Math.round(progress));
        },
        (error) => {
          console.log("File upload error: ", error);
          isImage ? setImageError(true) : setFileError(true);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (isImage) {
            setEventData((prevEventData) => ({
              ...prevEventData,
              image: downloadURL,
            }));
          } else {
            setEventData((prevEventData) => ({
              ...prevEventData,
              file: downloadURL,
            }));
          }
        }
      );
    } catch (error) {
      console.log("File upload error: ", error);
      isImage ? setImageError(true) : setFileError(true);
    }
  }, []);

  // Effect hooks for image and file uploads
  useEffect(() => {
    if (image) {
      handleFileUpload(image, true);
    }
  }, [image, handleFileUpload]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file, false);
    }
  }, [file, handleFileUpload]);
  const handleChange = (name, value) => {
    setEventData({ ...eventData, [name]: value });
  };

  const handleSectionChange = (main) => {
    const subOptions = {
      camp: "natural",
      route: "offroad",
      places: "nature",
      itinerary: "",
    };
    setEventData({
      ...eventData,
      section: { main, sub: subOptions[main] },
    });
  };

  const handleSubSectionChange = (sub) => {
    setEventData((prevState) => ({
      ...prevState,
      section: { ...prevState.section, sub },
    }));
  };

  const handleCountryChange = (country) => {
    setEventData({ ...eventData, country });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("Submitting event data:", eventData); // Log event data before submission
      const response = await axios.post(
        "https://moto-app.onrender.com/api/events",
        {
          ...eventData,
          coordinates: eventData.coordinates.split(",").map(Number),
          user, // Include the user in the event data
        }
      );
      addEventToList(response.data.data); // Add new event to the list
      setModalVisible(false);
      setEventData({
        title: "",
        description: "",
        image: "",
        map: "",
        coordinates: "",
        access: 0,
        date: "",
        section: { main: "camp", sub: "natural" }, // Reset to the new section structure
        country: countries[0].name, // Reset to Slovakia
        favourite: false, // Reset favourite to false
        file: "", // Reset file
      }); // Clear form data and reset to default country
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Format as per MongoDB date format (YYYY-MM-DD)
    setEventData({ ...eventData, date: formattedDate });
    hideDatePicker();
  };

  const handleClear = () => {
    setEventData({
      title: "",
      description: "",
      image: "",
      map: "",
      coordinates: "",
      access: 0,
      date: "",
      section: { main: "camp", sub: "natural" }, // Reset to the new section structure
      country: countries[0].name, // Reset to Slovakia
      favourite: false, // Reset favourite to false
      file: "", // Reset file
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.modalText}>Add New Event</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={eventData.title}
              onChangeText={(text) => handleChange("title", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={eventData.description}
              onChangeText={(text) => handleChange("description", text)}
              multiline
            />
            <TouchableOpacity onPress={handleImagePick} style={styles.button}>
              <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>
            {image && (
              <>
                <Image
                  source={{ uri: image }}
                  style={{
                    width: 100,
                    height: 100,
                    resizeMode: "contain",
                    marginTop: 10,
                  }}
                />
                {imageError ? (
                  <Text style={styles.errorText}>Error uploading image</Text>
                ) : imagePercent > 0 && imagePercent < 100 ? (
                  <Text style={styles.uploadText}>
                    Uploading image: {imagePercent}%
                  </Text>
                ) : imagePercent === 100 ? (
                  <Text style={styles.uploadText}>
                    Image uploaded successfully
                  </Text>
                ) : null}
              </>
            )}
            <TouchableOpacity onPress={handleFilePick} style={styles.button}>
              <Text style={styles.buttonText}>Pick a file</Text>
            </TouchableOpacity>
            {file && (
              <>
                <Text style={{ marginTop: 10 }}>{file.split("/").pop()}</Text>
                {fileError ? (
                  <Text style={styles.errorText}>Error uploading file</Text>
                ) : filePercent > 0 && filePercent < 100 ? (
                  <Text style={styles.uploadText}>
                    Uploading file: {filePercent}%
                  </Text>
                ) : filePercent === 100 ? (
                  <Text style={styles.uploadText}>
                    File uploaded successfully
                  </Text>
                ) : null}
              </>
            )}
            <TextInput
              style={styles.input}
              placeholder="Map URL"
              value={eventData.map}
              onChangeText={(text) => handleChange("map", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Coordinates (comma-separated)"
              value={eventData.coordinates}
              onChangeText={(text) => handleChange("coordinates", text)}
            />
            <TouchableOpacity style={styles.input} onPress={showDatePicker}>
              <Text>
                {eventData.date ? eventData.date.toString() : "Select Date"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Section:</Text>
              <Picker
                selectedValue={eventData.section.main}
                style={styles.picker}
                onValueChange={(itemValue) => handleSectionChange(itemValue)}
              >
                <Picker.Item label="Camp" value="camp" />
                <Picker.Item label="Route" value="route" />
                <Picker.Item label="Itinerary" value="itinerary" />
                <Picker.Item label="Places" value="places" />
              </Picker>

              {eventData.section.main === "camp" && (
                <Picker
                  selectedValue={eventData.section.sub}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleSubSectionChange(itemValue)
                  }
                >
                  <Picker.Item label="Natural" value="natural" />
                  <Picker.Item label="Created" value="created" />
                </Picker>
              )}

              {eventData.section.main === "route" && (
                <Picker
                  selectedValue={eventData.section.sub}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleSubSectionChange(itemValue)
                  }
                >
                  <Picker.Item label="Offroad" value="offroad" />
                  <Picker.Item label="Caravan/Car" value="caravan/car" />
                </Picker>
              )}

              {eventData.section.main === "places" && (
                <Picker
                  selectedValue={eventData.section.sub}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleSubSectionChange(itemValue)
                  }
                >
                  <Picker.Item label="Nature" value="nature" />
                  <Picker.Item label="Built" value="built" />
                  <Picker.Item label="Views" value="views" />
                </Picker>
              )}
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Country:</Text>
              <Picker
                selectedValue={eventData.country}
                style={styles.picker}
                onValueChange={(itemValue) => handleCountryChange(itemValue)}
              >
                {countries.map((country) => (
                  <Picker.Item
                    key={country.name}
                    label={country.name}
                    value={country.name}
                  />
                ))}
              </Picker>
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={handleClear}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSubmit]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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
  scrollViewContent: {
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: 270,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  buttonClose: {
    backgroundColor: "#f44336",
  },
  buttonSubmit: {
    backgroundColor: "#4CAF50",
  },
  errorText: {
    color: "red",
  },
  pickerContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  pickerLabel: {
    marginBottom: 5,
  },
  picker: {
    width: 200,
    height: 40,
  },
  uploadText: {
    marginTop: 10,
    color: "blue",
  },
});

export default AddEventModal;
