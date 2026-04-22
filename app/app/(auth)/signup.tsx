import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase';
import { ChevronLeft, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Success!', 'Please check your email for a confirmation link.');
      router.push('/login');
    }
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="px-8 pt-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-8">
              <ChevronLeft size={28} color="#4ade80" />
            </TouchableOpacity>

            <View className="mb-12">
              <Text className="text-text text-4xl font-bold tracking-tight">Join Elakka.</Text>
              <Text className="text-text/60 text-lg mt-2">Start managing your plantation with precision.</Text>
            </View>

            <View className="gap-6">
              <View>
                <Text className="text-text/60 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Full Name</Text>
                <View className="flex-row items-center bg-surface border border-text/10 rounded-2xl px-4 h-16">
                  <ShieldCheck size={20} color="#4ade80" style={{ opacity: 0.6 }} />
                  <TextInput
                    className="flex-1 text-text ml-3 h-full"
                    placeholder="John Doe"
                    placeholderTextColor="rgba(232, 245, 233, 0.3)"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              <View>
                <Text className="text-text/60 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Email Address</Text>
                <View className="flex-row items-center bg-surface border border-text/10 rounded-2xl px-4 h-16">
                  <Mail size={20} color="#4ade80" style={{ opacity: 0.6 }} />
                  <TextInput
                    className="flex-1 text-text ml-3 h-full"
                    placeholder="name@farm.com"
                    placeholderTextColor="rgba(232, 245, 233, 0.3)"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View>
                <Text className="text-text/60 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Password</Text>
                <View className="flex-row items-center bg-surface border border-text/10 rounded-2xl px-4 h-16">
                  <Lock size={20} color="#4ade80" style={{ opacity: 0.6 }} />
                  <TextInput
                    className="flex-1 text-text ml-3 h-full"
                    placeholder="Min. 8 characters"
                    placeholderTextColor="rgba(232, 245, 233, 0.3)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <TouchableOpacity 
                onPress={signUpWithEmail}
                disabled={loading}
                className="bg-accent h-16 rounded-2xl items-center justify-center flex-row mt-4"
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <>
                    <Text className="text-background text-lg font-bold mr-2">Create Account</Text>
                    <UserPlus size={20} color="#000" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-12 mb-8">
              <Text className="text-text/60">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-accent font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
