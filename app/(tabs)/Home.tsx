import { Text, TouchableOpacity, View, Image, FlatList } from "react-native"
import {useNavigation} from 'expo-router';
import { useEffect } from "react";
import Colors from "../../shared/Colors";
import { Ionicons } from "@expo/vector-icons";
import AgentListComponent from "../../components/Home/AgentListComponent";
import CreateAgentBanner from "../../components/Home/CreateAgentBanner";

export default function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={{ fontSize: 18, fontWeight: 'bold' }}>AI Hubster</Text>,
      headerTitleAlign: 'center',
      // headerLeft:() => 
      // <TouchableOpacity style={{
      //   marginLeft: 15,
      //   display: 'flex',
      //   flexDirection: 'row',
      //   gap: 6,
      //   backgroundColor: Colors.PRIMARY,
      //   padding:5,
      //   paddingHorizontal: 10,
      //   borderRadius: 5,
      // }}>
      //   <Image source={require("./../../assets/images/pro-icon.png")} 
      //     style={{
      //       width: 20, height:20
      //     }}
      //   />
      //   <Text style={{ color: Colors.WHITE, fontWeight: 'bold' }}>Pro</Text>
      // </TouchableOpacity>,
      // headerRight:() => (
      //   <Ionicons name="settings" style={{marginRight: 15}}/>
      // )
    });
  }, []);
  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={
        <View style={{
          padding: 15,
        }}>
            <AgentListComponent isFeatured={true} />
            <CreateAgentBanner />
            <AgentListComponent isFeatured={false} />
        </View>
      } />
  )
}