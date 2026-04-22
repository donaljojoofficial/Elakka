import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Leaf, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground 
        source={require('../../assets/images/landing-bg.png')} 
        style={styles.background}
        resizeMode="cover"
      >

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View className="bg-accent/20 p-4 rounded-3xl border border-accent/30">
                <Leaf size={48} color="#4ade80" />
              </View>
              <Text className="text-text text-5xl font-bold mt-6 tracking-tighter">
                Elakka
              </Text>
              <View className="flex-row items-center mt-2">
                <ShieldCheck size={16} color="#4ade80" />
                <Text className="text-text/60 ml-2 font-medium tracking-wide uppercase text-[10px]">
                  Precision Farm Management
                </Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text className="text-text text-3xl font-semibold leading-tight">
                Cultivate with{"\n"}
                <Text className="text-accent">Intelligence.</Text>
              </Text>
              <Text className="text-text/60 text-base mt-4 leading-relaxed">
                The ultimate tool for cardamom plantation owners. 
                Track yields, manage inventory, and monitor farm health 
                with surgical precision.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                onPress={() => router.push('/signup')}
                className="bg-accent h-16 rounded-2xl items-center justify-center flex-row shadow-lg shadow-accent/20"
              >
                <Text className="text-background text-lg font-bold mr-2">Get Started</Text>
                <ArrowRight size={20} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/login')}
                className="h-16 rounded-2xl items-center justify-center mt-4 border border-text/20 bg-surface/50"
              >
                <Text className="text-text text-lg font-semibold">Sign In to Dashboard</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-8 items-center">
              <Text className="text-text/40 text-[10px] tracking-[2px] uppercase">
                v1.0.2 • Secure Cardamom Analytics
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  content: {
    width: '100%',
  },
  logoContainer: {
    marginBottom: 40,
  },
  textContainer: {
    marginBottom: 50,
  },
  buttonContainer: {
    width: '100%',
  }
});
