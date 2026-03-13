import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { signup, confirmSignup } from '../services/auth/authService';
import { RootStackParamList } from '../constants/index.d';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';

type RegisterScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'RegisterScreen'
>;

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState('Signup');
  const [code, setCode] = useState('');
  const navigation = useNavigation<RegisterScreenNavigationProps>();

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signup(email.trim(), password);
      setScreen('Code');
    } catch (err: any) {
      Alert.alert('Signup error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignup = async () => {
    setLoading(true);
    try {
      await confirmSignup(email.trim(), code.trim());
      Alert.alert('Account verified successfully');
      navigation.navigate('Home');
    } catch (err: any) {
      Alert.alert('Verification Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {screen == 'signup' ? 'Create Account on Silent Hands' : 'Verify Email'}
      </Text>
      {screen == 'signup' ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            autoCapitalize="none"
            secureTextEntry
          />
          <TouchableOpacity style={styles.btn} disabled={loading}>
            <Text style={styles.btnText}>
              {!loading ? 'Signup' : 'Creating...'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.sub}>A verification code was sent to {email}</Text>
          <TextInput
            style={styles.input}
            placeholder="Verification code"
            onChangeText={setCode}
            value={code}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.btn} disabled={loading}>
            <Text style={styles.btnText}>
              {!loading ? 'Confirm' : 'Verifing...'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.link}>Already have an account?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  sub: { color: '#555', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
  },
  btn: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, color: '#2563EB' },
});
export default RegisterScreen;
