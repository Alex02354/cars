import React from "react";
import { View } from "react-native";

const Divider = ({
  width = 4,
  orientation = "horizontal",
  color = "#000",
  dividerStyle,
}) => {
  const dividerStyles = [
    { width: orientation === "horizontal" ? "100%" : width },
    { height: orientation === "vertical" ? "100%" : width },
    { backgroundColor: color },
    dividerStyle,
  ];

  return <View style={dividerStyles} />;
};

export default Divider;
