// Auth Context
import { createContext } from 'react';

const AuthContext = createContext<any>({
  token: null,
  setToken: () => {},
});

export default AuthContext;
