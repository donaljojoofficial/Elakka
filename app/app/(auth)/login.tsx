import React, { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase';
import { ChevronLeft, Mail, Lock, LogIn, Globe } from 'lucide-react-native';
import * as Linking from 'expo-linking';

import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signInWithGoogle() {
    setLoading(true);
    const redirectUrl = Linking.createURL('(auth)/login');
    console.log('Google Auth: Using redirect URL:', redirectUrl);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });
      
      console.log('Google Auth: signInWithOAuth result:', { url: data?.url, error });
      if (error) throw error;

      if (data?.url) {
        console.log('Google Auth: Opening browser session...');
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        console.log('Google Auth: Browser session result:', result.type);
        if (result.type === 'success' && result.url) {
          // The onAuthStateChange in _layout.tsx will handle the session once the app is refocused
        }
      } else {
        console.log('Google Auth: No URL returned from Supabase');
      }
    } catch (error: any) {
      Alert.alert('Google Sign-In Error', error.message);
    } finally {
      setLoading(false);
    }
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
              <Text className="text-text text-4xl font-bold tracking-tight">Welcome Back.</Text>
              <Text className="text-text/60 text-lg mt-2">Sign in to continue managing your farm.</Text>
            </View>

            <View className="gap-6">
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
                    placeholder="••••••••"
                    placeholderTextColor="rgba(232, 245, 233, 0.3)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <TouchableOpacity 
                onPress={signInWithEmail}
                disabled={loading}
                className="bg-accent h-16 rounded-2xl items-center justify-center flex-row mt-4"
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <>
                    <Text className="text-background text-lg font-bold mr-2">Sign In</Text>
                    <LogIn size={20} color="#000" />
                  </>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-text/10" />
                <Text className="text-text/30 mx-4 text-xs font-bold uppercase">Or continue with</Text>
                <View className="flex-1 h-[1px] bg-text/10" />
              </View>

              <TouchableOpacity 
                onPress={signInWithGoogle}
                className="h-16 rounded-2xl items-center justify-center flex-row border border-text/10 bg-surface"
              >
                <Globe size={20} color="#e8f5e9" style={{ marginRight: 10 }} />

                <Text className="text-text text-base font-semibold">Google Account</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-12 mb-8">
              <Text className="text-text/60">New to Elakka? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text className="text-accent font-bold">Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
