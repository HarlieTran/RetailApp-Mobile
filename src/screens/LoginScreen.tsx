import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRetailApp} from '../context/AppContext';
import {theme} from '../theme/tokens';

export const LoginScreen = () => {
  const {signIn} = useRetailApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = () => {
    const success = signIn(email, password);

    if (!success) {
      setError('Enter both email and password to continue.');
      return;
    }

    setError('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={styles.container}>
          <View>
            <View style={styles.topRow}>
              <Text style={styles.backLabel}>{'<'}</Text>
              <Text style={styles.link}>Create an Account</Text>
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.title}>Welcome back,</Text>
              <Text style={styles.subtitle}>
                Enter your e-mail account and password to browse iFashion
                collection
              </Text>
            </View>

            <View style={styles.form}>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={theme.colors.mutedText}
                style={styles.input}
                value={email}
              />
              <TextInput
                autoCapitalize="none"
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={theme.colors.mutedText}
                secureTextEntry
                style={styles.input}
                value={password}
              />

              <View style={styles.metaRow}>
                <Pressable
                  onPress={() => setStaySignedIn(previous => !previous)}
                  style={styles.checkboxRow}>
                  <View
                    style={[
                      styles.checkbox,
                      staySignedIn ? styles.checkboxChecked : null,
                    ]}>
                    {staySignedIn ? <Text style={styles.checkboxMark}>x</Text> : null}
                  </View>
                  <Text style={styles.metaText}>Stay Signed In</Text>
                </Pressable>
                <Text style={styles.metaLink}>Forgot Password?</Text>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.terms}>
              By signing in you accept our Terms & Condition and privacy policy.
            </Text>

            <Pressable onPress={handleLogin} style={styles.primaryButton}>
              <Text style={styles.primaryButtonLabel}>Login</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 18,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backLabel: {
    fontSize: 22,
    color: '#c3beb5',
  },
  link: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  heroCopy: {
    marginTop: 28,
  },
  title: {
    fontSize: 31,
    lineHeight: 36,
    color: theme.colors.text,
    fontFamily: theme.typography.hero,
  },
  subtitle: {
    marginTop: 10,
    maxWidth: 220,
    fontSize: 11,
    lineHeight: 16,
    color: theme.colors.mutedText,
  },
  form: {
    marginTop: 34,
    gap: 12,
  },
  input: {
    height: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e8e4dd',
    paddingHorizontal: 10,
    fontSize: 11,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
  },
  checkboxChecked: {
    backgroundColor: '#fff9ee',
  },
  checkboxMark: {
    fontSize: 9,
    color: theme.colors.accent,
    fontWeight: '700',
  },
  metaText: {
    fontSize: 10,
    color: theme.colors.mutedText,
  },
  metaLink: {
    fontSize: 10,
    color: theme.colors.mutedText,
  },
  error: {
    color: theme.colors.danger,
    fontSize: 11,
  },
  footer: {
    gap: 14,
  },
  terms: {
    textAlign: 'center',
    color: '#b4ada3',
    fontSize: 9,
    lineHeight: 13,
    paddingHorizontal: 30,
  },
  primaryButton: {
    width: '84%',
    height: 33,
    borderRadius: 5,
    backgroundColor: theme.colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  primaryButtonLabel: {
    color: theme.colors.card,
    fontSize: 12,
    fontWeight: '700',
  },
});
