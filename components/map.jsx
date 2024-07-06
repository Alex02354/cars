import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapComponent = ({ latitude, longitude }) => {
  const markerCoordinate = { latitude, longitude };

  const handleMarkerPress = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
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
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 20,
  },
  map: {
    flex: 1,
  },
});

export default MapComponent;
