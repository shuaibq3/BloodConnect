import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import PostCard from '../../../components/donation/PostCard'
import { useTheme } from '../../../setup/theme/hooks/useTheme'
import useRequestStatus from './useRequestStatus'
import Button from '../../../components/button/Button'
import { Theme } from '../../../setup/theme'
import StateAwareRenderer from '../../../components/StateAwareRenderer'

const RequestStatusScreen = () => {
  const styles = createStyles(useTheme())
  const { bloodRequest, notYetHandler, yesManagedHandler, loading, error } = useRequestStatus()

  const ViewToRender = () =>
    <View style={styles.container}>
      <View>
        <Text style={styles.responseText}>Was the blood managed for this request?</Text>
        <PostCard post={bloodRequest} showButton={false} showDescription showHeader={false} showPostUpdatedOption={false} />
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            text="Not yet"
            buttonStyle={styles.ignoreButton}
            textStyle={styles.buttonTextStyle}
            onPress={notYetHandler} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button text="Yes, managed" onPress={yesManagedHandler} />
        </View>
      </View>
    </View>

  return <StateAwareRenderer loading={loading} errorMessage={error} data={bloodRequest} ViewComponent={ViewToRender} />
}

const createStyles = (theme: Theme): ReturnType<typeof StyleSheet.create> => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white
  },
  ignoreButton: {
    backgroundColor: theme.colors.greyBG,
    flex: 1,
    marginRight: 10,
    color: theme.colors.black
  },
  buttonTextStyle: {
    color: theme.colors.black
  },
  responseText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: theme.colors.lightGrey
  },
  buttonWrapper: {
    flex: 1
  }
})

export default RequestStatusScreen
