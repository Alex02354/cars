// AddEventModal.jsx
import React, { useState } from "react";
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
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";

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
    date: "", // Date will be stored as a string
    section: "kemp",
    country: countries[0].name, // Default to Slovakia
    favourite: false, // Default favourite to false
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const user = useSelector((state) => state.user); // Replace with your Redux state selector

  const handleChange = (name, value) => {
    setEventData({ ...eventData, [name]: value });
  };

  const handleCountryChange = (country) => {
    setEventData({ ...eventData, country });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("Submitting event data:", eventData); // Log event data before submission
      const response = await axios.post(
        "https://moto-app.onrender.com/events",
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
        section: "kemp",
        country: countries[0].name, // Reset to Slovakia
        favourite: false, // Reset favourite to false
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
    const formattedDate = selectedDate.toISOString(); // Format as per MongoDB date format
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
      section: "kemp",
      country: countries[0].name, // Reset to Slovakia
      favourite: false, // Reset favourite to false
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
            <TextInput
              style={styles.input}
              placeholder="Image URL"
              value={eventData.image}
              onChangeText={(text) => handleChange("image", text)}
            />
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
              mode="datetime"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Access Level:</Text>
              <Picker
                selectedValue={eventData.access}
                style={styles.picker}
                onValueChange={(itemValue) => handleChange("access", itemValue)}
              >
                <Picker.Item label="Plane" value={0} />
                <Picker.Item label="Car" value={1} />
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Section:</Text>
              <Picker
                selectedValue={eventData.section}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  handleChange("section", itemValue)
                }
              >
                <Picker.Item label="kemp" value="kemp" />
                <Picker.Item label="places" value="places" />
                <Picker.Item label="itinerary" value="itinerary" />
              </Picker>
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

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Loading..." : "Submit"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleClear}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
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
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    width: "90%", // Adjusted to be almost full-width
    maxHeight: "90%", // Added to prevent modal from taking more than the available screen height
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 8, // Reduced margin bottom to make fields wider
    borderRadius: 5,
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 8, // Reduced margin bottom to make fields wider
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginTop: 8, // Reduced margin top to make fields wider
  },
  submitButton: {
    backgroundColor: "#FFD800",
  },
  clearButton: {
    backgroundColor: "#CCCCCC",
  },
  closeButton: {
    backgroundColor: "#FF6666",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AddEventModal;
