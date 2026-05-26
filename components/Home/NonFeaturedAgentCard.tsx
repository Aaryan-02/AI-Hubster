import React from "react";
import Colors from '../../shared/Colors';
import { FlatList, View, Text, Image } from "react-native";
import {Agent} from "./AgentCard"

type Props = {
    agent: Agent
}


export default function NonFeaturedAgentCard({ agent }: Props) {
  return (
      <View style={{
          backgroundColor: Colors.WHITE,
          borderRadius: 20,
          minHeight: 200,
          overflow: 'hidden',
          padding: 15,
      }}>
        <View style={{

        }}>
          <Image source={agent.image} style={{
            width: 120,
            height: 120,
            resizeMode: 'contain',
          }} />
        </View> 
        <View style={{
            marginTop: 10,
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{agent.name}</Text>
          <Text numberOfLines={2} style={{ color: Colors.GRAY, margin: 2 }}>
            {agent.desc}
          </Text>
        </View>
        
      </View>
    );
  };