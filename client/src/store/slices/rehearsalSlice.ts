import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Rehearsal {
  id: string;
  bandId: string;
  venueId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrencePattern?: any;
  createdBy: string;
  band?: {
    id: string;
    name: string;
  };
  venue?: {
    id: string;
    name: string;
    address?: string;
  };
  attendances?: any[];
}

interface RehearsalState {
  rehearsals: Rehearsal[];
  upcomingRehearsals: Rehearsal[];
  currentRehearsal: Rehearsal | null;
  loading: boolean;
  error: string | null;
}

const initialState: RehearsalState = {
  rehearsals: [],
  upcomingRehearsals: [],
  currentRehearsal: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBandRehearsals = createAsyncThunk(
  'rehearsals/fetchBandRehearsals',
  async (bandId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/rehearsals/band/${bandId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rehearsals');
    }
  }
);

export const fetchUpcomingRehearsals = createAsyncThunk(
  'rehearsals/fetchUpcomingRehearsals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/rehearsals?upcoming=true');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming rehearsals');
    }
  }
);

export const fetchRehearsalById = createAsyncThunk(
  'rehearsals/fetchRehearsalById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/rehearsals/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rehearsal');
    }
  }
);

export const createRehearsal = createAsyncThunk(
  'rehearsals/createRehearsal',
  async (rehearsalData: Partial<Rehearsal>, { rejectWithValue }) => {
    try {
      const response = await api.post('/rehearsals', rehearsalData);
      return response.data.rehearsal;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create rehearsal');
    }
  }
);

export const updateRehearsal = createAsyncThunk(
  'rehearsals/updateRehearsal',
  async ({ id, data }: { id: string; data: Partial<Rehearsal> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/rehearsals/${id}`, data);
      return response.data.rehearsal;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update rehearsal');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'rehearsals/updateAttendance',
  async ({ id, status, note }: { id: string; status: string; note?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/rehearsals/${id}/attendance`, { status, note });
      return { rehearsalId: id, attendance: response.data.attendance };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update attendance');
    }
  }
);

// Slice
const rehearsalSlice = createSlice({
  name: 'rehearsals',
  initialState,
  reducers: {
    clearRehearsalError: (state) => {
      state.error = null;
    },
    clearCurrentRehearsal: (state) => {
      state.currentRehearsal = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch band rehearsals
    builder.addCase(fetchBandRehearsals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBandRehearsals.fulfilled, (state, action) => {
      state.loading = false;
      state.rehearsals = action.payload;
    });
    builder.addCase(fetchBandRehearsals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch upcoming rehearsals
    builder.addCase(fetchUpcomingRehearsals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUpcomingRehearsals.fulfilled, (state, action) => {
      state.loading = false;
      state.upcomingRehearsals = action.payload;
    });
    builder.addCase(fetchUpcomingRehearsals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch rehearsal by ID
    builder.addCase(fetchRehearsalById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRehearsalById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentRehearsal = action.payload;
    });
    builder.addCase(fetchRehearsalById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create rehearsal
    builder.addCase(createRehearsal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRehearsal.fulfilled, (state, action) => {
      state.loading = false;
      state.rehearsals.push(action.payload);
      if (new Date(action.payload.startTime) >= new Date()) {
        state.upcomingRehearsals.push(action.payload);
        // Sort upcoming rehearsals by date
        state.upcomingRehearsals.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      }
    });
    builder.addCase(createRehearsal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update rehearsal
    builder.addCase(updateRehearsal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRehearsal.fulfilled, (state, action) => {
      state.loading = false;
      state.currentRehearsal = action.payload;
      
      // Update in rehearsals array
      const index = state.rehearsals.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.rehearsals[index] = action.payload;
      }
      
      // Update in upcoming rehearsals array if present
      const upcomingIndex = state.upcomingRehearsals.findIndex(r => r.id === action.payload.id);
      if (upcomingIndex !== -1) {
        if (new Date(action.payload.startTime) >= new Date()) {
          state.upcomingRehearsals[upcomingIndex] = action.payload;
          // Re-sort upcoming rehearsals
          state.upcomingRehearsals.sort((a, b) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        } else {
          // Remove from upcoming if date is in the past
          state.upcomingRehearsals.splice(upcomingIndex, 1);
        }
      } else if (new Date(action.payload.startTime) >= new Date()) {
        // Add to upcoming if not present and date is in the future
        state.upcomingRehearsals.push(action.payload);
        state.upcomingRehearsals.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      }
    });
    builder.addCase(updateRehearsal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update attendance
    builder.addCase(updateAttendance.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAttendance.fulfilled, (state, action) => {
      state.loading = false;
      
      // Update attendance in current rehearsal if loaded
      if (state.currentRehearsal && state.currentRehearsal.id === action.payload.rehearsalId) {
        const attendanceIndex = state.currentRehearsal.attendances?.findIndex(
          a => a.userId === action.payload.attendance.userId
        );
        
        if (attendanceIndex !== -1 && state.currentRehearsal.attendances) {
          state.currentRehearsal.attendances[attendanceIndex] = action.payload.attendance;
        } else if (state.currentRehearsal.attendances) {
          state.currentRehearsal.attendances.push(action.payload.attendance);
        }
      }
    });
    builder.addCase(updateAttendance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearRehearsalError, clearCurrentRehearsal } = rehearsalSlice.actions;
export default rehearsalSlice.reducer;