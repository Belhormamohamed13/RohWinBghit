import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useState, useRef } from 'react'
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate 
} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../store/authStore'
import { colors, spacing } from '../constants/theme'

const { width } = Dimensions.get('window')

const slides = [
  {
    id: 1,
    title: 'Voyagez économique',
    description: 'Économisez jusqu\'à 70% sur vos trajets en partageant les frais avec d\'autres passagers.',
    icon: '💰',
    color: colors.primary[500],
  },
  {
    id: 2,
    title: 'Sécurité garantie',
    description: 'Conducteurs vérifiés, suivi GPS en temps réel et assistance 24/7 pour votre tranquillité.',
    icon: '🛡️',
    color: colors.secondary[500],
  },
  {
    id: 3,
    title: 'Paiement flexible',
    description: 'Payez en espèces, par CIB, Edahabia ou carte internationale. Le choix vous appartient.',
    icon: '💳',
    color: colors.primary[600],
  },
  {
    id: 4,
    title: 'Prêt à commencer?',
    description: 'Rejoignez des milliers d\'Algériens qui voyagent ensemble chaque jour.',
    icon: '🚀',
    color: colors.secondary[600],
  },
]

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useSharedValue(0)
  const scrollRef = useRef<Animated.ScrollView>(null)
  const navigation = useNavigation()
  const setHasSeenOnboarding = useAuthStore((state) => state.setHasSeenOnboarding)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  const onScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    setCurrentIndex(index)
  }

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      })
    } else {
      setHasSeenOnboarding(true)
    }
  }

  const handleSkip = () => {
    setHasSeenOnboarding(true)
  }

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <Slide key={slide.id} slide={slide} index={index} scrollX={scrollX} />
        ))}
      </Animated.ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Next button */}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: slides[currentIndex].color }]}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>
          {currentIndex === slides.length - 1 ? 'Commencer' : 'Suivant'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

interface SlideProps {
  slide: typeof slides[0]
  index: number
  scrollX: Animated.SharedValue<number>
}

const Slide = ({ slide, index, scrollX }: SlideProps) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    )
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, 50],
      Extrapolate.CLAMP
    )
    return {
      opacity,
      transform: [{ translateY }],
    }
  })

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.slideContent, animatedStyle]}>
        <View style={[styles.iconContainer, { backgroundColor: `${slide.color}20` }]}>
          <Text style={styles.icon}>{slide.icon}</Text>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: colors.dark[500],
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  slideContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark[900],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.dark[500],
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.dark[200],
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors.primary[500],
    width: 24,
  },
  nextButton: {
    marginHorizontal: spacing.xl,
    marginBottom: 40,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
})

export default OnboardingScreen
