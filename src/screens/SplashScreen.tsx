import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const heartScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Heart beating animation
    const heartbeat = Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.delay(500),
    ]);

    Animated.loop(heartbeat).start();

    // Navigate to UserSelection after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('UserSelection');
    }, 3500);

    return () => clearTimeout(timer);
  }, [heartScale, fadeAnim, slideAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        {/* Heart Icon with beat animation */}
        <Animated.View
          style={[
            styles.heartContainer,
            {
              transform: [{scale: heartScale}],
            },
          ]}>
          <Icon name="favorite" size={80} color="#e74c3c" />
        </Animated.View>

        {/* App Name */}
        <Text style={styles.appName}>Health Pressure</Text>
        <Text style={styles.tagline}>Monitor Your Heart Health</Text>

        {/* Pulse line decoration */}
        <View style={styles.pulseLineContainer}>
          <View style={styles.pulseLine} />
          <Icon name="favorite" size={16} color="#3498db" />
          <View style={styles.pulseLine} />
        </View>
      </Animated.View>

      {/* Copyright Footer */}
      <Animated.View style={[styles.footer, {opacity: fadeAnim}]}>
        <View style={styles.divider} />
        <Text style={styles.copyright}>© 2025 Bruno Amaral</Text>
        <Text style={styles.rights}>All Rights Reserved</Text>
        <Text style={styles.madeWith}>
          Made with <Icon name="favorite" size={12} color="#e74c3c" /> by Bruno Amaral
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartContainer: {
    marginBottom: 30,
    shadowColor: '#e74c3c',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    fontWeight: '300',
  },
  pulseLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pulseLine: {
    width: 60,
    height: 2,
    backgroundColor: '#3498db',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  divider: {
    width: 100,
    height: 2,
    backgroundColor: '#ecf0f1',
    marginBottom: 15,
    borderRadius: 2,
  },
  copyright: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 4,
  },
  rights: {
    fontSize: 11,
    color: '#95a5a6',
    marginBottom: 8,
  },
  madeWith: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
});

export default SplashScreen;
