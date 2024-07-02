import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
//import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const timeout = new Promise(
      (_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 120000) // 1 minute timeout
    );

    const signInRequest = async () => {
      try {
        dispatch(signInStart());
        const res = await fetch(
          "https://moto-app.onrender.com/api/auth/signin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          dispatch(signInFailure(data));
          console.error("Error:", data);
          return;
        }
        dispatch(signInSuccess(data));
        router.push("/(tabs)");
      } catch (error) {
        dispatch(signInFailure(error));
        console.error("Error:", error);
      }
    };

    try {
      await Promise.race([signInRequest(), timeout]);
    } catch (error) {
      dispatch(signInFailure({ message: error.message }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={(value) => handleChange("email", value)}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(value) => handleChange("password", value)}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      {/* <OAuth /> */}
      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/auth/SignUp")}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={styles.error}>
          {error.message || "Something went wrong!"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  link: {
    color: "#007BFF",
    marginLeft: 5,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
