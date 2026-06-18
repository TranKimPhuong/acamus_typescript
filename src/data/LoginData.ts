export interface LoginCredentials {
  username: string;
  password: string;
  description?: string;
}

export const VALID_USER: LoginCredentials = {
  username: 'phuong.tran',
  password: 'Admin@123',
  description: 'Valid admin account',
};

export const INVALID_CREDENTIALS: LoginCredentials[] = [
  {
    username: 'wrong_user',
    password: 'wrong_pass',
    description: 'Wrong username and password',
  },
  {
    username: 'phuong.tran',
    password: 'wrongpassword',
    description: 'Valid username with wrong password',
  },
  {
    username: 'invalid_user',
    password: 'Admin@123',
    description: 'Wrong username with valid password',
  },
];

export const EMPTY_CREDENTIALS: LoginCredentials[] = [
  {
    username: '',
    password: '',
    description: 'Both fields empty',
  },
  {
    username: 'phuong.tran',
    password: '',
    description: 'Password field empty',
  },
  {
    username: '',
    password: 'Admin@123',
    description: 'Username field empty',
  },
];

export const SPECIAL_CHAR_CREDENTIALS: LoginCredentials[] = [
  {
    username: "'phuong.tran' OR '1'='1'",
    password: 'anything',
    description: 'SQL injection attempt in username',
  },
  {
    username: '<script>alert(1)</script>',
    password: 'anything',
    description: 'XSS attempt in username',
  },
];
