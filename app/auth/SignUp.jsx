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
//import OAuth from "../../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("http://192.168.1.30:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      router.push("/");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={(value) => handleChange("username", value)}
      />
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
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      {/*       <OAuth /> */}
      <View style={styles.footer}>
        <Text>Have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.link}>Sign In</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>Something went wrong!</Text>}
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
