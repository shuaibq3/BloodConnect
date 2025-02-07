import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import dayjs from 'dayjs'

const currentYear = dayjs().year()

const AboutPage: React.FC = () => {
  const [displayedText, setDisplayedText] = useState<string>('')

  const fullText = 'Tries to improve the blood donation process through connecting donors, blood banks and existing organizations who are assisting finding donors in times of need, by providing a platform.'
  const typingSpeed = 5

  useEffect(() => {
    let index = 0
    const intervalId = setInterval(() => {
      setDisplayedText((prevText) => prevText + fullText[index])
      index += 1
      if (index === fullText.length) {
        clearInterval(intervalId)
      }
    }, typingSpeed)

    return () => { clearInterval(intervalId) }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.logoTitleContainer}>
        <Image source={require('../../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>BloodConnect</Text>
      </View>

      <View style={styles.fixedDescriptionContainer}>
        <Text style={styles.description}>{displayedText}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023-{currentYear}</Text>
        <Image source={require('../../../assets/craftsmen-logo.png')} style={styles.companyLogo} />
        <Text style={styles.footerText}>Craftsmen Ltd.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF'
  },

  logoTitleContainer: {
    position: 'absolute',
    top: 80,
    alignItems: 'center',
    zIndex: 1
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: '#FF4D4D'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4D4D',
    marginTop: 10
  },

  fixedDescriptionContainer: {
    position: 'absolute',
    top: 320,
    left: 20,
    right: 20,
    zIndex: 0
  },
  description: {
    fontSize: 20,
    textAlign: 'justify',
    color: '#333'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 5
  },
  companyLogo: {
    width: 20,
    height: 20
  }
})

export default AboutPage
