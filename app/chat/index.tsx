import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Pressable, ToastAndroid, Image } from "react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";
import Colors from "../../shared/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from '@expo/vector-icons/Feather';
import {AIChatModel} from "../../shared/GlobalApi";
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from "@clerk/expo";
import { firestoreDb, storage } from "@/config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";



type Message = {
  role: string;
  content: string | any[];
}

export default function ChatUI() {
  const navigation = useNavigation();
  const { agentName, agentPrompt, agentId, initialText, chatId, emoji, imageBanner, messagesList } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>();
  const {user} = useUser();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: agentName,
      headerRight: () => <AntDesign name="plus" size={24} color="black" />,
    });

    if(chatId){
      setDocId(chatId.toString());
    } else {
      const id = Date.now().toString();
      setDocId(id);
    }

    if(messagesList){
      //@ts-ignore
      const messageListJSON = JSON.parse(messagesList);
      if(messageListJSON.length > 0){
        setMessages(messageListJSON)
      }
    }
  }, []);

  useEffect(() => {
    setInput(initialText as string || "");

    if(agentPrompt){
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: agentPrompt.toString() },
      ]);
    }
  }, [agentPrompt]);

  const onSendMessage = async () => {
    if (input.trim() === "") return;

    let newMessage: Message;

    if(file){
      const imageUrl = await uploadImageToStorage();

      newMessage = { 
        role: "user", 
        content: [
          { type: "text", text: input },
          { type: "image_url", image_url: { url: imageUrl } }
        ] 
      };

      setFile(null);

    } else {
      newMessage = {
        role: "user",
        content: input
      };
    }

    setMessages((prev) => [...prev, newMessage]);

    setInput("");

    const loadingMessage = {
      role: "assistant",
      content: "__loading__"
    };

    setMessages((prev) => [...prev, loadingMessage]);

    const result = await AIChatModel([...messages, newMessage]);

    setMessages((prev) => {
      const updated = [...prev];

      updated[updated.length - 1] = {
        role: "assistant",
        content: result?.aiResponse || "Something went wrong",
      };

      return updated;
    });
  };

  const CopyToClipboard = async (message: string) => {
    await Clipboard.setStringAsync(message);
    ToastAndroid.show("Message copied to clipboard!", ToastAndroid.BOTTOM);
  }

  const PickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.5,
    });

    if(!result.canceled){
      setFile(result.assets[0].uri);
    }
  }

  const uploadImageToStorage = async () => {
    try {
      //@ts-ignore
      const response = await fetch(file);

      const blobFile = await response.blob();

      const fileName = `chat_images/${Date.now()}.png`;

      const imageRef = ref(storage, fileName);

      // WAIT for upload to finish
      await uploadBytes(imageRef, blobFile);

      console.log("Uploaded file!");

      // THEN get URL
      const imageUrl = await getDownloadURL(imageRef);

      console.log("Image URL:", imageUrl);

      return imageUrl;

    } catch (error) {
      console.log("Upload Error:", error);
      return null;
    }
  };

  useEffect(() => {
    const SaveMessages = async () => {
        if(messages.length > 0 && docId) {
          await setDoc(doc(firestoreDb, 'chats', docId), {
          userEmail: user?.primaryEmailAddress?.emailAddress ?? null,
          messages: messages,
          docId: docId,
          agentName: agentName?.toString() ?? null, 
          agentPrompt: agentPrompt?.toString() ?? null,
          agentId: agentId?.toString() ?? null,
          emoji: emoji?.toString() ?? null,
          imageBanner: imageBanner?.toString() ?? null,
          lastModified: Date.now(),
        }, {merge: true})
      }
    }
    SaveMessages();
  }, [messages])

  return (
    <KeyboardAvoidingView 
      keyboardVerticalOffset={80}
      behavior={Platform.OS === "android" ? "padding" : undefined}
      style={{ flex: 1, padding: 10 }}
    >
      <FlatList
        data={messages}
        //@ts-ignore
        renderItem={({ item, index }) => item.role !== "system" && (
          <View
            style={[
              styles.messageContainer,
              item.role === "user"
                ? styles.userMessage
                : styles.assistantMessage,
            ]}
          >
            { typeof item.content=='string' ? (item.content === "__loading__" ? 
              <ActivityIndicator size="small" color={Colors.BLACK}/>    
              :
              
              <Text
                style={[
                  styles.messageText,
                  item.role === "user" ? styles.userText : styles.assistantText,
                ]}
              >
                {item.content}
              </Text>
            ) : (
              <>
                {item.content.find((c:any) => c.type === "text") && (
                  <Text style={[
                    styles.messageText,
                    item.role === "user" ? styles.userText : styles.assistantText,
                  ]}>{item.content.find((c) => c.type === "text").text}</Text>
                )}

                {item.content.find((c:any) => c.type === "image_url") && (
                  <Image 
                    source={{uri: item.content.find((c) => c.type === "image_url").image_url?.url}}
                    style={styles.previewImage}
                  />
                )}
              </>  
            )}
            {item.role === "assistant" && 
              <Pressable onPress={() => CopyToClipboard(item.content.toString())}>
                <AntDesign name="copy" size={24} color={Colors.GRAY} />
              </Pressable>
            }
          </View>
        )}
      />


      <View>
        {file && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: file }}
              style={styles.previewImage}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFile(null)}
            >
              <AntDesign
                name="close-circle"
                size={20}
                color={Colors.WHITE}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={{
              marginRight: 10,
            }}
            onPress={PickImage}
          >
            <AntDesign name="camera" size={27} color="black" />
          </TouchableOpacity>

          <TextInput placeholder="Type a message..." style={styles.input} 
            onChangeText={(v) => setInput(v)}
            value={input}
          />

          <TouchableOpacity style={{
              backgroundColor: Colors.PRIMARY,
              padding: 8,
              borderRadius: 99,
            }}
            onPress={onSendMessage}
          >
            <Feather name="send" size={22} color="white" />
          </TouchableOpacity>
        </View>    
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "70%",
    marginVertical: 4,
    padding: 10,
    borderRadius: 12,
  },
  userMessage: {
    backgroundColor: Colors.PRIMARY,
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  assistantMessage: {
    backgroundColor: Colors.LIGHT_GRAY,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: Colors.WHITE,
  },
  assistantText: {
    color: Colors.BLACK,
  },
  inputContainer:{
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 12,
    // marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: Colors.WHITE,
    marginRight: 8,
    paddingHorizontal: 15,
  },
  previewContainer: {
    position: "relative",
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },

  closeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 99,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
