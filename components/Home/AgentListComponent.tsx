import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';
import { Agents } from "../../shared/AgentList";
import AgentCard from "./AgentCard";
import NonFeaturedAgentCard from "./NonFeaturedAgentCard";


export default function AgentListComponent({ isFeatured }: any) {
  const router = useRouter();
  const filteredAgents = Agents.filter(agent => agent.featured === isFeatured);

  return (
    <View>
      <FlatList
        data={filteredAgents}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={{ flex: 1, padding: 5 }}
            onPress={() => router.push({
              pathname: '/chat',
              params: {
                  agentName: item.name,
                  initialText: item.initialText,
                  prompt: item.prompt,
                  agentId: item.id,
                  imageBanner: item.image,
              }
          })}
          >
            {item.featured ? (
              <AgentCard agent={item} key={index} />
            ) : (
              <NonFeaturedAgentCard agent={item} key={index} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}