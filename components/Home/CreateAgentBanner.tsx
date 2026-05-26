import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Colors from '../../shared/Colors';


const CreateAgentBanner: React.FC = () => {
    const router = useRouter();
  return (
    <View style={{
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 15,
    }}>
        <Image source={require('../../assets/images/agents/agentGroup.png')} style={{
            width: 150,
            height: 120,
            resizeMode: 'contain'
        }} />
        <View style={{
            padding: 10,
            width: 180,
        }}>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Colors.WHITE,
            }}>Create Your Own Agent</Text>

            <TouchableOpacity style={{  
                    backgroundColor: Colors.WHITE,
                    padding: 7,
                    borderRadius: 5,
                    marginTop: 5,
                }}
                onPress={() => router.push('/create-agent')}
            >
                <Text style={{
                    color: Colors.PRIMARY,
                    textAlign: 'center',
                }}>Create Now</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default CreateAgentBanner;  