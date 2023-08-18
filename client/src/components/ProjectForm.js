import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ReactComponent as PlusIcon } from '../svg/PlusIcon.svg';
import { Redirect } from 'react-router-dom'
import {
  Typography,
  Box,
  Divider,
  TextField,
  InputLabel,
  Button,
  Grid,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useAuth from "../hooks/useAuth" 

/** STYLES
 *  -most TextField and InputLabel styles are controlled by the theme
 *  -a few repeated styles are parked here
 *  -the rest are inline
 */

const StyledButton = styled(Button)(({ theme }) => ({
  width: '150px',
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  width: 'max-content',
  '& .MuiFormControlLabel-label': {
    fontSize: '14px',
  },
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  padding: '0px 0px 0px 0px',
  marginRight: '.5rem',
}));

/**Project Form Component
 * -renders a form for creating and updating a project
 */

// Takes Array, submitForm, isEdit?
export default function ProjectForm({arr, submitForm, isEdit}) {
  //seperate state for the location radio buttons
  const history = useHistory();

  const [locationType, setLocationType] = React.useState('remote');
  const [activeButton, setActiveButton] = React.useState('close');
  const { auth } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ 
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      location: '',
      githubUrl: '',
      slackUrl: '',
      googleDriveUrl: ''
    }
  });

  // // only handles radio button change
  const handleRadioChange = (event) => {
    setLocationType(event.target.value);
  };

  const locationRadios = (
    <Grid item>
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={locationType}
          onChange={handleRadioChange}
          sx={{ mb: 0.5 }}
        >
          <StyledFormControlLabel
            value="remote"
            control={<StyledRadio size="small" />}
            label="Remote"
          />
          <Box sx={{ width: '10px' }} />
          <StyledFormControlLabel
            value="in-person"
            control={<StyledRadio size="small" />}
            label="In-Person"
          />
        </RadioGroup>
      </FormControl>
    </Grid>
  );

  return auth && auth.user ? (
    <Box sx={{ px: 0.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1">Project Management</Typography>
      </Box>
      <Box sx={{ bgcolor: '#F5F5F5' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
              Project Information
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <PlusIcon style={{ marginRight: '7px' }} />
            <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
              {isEdit ? 'edit' : 'Add New Project'}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
        <Box sx={{ py: 2, px: 4 }}>
          <form id="project-form" onSubmit={handleSubmit((data) => {
            submitForm(data)
          })}>
            {arr.map((input) => (
              <Box sx={{ mb: 1 }} key={input.name}>
                <Grid container alignItems="center">
                  <Grid item xs="auto" sx={{ pr: 3 }}>
                    <InputLabel
                      sx={{ width: 'max-content', ml: 0.5, mb: 0.5 }}
                      id={input.name}
                    >
                      {input.label}
                    </InputLabel>
                  </Grid>
                  {input.name === 'location' && locationRadios}
                </Grid>     
                <TextField
                 error={!!errors[input.name]}
                 type={input.type}
                  {...register(input.name,  {required: `${input.name} is required` , 
                  pattern:  input.name === 'location' ? 
                    locationType === 'remote' ? 
                      {value: input.value, message: input.errorMessage} :
                      {value: input.addressValue, message: input.addressError} :
                      {value: input.value, message: input.errorMessage} } )}
                 placeholder={input.placeholder}
                 helperText={`${errors[input.name]?.message || ' '}`}
                />
              </Box>
            ))}
          </form>
        </Box>
      </Box>
      <Box>
        <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
          <Grid item xs="auto">
            <StyledButton
              type="submit"
              form="project-form"
              variant={activeButton === 'save' ? 'contained' : 'secondary'}
            >
              Save
            </StyledButton>
          </Grid>
          <Grid item xs="auto">
            <StyledButton
              component={Link}
              to="/projects"
              variant={activeButton === 'close' ? 'contained' : 'secondary'}
              disabled={activeButton !== 'close'}
            >
              Close
            </StyledButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : (
    <Redirect to="/login" />
  )
}
