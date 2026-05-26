import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { useUser } from "@clerk/expo";
import { firestoreDb } from "@/config/FirebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from "@/shared/Colors";
import { useRouter } from "expo-router";



type History = {
    docId: string;
    agentId: string;
    agentName: string;
    agentPrompt: string;
    emoji: string;
    imageBanner: string;
    messages: any[];
    lastModified: any;
}

export default function History() {
  const {user} = useUser();
  const router = useRouter();
  const [historyList, setHistoryList] = useState<History[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    user && getChatHistory();
  }, [user]);

  const getChatHistory=async ()=> {
    setLoading(true);
    const q = query(collection(firestoreDb, "chats"), where("userEmail", "==", user?.primaryEmailAddress?.emailAddress), orderBy("lastModified", "desc"));

    const querySnapshot = await getDocs(q);

// console.log("Is Empty:", querySnapshot.empty);
// console.log("Docs Count:", querySnapshot.size);
    
    setHistoryList([]); // Clear previous list before fetching new data
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
        //@ts-ignore
        setHistoryList((prev) => [...prev, doc.data()]);
    });

    setLoading(false);
  }

  const onClickHandle = (item: History) => {
      router.push({
        pathname: '/chat',
        params: {
          chatId: item.docId,
          agentName: item.agentName,
          initialText: '',
          agentPrompt: item.agentPrompt,
          agentId: item.agentId,
          emoji: item.emoji,
          imageBanner: item.imageBanner,
          messagesList: JSON.stringify(item.messages),
        }
    })
  } 

  return (
    <View style={{
        padding: 15,
        marginTop: 20,
    }}>
        <FlatList
            data={historyList}
            onRefresh={() => getChatHistory()}
            refreshing={loading}
            renderItem={({item, index}) => (
                <TouchableOpacity style={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 10,
                    backgroundColor: Colors.WHITE,
                    borderRadius: 10,
                    marginBottom: 10,
                }}
                  onPress={() => onClickHandle(item)}
                >
                  <View style={{
                    padding: 15,
                    marginRight: 10,
                    backgroundColor: Colors.LIGHT_GRAY,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                  }}>
                    {item.emoji ? <Text style={{ fontSize: 20 }}>{item.emoji}</Text> : 
                    <Ionicons name="chatbubble-outline" size={24} color="black" />}
                  </View>

                  <View style={{
                    width: '80%',
                  }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.agentName}</Text>
                    <Text numberOfLines={2}
                      style={{
                        color: Colors.GRAY,
                      }}
                    >{item?.messages[item.messages.length - 1]?.content}</Text>
                  </View>
                </TouchableOpacity>
            )}
        />
    </View>
  )
}