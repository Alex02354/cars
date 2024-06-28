/* // app/oauth.js
import React from "react";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useRouter } from "expo-router";
import { View, Button } from "react-native";

export default function OAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "666772645208-6sjal9pkco6km06uhc436pslsuqge4fg.apps.googleusercontent.com",
    iosClientId:
      "666772645208-eahu9f74ic98tap9abjbg9p1g0epul29.apps.googleusercontent.com",
    androidClientId:
      "666772645208-v2mdj6u965be0qb9sdd09jv9i4dpkvrj.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response) {
      console.log("Google Auth Response:", response);
    }
    if (response?.type === "success") {
      const { id_token } = response.params;
      console.log("ID Token:", id_token);

      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("Sign-In Success:", result);
          dispatch(
            signInSuccess({
              name: result.user.displayName,
              email: result.user.email,
              photo: result.user.photoURL,
            })
          );
          router.push("/");
        })
        .catch((error) => console.log("Error logging in with Google", error));
    }
  }, [response]);

  return (
    <View>
      <Button
        title="Continue with Google"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
}
 */
