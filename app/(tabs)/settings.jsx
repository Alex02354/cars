import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../../redux/user/userSlice";
import { useRouter } from "expo-router";

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

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

  const handleFileUpload = useCallback(async (uri) => {
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
          setImagePercent(Math.round(progress));
        },
        (error) => {
          setImageError(true);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prevFormData) => ({
            ...prevFormData,
            profilePicture: downloadURL,
          }));
        }
      );
    } catch (error) {
      console.log("File upload error: ", error);
      setImageError(true);
    }
  }, []);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image, handleFileUpload]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `https://moto-app.onrender.com/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Do you really want to delete your account?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              dispatch(deleteUserStart());
              const res = await fetch(
                `https://moto-app.onrender.com/api/user/delete/${currentUser._id}`,
                {
                  method: "DELETE",
                }
              );
              const data = await res.json();
              if (data.success === false) {
                dispatch(deleteUserFailure(data));
                return;
              }
              dispatch(deleteUserSuccess(data));
              dispatch(signOut());
              router.push("/"); // Redirect to the home page after successful deletion
            } catch (error) {
              dispatch(deleteUserFailure(error));
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handleSignOut = async () => {
    try {
      await fetch("https://moto-app.onrender.com/api/auth/signout");
      dispatch(signOut());
      router.push("/"); // Redirect to the index page after signout
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {currentUser && (
        <>
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={{
                uri: formData.profilePicture || currentUser.profilePicture,
              }}
              style={styles.profilePicture}
            />
          </TouchableOpacity>
          <Text style={styles.uploadStatus}>
            {imageError ? (
              <Text style={styles.errorText}>
                Error uploading image (file size must be less than 2 MB)
              </Text>
            ) : imagePercent > 0 && imagePercent < 100 ? (
              <Text
                style={styles.uploadingText}
              >{`Uploading: ${imagePercent} %`}</Text>
            ) : imagePercent === 100 ? (
              <Text style={styles.successText}>
                Image uploaded successfully
              </Text>
            ) : (
              ""
            )}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            defaultValue={currentUser.username}
            onChangeText={(text) => handleChange("username", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            defaultValue={currentUser.email}
            onChangeText={(text) => handleChange("email", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Loading..." : "Update"}
            </Text>
          </TouchableOpacity>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleDeleteAccount}>
              <Text style={styles.deleteText}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>Something went wrong!</Text>}
          {updateSuccess && (
            <Text style={styles.successText}>
              User is updated successfully!
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  uploadStatus: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  deleteText: {
    color: "red",
  },
  signOutText: {
    color: "red",
  },
  errorText: {
    color: "red",
  },
  successText: {
    color: "green",
  },
  uploadingText: {
    color: "#666",
  },
});

export default Profile;
