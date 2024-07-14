import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const MapComponent = ({ latitude, longitude }) => {
  if (!latitude || !longitude) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid coordinates</Text>
      </View>
    );
  }

  const markerCoordinate = { latitude, longitude };

  const handleMarkerPress = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={markerCoordinate} onPress={handleMarkerPress} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: "85%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 20,
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  errorText: {
    color: "red",
  },
});

export default MapComponent;
