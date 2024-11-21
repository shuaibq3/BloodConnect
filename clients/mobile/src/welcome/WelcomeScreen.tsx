import React from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native'
import { WelcomeScreenNavigationProp } from '../setup/navigation/navigationTypes'
import { SCREENS } from '../setup/constant/screens'
import { Button } from '../components/button/Button'
import { useTheme } from '../setup/theme/hooks/useTheme'
import { Theme } from '../setup/theme'

export interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

const Welcome = ({ navigation }: WelcomeScreenProps) => {
  const styles = createStyles(useTheme())
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/bloodBag.png')} style={styles.image} />

      <Text style={styles.title}>A common platform for blood donor and seeker</Text>
      <Text style={styles.subtitle}>
        Blood searching and blood donating is now easier with BloodConnect app
      </Text>

      <Button text='Create account' onPress={() => { navigation.navigate(SCREENS.REGISTER) }} />
      <Button text='Log in' onPress={() => { navigation.navigate(SCREENS.LOGIN) }} buttonStyle={styles.loginButton} textStyle={styles.loginText} />
    </View>
  )
}

const createStyles = (theme: Theme) => {
  const { width } = useWindowDimensions()
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      backgroundColor: theme.colors.white
    },
    image: {
      width: width * 0.4,
      height: undefined,
      aspectRatio: 1,
      alignSelf: 'center',
      marginBottom: 30
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 10
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.darkGrey,
      textAlign: 'center',
      marginBottom: 40
    },
    loginButton: {
      borderColor: theme.colors.lightGrey,
      borderWidth: 1,
      backgroundColor: theme.colors.white
    },
    loginText: {
      color: theme.colors.textPrimary
    }
  })
}

export default Welcome
