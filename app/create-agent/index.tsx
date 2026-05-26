import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from "react-native"
import {useNavigation, useRouter} from "expo-router";
import { useEffect, useState } from "react";
import Colors from "@/shared/Colors";
import EmojiPicker from 'rn-emoji-keyboard'
import { firestoreDb } from "@/config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/expo";



export default function CreateAgent() {
    const navigation = useNavigation();
    const [emoji, setEmoji] = useState<string>("🤖");
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [agentName, setAgentName] = useState<string>("");
    const [instructions, setInstructions] = useState<string>("");
    const {user} = useUser();
    const router = useRouter();
    

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Create Agent",
        });
    }, []);

    const CreateNewAgent = async () => {
        // API call to create new agent with name, instructions and emoji
        if(agentName.trim() === "" || instructions.trim() === "" || !emoji){
            Alert.alert("Please fill all the fields");
            return;
        }

        const agentId = Date.now().toString();

        await setDoc(doc(firestoreDb, "agents", agentId), {
            agentId: agentId,
            agentName: agentName,
            prompt: instructions,
            emoji: emoji,
            userEmail: user?.primaryEmailAddress?.emailAddress,
        });

        Alert.alert("Confirmation", "Agent created successfully",
            [
                {
                    text: 'Ok',
                    onPress: () => console.log('OK Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Try Now',
                    onPress: () => router.push({
                        pathname: '/chat',
                        params: {
                            agentName: agentName,
                            initialText: '',
                            prompt: instructions,
                            agentId: agentId,
                            emoji: emoji,
                        }
                    }),
                    style: 'default'
                }
            ]
        );
    }

  return (
    <View style={{
        padding: 20,
    }}>
        <View style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <TouchableOpacity style={{
                padding: 15,
                borderWidth: 1,
                borderRadius: 15,
                borderColor: Colors.GRAY,
                backgroundColor: Colors.WHITE,
            }}
                onPress={() => setIsOpen(true)}
            >
                <Text style={{fontSize: 30}}>{emoji}</Text>
            </TouchableOpacity>
            <EmojiPicker onEmojiSelected={(event) => setEmoji(event.emoji)} open={isOpen} onClose={() => setIsOpen(false)} />
        </View>

        <View>
            <Text>Agent/Assistant Name</Text>
            <TextInput placeholder="Agent Name" style={styles.input}
                value={agentName}
                onChangeText={setAgentName}
            />
        </View>
        <View style={{marginTop: 15}}>
            <Text>Instructions</Text>
            <TextInput placeholder="Ex. You are a professional assistant that helps with scheduling and email management." 
                style={[styles.input, {height: 200, textAlignVertical: 'top'}]} 
                multiline={true} 
                onChangeText={(v) => setInstructions(v)}
            />
        </View>

        <TouchableOpacity style={{
                backgroundColor: Colors.PRIMARY,
                padding: 15,
                marginTop: 20,
                borderRadius: 15,
            }}
            onPress={CreateNewAgent}
        >
            <Text style={{color: Colors.WHITE, fontSize: 18, textAlign: 'center'}}>
                Create Agent
            </Text>
        </TouchableOpacity>
    </View>
  )
} 

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 18,
    paddingVertical: 15,
  }
})
