export type LoginAuthResponse = {
  accessToken: string;
  tokenType: string;
  role: string;
};

export type LoginForm = {
  username: string;
  password: string;
}