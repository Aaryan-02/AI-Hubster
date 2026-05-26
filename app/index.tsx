import { firestoreDb } from "@/config/FirebaseConfig";
import Colors from "@/shared/Colors";
import { useAuth, useSSO, useUser } from "@clerk/expo";
import { OAuthStrategy } from "@clerk/types";
import * as AuthSession from "expo-auth-session";
import { Href, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [submittingStrategy, setSubmittingStrategy] =
    useState<OAuthStrategy | null>(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  console.log("user", user);

  useEffect(() => {
    if(isSignedIn) {
      router.replace('/(tabs)/Home');
    }
    if(isSignedIn != undefined) {
      setLoading(false);
    }
  }, [isSignedIn]);

  useWarmUpBrowser();

  const onLoginPress = async (oauthStrategy: OAuthStrategy) => {

    setSubmittingStrategy(oauthStrategy);

    try {

      const {
        createdSessionId,
        setActive,
        signUp
      } = await startSSOFlow({
        strategy: oauthStrategy,
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "clerkexpoquickstart",
          path: "/continue",
        }),
      });

      if (signUp?.id) {
  try {

    await setDoc(
      doc(firestoreDb, "users", signUp.id),
      {
        email: signUp.emailAddress ?? null,
        name:
          [signUp.firstName, signUp.lastName]
            .filter(Boolean)
            .join(" ") || null,
        joinDate: Date.now(),
        credits: 30,
      },
      { merge: true }
    );

  } catch (e) {
    console.error("Failed to save user to Firestore:", e);
  }
}

      if (createdSessionId) {
        await setActive!({
          session: createdSessionId,
        });
      }

    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setSubmittingStrategy(null);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop: Platform.OS == "android" ? 30 : 40,
        justifyContent: "center",
      }}
    >
      {/* <Image source={require('./../assets/images/login.png')} 
        style={{ 
          width: Dimensions.get('screen').width * 0.85, height: 280,
          resizeMode: 'contain',
        }} 
      /> */}
      <View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
            color: Colors.PRIMARY,
          }}
        >
          Welcome to AI Pocket Agent
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: Colors.GRAY,
          }}
        >
          Your Ultimate AI Personal Assistant to make life easier. Try it Today,
          Completely Free!
        </Text>
      </View>

      {!loading && <TouchableOpacity
        style={{
          backgroundColor: Colors.PRIMARY,
          width: "100%",
          padding: 15,
          borderRadius: 12,
          marginTop: 50,
          alignItems: "center",
        }}
        onPress={() => onLoginPress("oauth_google")}
      >
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Get Started
        </Text>
      </TouchableOpacity>}

      {loading && <ActivityIndicator size={"large"} />}
    </View>
  );
}
