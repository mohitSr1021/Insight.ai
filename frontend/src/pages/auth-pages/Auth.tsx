import { useEffect, useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { authLogin, authSignup } from '../../redux/api/authAPI';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store/rootStore';
import { AuthFormValues } from './auth.types';
import PopupBox from '../../components/Popup/PopupBox';


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { isLoading, error } = useAppSelector((state) => state.auth) as { isLoading: boolean; error: { message: string } | string | null };

  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem('firstVisit');
    if (!isFirstVisit) {
      setShowPopup(true);
      sessionStorage.setItem('firstVisit', 'true');
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  // Password validation for signup
  const validatePassword = ({ getFieldValue }: { getFieldValue: (field: string) => string }) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue('userPassword') === value) {
        return Promise.resolve();
      }
      return Promise.reject('The two passwords do not match!');
    },
  });


  const onSubmit = async (values: AuthFormValues) => {
    try {
      const actionThunk = isLogin ? authLogin(values) : authSignup(values);
      await dispatch(actionThunk).unwrap();
      message.success(`Successfully ${isLogin ? "logged in" : "signed up"}!`);
      navigate("/home");
    } catch (error: any) {
      message.error(error?.message || `Failed to ${isLogin ? "login" : "sign up"}`);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <PopupBox
        show={showPopup}
        onClose={closePopup}
        title="Welcome to My Project"
        content="This is an ongoing project focused on learning and development. Some features may be under construction."
      />
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="bg-purple-600 p-3 rounded-2xl">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-lg font-bold italic font-sans bg-gradient-to-l from-blue-400 to-violet-400 via-violet-400 bg-clip-text text-transparent">
            Insight.AI
          </h1>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin
              ? 'Please enter your details to sign in'
              : 'Please enter your details to get started'}
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {typeof error === 'string' ? error : error.message}
          </div>
        )}

        <Form<AuthFormValues>
          name="auth-form"
          onFinish={onSubmit}
          layout="vertical"
          className="mt-8 space-y-6"
        >
          {!isLogin && (
            <Form.Item
              name="userName"
              rules={[
                { required: true, message: 'Please input your username!' },
                { min: 3, message: 'Username must be at least 3 characters!' }
              ]}
            >
              <Input
                prefix={<User className="w-5 h-5 text-gray-400" />}
                placeholder="Username"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>
          )}

          <Form.Item
            name="userEmail"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<Mail className="w-5 h-5 text-gray-400" />}
              placeholder="Email"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="userPassword"
            rules={[
              { required: true, message: 'Please enter your password!' },
              {
                validator: async (_, value) => {
                  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (!passwordRegex.test(value)) {
                    return Promise.reject(
                      'Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
                    );
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input.Password
              prefix={<Lock className="w-5 h-5 text-gray-400" />}
              placeholder="Password"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          {!isLogin && (
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                validatePassword
              ]}
            >
              <Input.Password
                prefix={<Lock className="w-5 h-5 text-gray-400" />}
                placeholder="Confirm Password"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>
          )}

          <div className="space-y-4">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center"
              loading={isLoading}
            >
              <span className="mr-2">
                {isLogin ? 'Sign in' : 'Create account'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-purple-600 hover:text-purple-500 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;