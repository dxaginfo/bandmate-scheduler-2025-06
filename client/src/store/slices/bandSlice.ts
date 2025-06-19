import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Band {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  createdBy: string;
  BandMember?: {
    role: string;
    instrument: string;
  };
  members?: any[];
}

interface BandState {
  bands: Band[];
  currentBand: Band | null;
  loading: boolean;
  error: string | null;
}

const initialState: BandState = {
  bands: [],
  currentBand: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserBands = createAsyncThunk(
  'bands/fetchUserBands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bands');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bands');
    }
  }
);

export const fetchBandById = createAsyncThunk(
  'bands/fetchBandById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bands/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch band');
    }
  }
);

export const createBand = createAsyncThunk(
  'bands/createBand',
  async (bandData: Partial<Band>, { rejectWithValue }) => {
    try {
      const response = await api.post('/bands', bandData);
      return response.data.band;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create band');
    }
  }
);

export const updateBand = createAsyncThunk(
  'bands/updateBand',
  async ({ id, data }: { id: string; data: Partial<Band> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bands/${id}`, data);
      return response.data.band;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update band');
    }
  }
);

// Slice
const bandSlice = createSlice({
  name: 'bands',
  initialState,
  reducers: {
    clearBandError: (state) => {
      state.error = null;
    },
    clearCurrentBand: (state) => {
      state.currentBand = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user bands
    builder.addCase(fetchUserBands.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserBands.fulfilled, (state, action) => {
      state.loading = false;
      state.bands = action.payload;
    });
    builder.addCase(fetchUserBands.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch band by ID
    builder.addCase(fetchBandById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBandById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentBand = action.payload;
    });
    builder.addCase(fetchBandById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create band
    builder.addCase(createBand.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBand.fulfilled, (state, action) => {
      state.loading = false;
      state.bands.push(action.payload);
    });
    builder.addCase(createBand.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update band
    builder.addCase(updateBand.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateBand.fulfilled, (state, action) => {
      state.loading = false;
      state.currentBand = action.payload;
      const index = state.bands.findIndex(band => band.id === action.payload.id);
      if (index !== -1) {
        state.bands[index] = action.payload;
      }
    });
    builder.addCase(updateBand.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearBandError, clearCurrentBand } = bandSlice.actions;
export default bandSlice.reducer;