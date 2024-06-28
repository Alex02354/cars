import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const add2 = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column" /* backgroundColor: "#BCBCBB" */,
      }}
    >
      <SafeAreaView>
        <Text style={{ marginTop: 20 }}>ALL Page</Text>
      </SafeAreaView>
    </View>
  );
};

export default add2;
