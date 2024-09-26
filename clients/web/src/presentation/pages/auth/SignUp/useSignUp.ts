import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@client-commons/services/authService';
import useAuthenticatedUser from '@client-commons/hooks/useAuthenticatedUser';
import { validatePassword } from '@client-commons/utils/validationUtils';
import { toastHideDisappearTime } from '../../../../constants/common';
import { DashboardPath, LoginPath } from '../../../../constants/routeConsts';

type UseSignUpReturnType = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  organizationName: string;
  setOrganizationName: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  handleSignUp: () => Promise<void>;
  toastVisible: boolean;
  toastMsg: string;
  toastClass: string;
  passwordValidation: ReturnType<typeof validatePassword>;
  loading: boolean;
};

export const useSignUp = (): UseSignUpReturnType => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+88');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastClass, setToastClass] = useState('');
  const { user } = useAuthenticatedUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user != null) {
      navigate(DashboardPath);
    }
  }, [user, navigate]);

  const handleError = (error: string): void => {
    setToastMsg(error);
    setToastClass('alert-error');
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, toastHideDisappearTime);
  };

  const handleSignUp = async (): Promise<void> => {
    const { passwordResults, confirmPasswordResult } = validatePassword(
      password,
      confirmPassword
    );

    const isPasswordValid = passwordResults.every((result) => result.isValid);

    if (!isPasswordValid || !confirmPasswordResult.isValid) {
      handleError('Please fix the validation errors.');
      return;
    }

    try {
      setLoading(true);

      const resp = await authService.registerOrganization({
        email,
        password,
        organizationName,
        phoneNumber,
      });

      if (resp.status === 201) {
        navigate(LoginPath);
      }
    } catch (error: any) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(password, confirmPassword);

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    organizationName,
    setOrganizationName,
    phoneNumber,
    setPhoneNumber,
    handleSignUp,
    toastVisible,
    toastMsg,
    toastClass,
    passwordValidation,
    loading,
  };
};
