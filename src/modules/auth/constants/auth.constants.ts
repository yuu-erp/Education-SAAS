export const AUTH_MODULE_NAME = 'AuthModule';

export const TOKEN_TYPES = {
  ACCESS: 'ACCESS_TOKEN',
  REFRESH: 'REFRESH_TOKEN',
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_FAILED: 'Invalid credentials',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  PASSWORD_RESET: 'Password reset successful',
  TOKEN_REFRESHED: 'Token refreshed successfully',
} as const;
