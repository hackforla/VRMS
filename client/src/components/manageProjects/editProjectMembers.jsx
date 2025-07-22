import { useState } from 'react'; 
import { useHistory } from 'react-router-dom';
import { useForm, useFormState } from 'react-hook-form';
import {  
  CircularProgress,
  Typography,
  Box,
  Button,
  Grid,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
  TextField,
  List,
  ListItem,
  ListItemButton,} from "@mui/material";
import useAuth from '../../hooks/useAuth';
import EditIcon from '../../svg/Icon_Edit.svg?react';
import PlusIcon from '../../svg/PlusIcon.svg?react';
import ValidatedTextField from '../parts/form/ValidatedTextField';
import TitledBox from '../parts/boxes/TitledBox';
import ChangesModal from '../ChangesModal';


const ListComponent = ({ data }) => {
  console.log(data)
  return (
    <List className="search-results disablePadding">
      {data.map((user, idx) => {
        // Destructure user object
        const { _id, name, email } = user;
        // return projects.length === 0 ?
        return (
          <ListItem
            sx={{
              px: 2.4,
              py: 1,
              borderBottom: 1.6,
              borderBottomColor: 'grey.300',
            }}
            key={`result_${_id}/${idx}`}
          >
            <ListItemButton
              sx={{
                px: 0.25,
                py: 0.36,
                color: 'primary.main',
                mx: 0.16,
              }}
              className="search-results-button"
              type="button"
              onClick={() => console.log(user)}
            >
              <Grid container>
                <Grid item>
                  <Typography style={{ fontWeight: 600 }}>
                    {`${name.firstName.toUpperCase()} ${name.lastName.toUpperCase()} ( ${email.toUpperCase()} )`}
                    {/* {`${name.firstName.toUpperCase()} ${name.lastName.toUpperCase()} ( ${email.toUpperCase()} )`} */}
                  </Typography>
                </Grid>
              </Grid>
            </ListItemButton>
          </ListItem>
        ); 
      })}
    </List>
  );
};


const EditProjectMembers = ({ projectToEdit, isEdit }) => {
  console.log(projectToEdit)


  const history = useHistory();
  // ----------------- States -----------------
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [locationType, setLocationType] = useState('remote');
  // State to track the toggling from Project view to Edit Project View via edit icon.
  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false)
  const checkFields = () => {
    history.push('/projects');
  };


  const editIcon = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setEditMode(!editMode)}
      >
        <EditIcon style={{ p: 1 }} />
        <Typography sx={{ p: 1, fontSize: '14px', fontWeight: '600' }}>
          {editMode ? 'Cancel' : 'Edit'}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ px: 0.5 }}>
      <TitledBox
        title={'Project Members (Event Editors)'}
        badge={editIcon()}
        onClick={() => setEditMode(!editMode)}
      >
        <TextField 
          id="members" 
          placeholder='Enter user email address' 
          variant="outlined" 
          onChange={(e) => setEmail(e.target.value)} 
          fullWidth 
        />
        <ListComponent data={projectToEdit?.managedByUsers} />
      </TitledBox>
  </Box>
  )
}

export default EditProjectMembers