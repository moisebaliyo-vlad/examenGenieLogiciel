import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi, usersApi, vendeursApi } from '../../services/api';

interface AuthState {
  token: string | null;
  user: any | null;
  role: 'admin' | 'agent' | 'vendeur' | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  role: localStorage.getItem('role') as any || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ identifier, password }: any, { rejectWithValue }) => {
    try {
      const response = await authApi.login(identifier, password);
      const user = await usersApi.getCurrentUser(response.access_token);
      const role = user.is_admin ? 'admin' : 'agent';
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role);
      
      return { token: response.access_token, user, role };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Une erreur est survenue');
    }
  }
);

export const loginVendeur = createAsyncThunk(
  'auth/loginVendeur',
  async (identifiantNational: string, { rejectWithValue }) => {
    try {
      const vendeur = await vendeursApi.login(identifiantNational);
      const role = 'vendeur';
      
      localStorage.setItem('user', JSON.stringify(vendeur));
      localStorage.setItem('role', role);
      
      return { user: vendeur, role };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Identifiant national introuvable');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string | null }>) => {
      state.user = action.payload.user;
      if (action.payload.token) state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginVendeur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginVendeur.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(loginVendeur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, loginSuccess, clearError } = authSlice.actions;
export default authSlice.reducer;
