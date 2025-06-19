import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { Group as GroupIcon, Event as EventIcon, Add as AddIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { fetchUserBands } from '../store/slices/bandSlice';
import { fetchUpcomingRehearsals } from '../store/slices/rehearsalSlice';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bands, loading: bandsLoading } = useSelector((state: RootState) => state.bands);
  const { upcomingRehearsals, loading: rehearsalsLoading } = useSelector(
    (state: RootState) => state.rehearsals
  );
  
  useEffect(() => {
    dispatch(fetchUserBands());
    dispatch(fetchUpcomingRehearsals());
  }, [dispatch]);
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.firstName}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Bands Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">My Bands</Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {bandsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : bands.length > 0 ? (
                <List>
                  {bands.slice(0, 5).map((band) => (
                    <ListItem key={band.id} disablePadding>
                      <ListItemText
                        primary={band.name}
                        secondary={`Role: ${band.BandMember?.role || 'Member'}`}
                      />
                      <Button
                        component={RouterLink}
                        to={`/bands/${band.id}`}
                        size="small"
                        variant="outlined"
                      >
                        View
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  You are not a member of any bands yet.
                </Typography>
              )}
            </CardContent>
            
            <CardActions>
              <Button
                component={RouterLink}
                to="/bands"
                size="small"
                sx={{ mr: 1 }}
              >
                View All
              </Button>
              <Button
                component={RouterLink}
                to="/bands/create"
                size="small"
                startIcon={<AddIcon />}
                variant="contained"
              >
                Create New
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Rehearsals Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Upcoming Rehearsals</Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {rehearsalsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : upcomingRehearsals.length > 0 ? (
                <List>
                  {upcomingRehearsals.slice(0, 5).map((rehearsal) => (
                    <ListItem key={rehearsal.id} disablePadding>
                      <ListItemText
                        primary={rehearsal.title}
                        secondary={
                          <>
                            {format(new Date(rehearsal.startTime), 'MMM d, yyyy')}
                            {' • '}
                            {format(new Date(rehearsal.startTime), 'h:mm a')} - 
                            {format(new Date(rehearsal.endTime), 'h:mm a')}
                            {' • '}
                            {rehearsal.band?.name}
                          </>
                        }
                      />
                      <Button
                        component={RouterLink}
                        to={`/rehearsals/${rehearsal.id}`}
                        size="small"
                        variant="outlined"
                      >
                        View
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No upcoming rehearsals scheduled.
                </Typography>
              )}
            </CardContent>
            
            <CardActions>
              <Button
                component={RouterLink}
                to="/rehearsals"
                size="small"
                sx={{ mr: 1 }}
              >
                View All
              </Button>
              <Button
                component={RouterLink}
                to="/rehearsals/create"
                size="small"
                startIcon={<AddIcon />}
                variant="contained"
              >
                Schedule New
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;