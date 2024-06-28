import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AddEventModal = ({ modalVisible, setModalVisible, addEventToList }) => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    map: "",
    coordinates: "",
    access: 0,
    date: "", // Date will be stored as a string
    section: "",
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const user = useSelector((state) => state.user); // Replace with your Redux state selector

  const handleChange = (name, value) => {
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://192.168.1.30:3000/events", {
        ...eventData,
        coordinates: eventData.coordinates.split(",").map(Number),
        user, // Include the user in the event data
      });
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
        section: "",
      }); // Clear form data
      // Optionally, you can trigger a callback or update state in parent component upon successful submission
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
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
          <TextInput
            style={styles.input}
            placeholder="Access Level"
            value={eventData.access.toString()}
            onChangeText={(text) => handleChange("access", parseInt(text))}
            keyboardType="numeric"
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
          <TextInput
            style={styles.input}
            placeholder="Section"
            value={eventData.section}
            onChangeText={(text) => handleChange("section", text)}
          />
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
            style={[styles.button, styles.closeButton]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 15, // Add horizontal padding for a better look
    marginHorizontal: 5, // Add a bit of margin to the sides
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#FFD800",
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
