import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, } from "react-native";
import { useClerk, useUser } from "@clerk/expo";
import { Ionicons, MaterialCommunityIcons, Feather,} from "@expo/vector-icons";
import { useRouter } from "expo-router";


const menuItems = [
  {
    title: "Create Agent",
    icon: (
      <MaterialCommunityIcons
        name="account-plus-outline"
        size={24}
        color="#4F8EF7"
      />
    ),
    path: '/create-agent',
  },
  {
    title: "Explore",
    icon: <Ionicons name="compass-outline" size={24} color="#4F8EF7" />,
    path: '/(tabs)/Explore',
  },
  {
    title: "My History",
    icon: <Feather name="clock" size={24} color="#4F8EF7" />,
    path: '/(tabs)/History',
  },
  {
    title: "Logout",
    icon: <MaterialCommunityIcons name="logout" size={24} color="#FF4C4C" />,
    path: 'logout',
  },
];

export default function ProfileScreen() {
  const {user} = useUser();
  const router = useRouter();
  const {signOut} = useClerk();

  const onMenuClick = async (menuItem: any) => {
    if(menuItem.path === 'logout'){
      // Handle logout logic here
      await signOut();
      router.replace('/');
    }else{
      router.push(menuItem.path);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      {/* <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      /> */}

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: user?.imageUrl,
          }}
          style={styles.profileImage}
        />
        <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}
            onPress={() => onMenuClick(item)}
          >
            {item.icon}
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 40,
  },

  logo: {
    width: 120,
    height: 50,
    marginBottom: 30,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  email: {
    fontSize: 16,
    color: "#333",
  },

  menu: {
    width: "90%",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
});