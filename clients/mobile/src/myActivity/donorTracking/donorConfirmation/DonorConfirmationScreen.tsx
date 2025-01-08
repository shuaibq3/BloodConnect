import { View, StyleSheet, Text, ScrollView } from 'react-native'
import DonorCard from '../../../components/donation/DonorCard'
import useDonorConfirmation from './useDonorConfirmation'
import { useTheme } from '../../../setup/theme/hooks/useTheme'
import { Theme } from '../../../setup/theme'
import { Button } from '../../../components/button/Button'
import { DonorItem } from '../../myPosts/donorResponses/DonorResponses'
import StateAwareRenderer from '../../../components/StateAwareRenderer'

const DonorConfirmationScreen = () => {
  const styles = createStyles(useTheme())
  const { donors, selectDonorHandler, selectedDonor, executeFunction, loading, error } = useDonorConfirmation()

  const ViewToRender = () =>
    <View style={styles.container}>
      <Text style={styles.responseText}>Select the donors who have donated blood</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {donors.map((donor: DonorItem) => (
          <DonorCard
            key={donor.donorId}
            name={donor.donorName}
            isSelected={selectedDonor.includes(donor.donorId)}
            onSelect={() => selectDonorHandler(donor.donorId)}
          />
        ))}
      </ScrollView>

      <View style={styles.footerContainer}>
        {error !== null && <Text style={styles.errorText}>{error}</Text>}
        <Button text="Confirm" onPress={() => executeFunction(selectedDonor)} loading={loading} disabled={loading} />
      </View>
    </View>

  return <StateAwareRenderer errorMessage={error} data={donors} ViewComponent={ViewToRender} showEmptyMessageForEmptyArray={true} />
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white
  },
  scrollContainer: {
    paddingBottom: 16
  },
  responseText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  footerContainer: {
    marginTop: 16
  },
  errorText: {
    color: theme.colors.primary,
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center'
  }
})

export default DonorConfirmationScreen
