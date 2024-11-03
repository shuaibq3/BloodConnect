import { Text, StyleSheet, View } from 'react-native'
import { useTheme } from '../../../setup/theme/hooks/useTheme'
import { Theme } from '../../../setup/theme'
import { Button } from '../../../components/button/Button'
import AuthLayout from '../../AuthLayout'
import { Input } from '../../../components/inputElement/Input'
import { useForgotPassword } from '../hooks/useForgotPassword'

export default function ForgotPassword(): JSX.Element {
  const styles = createStyles(useTheme())
  const { credentials, handleInputChange, errors, isButtonDisabled, handleForgotPassword, error, loading } = useForgotPassword()

  return (
    <AuthLayout>
      <Input
        name="email"
        label="Email"
        value={credentials.email}
        onChangeText={handleInputChange}
        placeholder="example@gmail.com"
        keyboardType="default"
        error={errors.email}
      />
      <View style={styles.errorContainer}>
        {error !== '' && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={{ marginTop: 15 }}>
        <Button text="Continue" onPress={handleForgotPassword} disabled={isButtonDisabled} loading={loading} />
      </View>
    </AuthLayout>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  errorContainer: {
    height: 40
  },
  error: {
    paddingVertical: 10,
    color: theme.colors.primary,
    fontSize: theme.typography.errorFontSize,
    textAlign: 'center'
  }
})
