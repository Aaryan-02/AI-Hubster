import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { firestoreDb } from "@/config/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useUser } from "@clerk/expo";
import { useEffect, useState } from "react";
import {useNavigation, useRouter} from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from "@/shared/Colors";


type Agent = {
    agentId: string;
    agentName: string;
    prompt: string;
    emoji: string;
}

export default function UserCreatedAgentList() {
    const {user} = useUser();
    const [agentList, setAgentList] = useState<Agent[]>([]);
    const router = useRouter();

    useEffect(() => {
        user && GetUserAgents();
    }, [user]);

    const GetUserAgents = async() => {
        const q = query(collection(firestoreDb, "agents"), 
        where("userEmail", "==", user?.primaryEmailAddress?.emailAddress));

        setAgentList([]); // Clear previous list before fetching new data

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            // console.log(doc.data());
            // @ts-ignore
            setAgentList((prev) => [...prev, {
                ...doc.data(),
                agentId: doc.id,
            }]);
        });
    };

  return (
    <View style={{
        marginVertical: 10
    }}>
        <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
        }}>My Agent/Assistant</Text>

        <FlatList 
            data={agentList}
            renderItem={({item, index}) => (
                <TouchableOpacity style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: Colors.WHITE,
                        padding: 15,
                        marginTop: 10,
                        borderWidth: 0.5,
                        borderRadius: 15,
                        borderColor: Colors.GRAY,
                    }}
                    onPress={() =>  router.push({
                        pathname: '/chat',
                        params: {
                            agentName: item.agentName,
                            initialText: '',
                            prompt: item.prompt,
                            agentId: item.agentId,
                            emoji: item.emoji,
                        }
                    })}
                >
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                    }}>
                        <Text style={{ fontSize: 25 }}>{item.emoji}</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'semibold' }}>{item.agentName}</Text>
                    </View>
                    <AntDesign name="arrow-right" size={24} color="black" />
                </TouchableOpacity>
            )}
        />
    </View>
  )
}