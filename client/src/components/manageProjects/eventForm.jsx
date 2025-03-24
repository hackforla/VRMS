import React from 'react';
import { createClockHours } from '../../utils/createClockHours';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import '../../sass/ManageProjects.scss';

const EventForm = ({
  title,
  formValues,
  formErrors,
  handleInputChange,
  children,
}) => {
  // This creates the clock hours for the form
  const clockHours = createClockHours();

  return (
    <Box className="event-form-box">
      {title && <h3 className="event-form-title">{title}</h3>}
      <FormControl fullWidth>
        <TextField
          required
          helperText={formErrors?.name ? formErrors?.name : ''}
          error={formErrors?.name}
          id="name"
          name="name"
          value={formValues.name}
          label="Event Name:"
          placeholder="Meeting name..."
          onChange={handleInputChange}
        />
      </FormControl>
      <Box className="event-form-row">
        <FormControl fullWidth>
          <InputLabel id="event-type-label">Event Type</InputLabel>
          <Select
            labelId="event-type-label"
            name="eventType"
            value={formValues.eventType}
            label="Event Type"
            onChange={handleInputChange}
          >
            <MenuItem value="Team Meeting">Team Meeting</MenuItem>
            <MenuItem value="Onboarding">Onboarding</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="day-input-label">Day of the Week</InputLabel>
          <Select
            labelId="day-input-label"
            id="day-input"
            name="day"
            value={formValues.day}
            label="Day of the Week"
            onChange={handleInputChange}
          >
            <MenuItem value="0">Sunday</MenuItem>
            <MenuItem value="1">Monday</MenuItem>
            <MenuItem value="2">Tuesday</MenuItem>
            <MenuItem value="3">Wednesday</MenuItem>
            <MenuItem value="4">Thursday</MenuItem>
            <MenuItem value="5">Friday</MenuItem>
            <MenuItem value="6">Saturday</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box className="event-form-row">
        <FormControl fullWidth>
          <InputLabel id="start-time-label">Start Time</InputLabel>
          <Select
            labelId="start-time-label"
            name="startTime"
            value={formValues.startTime}
            label="Start Time"
            onChange={handleInputChange}
          >
            {clockHours.map((value) => {
              return (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="duration-label">Duration</InputLabel>
          <Select
            labelId="duration-label"
            id="duration"
            name="duration"
            value={formValues.duration}
            label="Duration"
            onChange={handleInputChange}
          >
            <MenuItem value=".5">.5</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="1.5">1.5</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="2.5">2.5</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="3.5">3.5</MenuItem>
            <MenuItem value="4">4</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box className="event-form-row">
        <FormControl fullWidth>
          <TextField
            id="Description"
            label="Description"
            variant="outlined"
            name="description"
            fullWidth
            value={formValues.description}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>
      <Box className="event-form-row">
        <FormControl fullWidth>
          <TextField
            required
            helperText={
              formErrors?.videoConferenceLink
                ? formErrors?.videoConferenceLink
                : ''
            }
            error={formErrors?.videoConferenceLink}
            id="Meeting URL"
            label="Meeting URL"
            variant="outlined"
            name="videoConferenceLink"
            fullWidth
            value={formValues.videoConferenceLink}
            onChange={handleInputChange}
          />
        </FormControl>
      </Box>

      {children}
    </Box>
  );
};

export default EventForm;
