export const LOGIN_URL = '/'; 
export const LOGOUT_URL = 'https://sis-qc.sis.flexiapp.cloud/logout';
export const homepageURL = 'https://sis-qc.sis.flexiapp.cloud/?iss=https:%2F%2Fsis-qc-host.sis.flexiapp.cloud%2F';

export const LOGIN_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password!',
  REQUIRED_USERNAME: 'Username is required',
  REQUIRED_PASSWORD: 'Password is required',
  LOGIN_SUCCESS_TITLE: 'Dashboard',
  ACCOUNT_LOCKED: 'Account is locked',
  SESSION_EXPIRED: 'Your session has expired',
} as const;

export const LOGIN_LABELS = {
  USERNAME: 'Username',
  PASSWORD: 'Password',
  LOGIN_BUTTON: 'Login',
  FORGOT_PASSWORD: 'Forgot Password',
} as const;

export const TIMEOUTS = {
  SHORT: 7_000,
  MEDIUM: 15_000,
  LONG: 30_000,
} as const;
