import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive design system
const isTablet = screenWidth >= 768;
const isSmallPhone = screenWidth < 380;

// Dark Blue/Purple Gradient Theme matching web app
const colors = {
  primary: '#7C3AED', // Purple
  primaryLight: '#C4B5FD',
  secondary: '#3B82F6', // Blue
  background: '#1a1b3a', // Dark background
  backgroundGradient: ['#1a1b3a', '#2d1b69', '#4c1d95', '#7c3aed'], // Dark blue to purple gradient
  text: '#ffffff',
  textDark: '#1a1b3a',
  textMuted: '#9CA3AF',
  border: '#374151',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  accent: '#EC4899', // Pink accent
};

interface Feature {
  icon: string;
  title: string;
  description: string;
  action: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: isTablet ? 32 : isSmallPhone ? 24 : 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: isTablet ? 18 : isSmallPhone ? 14 : 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 22,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : isSmallPhone ? 18 : 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: isTablet ? 24 : 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIcon: {
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 28 : 24,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: isTablet ? 20 : isSmallPhone ? 16 : 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: isTablet ? 16 : isSmallPhone ? 13 : 14,
    color: colors.textMuted,
    lineHeight: isTablet ? 24 : 20,
  },
  actionButton: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: isTablet ? 32 : 24,
    paddingVertical: isTablet ? 18 : 16,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: isTablet ? 32 : 24,
    paddingVertical: isTablet ? 16 : 14,
  },
  buttonText: {
    fontSize: isTablet ? 18 : isSmallPhone ? 14 : 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: colors.text,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: isTablet ? 24 : 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: isTablet ? 150 : 120,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: isTablet ? 28 : isSmallPhone ? 20 : 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isTablet ? 14 : isSmallPhone ? 11 : 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.4,
    opacity: 0.1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  networkBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  networkBadgeText: {
    fontSize: isTablet ? 14 : 12,
    color: '#1B4D3E',
    fontWeight: '600',
  },
  howItWorksContainer: {
    marginTop: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  stepNumber: {
    width: isTablet ? 40 : 36,
    height: isTablet ? 40 : 36,
    borderRadius: isTablet ? 20 : 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: isTablet ? 18 : isSmallPhone ? 14 : 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: isTablet ? 14 : isSmallPhone ? 12 : 13,
    color: colors.textMuted,
    lineHeight: isTablet ? 20 : 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerText: {
    fontSize: isTablet ? 14 : 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: isTablet ? 20 : 16,
  },
});

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  onPress, 
  animationDelay = 0 
}: {
  icon: string
  title: string
  description: string
  onPress?: () => void
  animationDelay?: number
}) => {
  const [fadeAnim] = useState(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: animationDelay,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View style={[{ opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.featureCard}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.featureIcon}>
          <Ionicons 
            name={icon as any} 
            size={isTablet ? 28 : 24} 
            color={colors.primary} 
          />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const ActionButton = ({ 
  title, 
  icon, 
  onPress, 
  type = 'primary' 
}: {
  title: string
  icon: string
  onPress: () => void
  type?: 'primary' | 'secondary'
}) => {
  const [scaleAnim] = useState(new Animated.Value(1))

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Animated.View style={[styles.actionButton, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={type === 'primary' ? styles.primaryButton : styles.secondaryButton}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.buttonContent}>
          <Ionicons 
            name={icon as any} 
            size={isTablet ? 22 : 18} 
            color={type === 'primary' ? '#fff' : colors.text}
            style={styles.buttonIcon}
          />
          <Text style={[
            styles.buttonText,
            type === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText
          ]}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1500);
  }, []);

  const handleCreateBill = () => {
    // Navigate to create bill screen or open web link
    Linking.openURL('mantlepay://create');
  };

  const handleScanQR = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        // Navigate to QR scanner or open web link
        Linking.openURL('mantlepay://scan');
      } else {
        // Fallback to web version
        Linking.openURL('https://explorer.sepolia.mantle.xyz');
      }
    } catch (error) {
      console.log('Camera permission error:', error);
      Linking.openURL('https://explorer.sepolia.mantle.xyz');
    }
  };

  const handleViewBills = () => {
    Linking.openURL('mantlepay://bills');
  };

  const handleSettings = () => {
    Linking.openURL('mantlepay://settings');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B4D3E" />
        <Text style={{ 
          marginTop: 16, 
          fontSize: isTablet ? 18 : 16, 
          color: '#64748B',
          fontWeight: '600'
        }}>
          Loading Ezpay...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#f8fffe"
        translucent={false}
      />
      
      <LinearGradient
        colors={['#E8F5F0', '#F0FDF4', '#F8FFFE']}
        style={styles.gradientBackground}
      />

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === 'ios'}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.networkBadge}>
              <Text style={styles.networkBadgeText}>🔗 Powered by Mantle L2</Text>
            </View>
            <Text style={styles.headerTitle}>Ezpay</Text>
            <Text style={styles.headerSubtitle}>
              Digital Payment System on Blockchain{'\n'}
              Fast, Secure, and Low Fees
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <ActionButton
              title="Create New Bill"
              icon="add-circle"
              onPress={handleCreateBill}
              type="primary"
            />
            <ActionButton
              title="Scan QR Code"
              icon="qr-code"
              onPress={handleScanQR}
              type="secondary"
            />
          </View>

          {/* Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Impressive Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>1000+</Text>
                  <Text style={styles.statLabel}>Users</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>5000+</Text>
                  <Text style={styles.statLabel}>Bills Created</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>99.9%</Text>
                  <Text style={styles.statLabel}>Security</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{'< 3s'}</Text>
                  <Text style={styles.statLabel}>Transfer Time</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <FeatureCard
              icon="shield-checkmark"
              title="High Security"
              description="Uses audited Blockchain technology and Smart Contracts for maximum security"
              animationDelay={100}
            />
            <FeatureCard
              icon="flash"
              title="Lightning Fast"
              description="Transactions complete within seconds using Mantle L2 technology"
              animationDelay={200}
            />
            <FeatureCard
              icon="wallet"
              title="Low Fees"
              description="Save on transaction fees with Layer 2 scaling technology"
              animationDelay={300}
            />
            <FeatureCard
              icon="qr-code"
              title="Easy to Use"
              description="Simply scan QR Code to make instant payments"
              animationDelay={400}
            />
          </View>

          {/* How it works */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.howItWorksContainer}>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Create Bill</Text>
                  <Text style={styles.stepDescription}>
                    Create a payment bill with the desired QR Code
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Share QR Code</Text>
                  <Text style={styles.stepDescription}>
                    Share the QR Code with the person who needs to pay
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Receive Payment</Text>
                  <Text style={styles.stepDescription}>
                    Receive money instantly via Mantle L2 with no fees
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Additional Actions */}
          <View style={styles.section}>
            <ActionButton
              title="View All Bills"
              icon="list"
              onPress={handleViewBills}
              type="secondary"
            />
            <ActionButton
              title="Settings"
              icon="settings"
              onPress={handleSettings}
              type="secondary"
            />
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Ezpay • Powered by Mantle L2{'\n'}
          Version 1.0.0 • Terms of Use & Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
} 