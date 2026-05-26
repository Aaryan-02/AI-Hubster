import Colors from '../../shared/Colors';
import React from 'react';
import { View, Text, Image } from 'react-native';

type Props = {
    agent: Agent
}

export type Agent = {
    id: number;
    name: string;
    desc: string;
    image: any;
    initialText: string;
    prompt: string;
    type: string;
    featured?: boolean;
}

const AgentCard: React.FC<Props> = ({ agent }) => {
  return (
    <View style={{
        backgroundColor: Colors.WHITE,
        borderRadius: 20,
        minHeight: 200,
        overflow: 'hidden',
    }}
    >
      <View style={{
        padding: 15,
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{agent.name}</Text>
        <Text numberOfLines={2} style={{ color: Colors.GRAY, margin: 2 }}>
          {agent.desc}
        </Text>
      </View>
      
      <View style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
      }}>
        <Image source={agent.image} style={{
          width: 105,
          height: 105,
          resizeMode: 'contain',
        }} />
      </View> 
    </View>
  );
};

export default AgentCard;  