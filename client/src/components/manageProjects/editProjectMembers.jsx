import { useEffect, useState } from 'react'; 
import {  
  Autocomplete,
  CircularProgress,
  Typography,
  Box,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemButton,
  Modal,
} from "@mui/material";
import useAuth from '../../hooks/useAuth';
import EditIcon from '../../svg/Icon_Edit.svg?react';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TitledBox from '../parts/boxes/TitledBox';
import { StyledButton } from '../ProjectForm';
import UserApiService from '../../api/UserApiService';

const testProject = [
  {
    name: "Project1",
    managedByUsers: ["1","2"]
  }
];

// Test Users Data
const users = [
  {
    _id: "1",
    name: {
      firstName: "Amber",
      lastName: "Jones"
    },
    email: "amber@hackforla.com"
  },
  {
    _id: "2",
    name: {
      firstName: "Bob",
      lastName: "Phillips"
    },
    email: "Bob@hackforla.com"
  },
  {
    _id: "3",
    name: {
      firstName: "Charlie",
      lastName: "Murphy"
    },
    email: "charlie@hackforla.com"
  },
];

const newUser =   {
  _id: "4",
  name: {
    firstName: "mock",
    lastName: "user"
  },
  email: "test4@hackforla.com"
};

const ButtonGroup = ({ btnName1, btnName2, callBackFn1, callBackFn2, isLoading  }) => (
    <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
    <Grid item xs="auto">
      <StyledButton
        sx="large"
        cursor="pointer"
        variant="contained"
        onClick={callBackFn1}
      >
        {isLoading ? <CircularProgress /> : `${btnName1}`}
      </StyledButton>
    </Grid>
    <Grid item xs="auto">
      <StyledButton
        sx="large"
        cursor="pointer"
        variant="contained"
        onClick={callBackFn2}
      >
        {btnName2}
      </StyledButton>
    </Grid>
  </Grid>
);


const ListComponent = ({ data, editMode, setEditMode, isLoading }) => {
  const [openModal, setOpenModal] = useState(false);
  const [removeConfirmModal, setRemoveConfirmModal] = useState(false);
  const [closeConfirmModal, setCloseConfirmModal] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(""); // Store user ID state of selected user to show info

  const handleSavePMs = () => {
    console.log('Save PMs')
    // Insert logic to save to database here
  }
  
  const handleClosePMs = () => setCloseConfirmModal(true);
  
  const handleCloseOnYes = () => {
    setCloseConfirmModal(false);
    setEditMode(false);
  }

  const handleCloseOnNo = () => setCloseConfirmModal(false);

  const handleRemovePMs = () => {
    /** 
      Add logic to remove PM from project in database here
      
    */

    // Show confirmation modal
    setRemoveConfirmModal(true);
    setOpenModal(false);

    // Auto close confirmation modal after 2 seconds
    setTimeout(() => {
      setRemoveConfirmModal(false);
    }, 2000);
  }

  const modalStyle1 = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    bgcolor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1300,
  }

  const modalStyle2 = {
    alignItems: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 'none',
    p: 4,
  };

  return (
    <Grid>
      <List className="search-results disablePadding">
        {data.map((user, idx) => {
          // Destructure user object
          const { _id, name, email } = user;
          return (
            <>
              <ListItem
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                sx={{
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
                >
                  <Grid container justifyContent={'space-between'}                   
                    onClick={() => {
                      if (editMode) setShowUserInfo(_id);
                    }}
                  >
                    <Grid item>
                      <Typography style={{ fontWeight: 600 }} color="black">
                        {name.firstName.toUpperCase() +
                          ' ' +
                          name.lastName[0].toUpperCase() + '.'}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography color="black">
                        {email}
                      </Typography>
                    </Grid>
                    {editMode && <DeleteIcon style={{ color: 'red' }} onClick={() => setOpenModal(true)} />}
                    {/* Remove Modal */}
                    <Modal
                      open={openModal}
                      hideBackdrop={true}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={modalStyle2}>
                        <WarningAmberIcon sx={{ fontSize: 40, color: 'red' }} />
                        <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold">
                          Are you sure you want to remove this user from the project?
                        </Typography>
                        <ButtonGroup btnName1={"Yes"} btnName2={"No"} callBackFn1={handleRemovePMs} callBackFn2={() => setOpenModal(false)} isLoading={isLoading} />
                      </Box>
                    </Modal>
                    {/* Remove Confirmation Modal */}
                    <Modal   
                      open={removeConfirmModal}
                      hideBackdrop={true}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box  
                        onClick={() => setRemoveConfirmModal(false)}
                        sx={modalStyle1}
                      >
                        <Box sx={modalStyle2} onClick={(e) => e.stopPropagation()}>
                          <CheckCircleOutline color="success" />
                          <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold">
                            User removed from project.
                          </Typography>
                        </Box>
                      </Box>
                    </Modal>
                  </Grid>
                </ListItemButton>
              </ListItem>
              {/* User information */}
              {showUserInfo === _id &&
                <ListItem                 
                  style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'flex-end' }}
                  sx={{
                    borderLeft: 1.6,
                    borderRight: 1.6,
                    borderBottom: 1.6,
                    borderColor: 'grey.300',
                  }}
                  key={`result_${_id}/${idx}`}
                >
                    <ListItemButton sx={{ position: 'relative' }}>
                      <Box 
                        sx={{
                          position: 'absolute',
                          top: 1,
                          right: 1,
                          zIndex: 1,
                          cursor: 'pointer',
                        }}
                      >
                        <CloseIcon onClick={() => setShowUserInfo("")} />
                      </Box>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography style={{ fontWeight: 600 }} color="black">
                            {name.firstName.toUpperCase() +
                              ' ' +
                              name.lastName.toUpperCase()}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography color="black">
                            {email}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItemButton>
                </ListItem>
              }
            </>
          );
        })}
      </List>
      {editMode && <ButtonGroup btnName1={"Save"} btnName2={"Close"} callBackFn1={handleSavePMs} callBackFn2={handleClosePMs} isLoading={isLoading} />}
      {/* Close Confirmation Modal */}
      <Modal   
        open={closeConfirmModal}
        hideBackdrop={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle2}>
          <WarningAmberIcon sx={{ fontSize: 40, color: 'red' }} />
          <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold">
            Are you sure you want to close without saving these changes?
          </Typography>
          <ButtonGroup btnName1={"Yes"} btnName2={"No"} callBackFn1={handleCloseOnYes} callBackFn2={handleCloseOnNo} isLoading={isLoading} />
        </Box>
      </Modal>
    </Grid>
  );
};


const EditProjectMembers = ({ projectToEdit }) => {
  // ----------------- States -----------------
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [toggleSelect, setToggleSelect] = useState(false);
  const [email, setEmail] = useState('');
  const [searchedUser, setSearchedUser] = useState({});

  const [testUsers, setTestUsers] = useState(users);

  // Create new instance of UserApiService class
  const userApiService = new UserApiService();


  useEffect(() => {}, [testUsers]);

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
    ) 
  };

  const handleEmailSearch = async (search) => {   
    // RegEx for valid email check
    const emailRegEx = /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/gi;
    
    // Fetch user data based on email
    if (emailRegEx.test(search)) {
      setEmail(search);
      setIsLoading(true);
      
      try {
        const user = await userApiService.fetchUserByEmail(search);
        console.log(user);

        if (user[0]) {
          setSearchedUser(user[0]);
          setErrorMsg(false);
        } else {
          setSearchedUser({});
          setErrorMsg(true);
        }
      } catch (err) {
        setErrorMsg(true);
        console.log(err)
      }
    } else {
      setErrorMsg(false);
      setSearchedUser({})
    }
    setIsLoading(false);
  }

  // Handle logic to toggle email selection and adding user to project's managedByUsers
  const handleToggleSelect = () => {
    console.log('handleToggleSelect called')
    setToggleSelect(!toggleSelect);

    // INSERT logic here to update projectToEdit's managedByUsers array & user's managedProjects array
    if (!toggleSelect) {
      // Add user to project's managedByUsers array
      setTestUsers((prevUsers) => [...prevUsers, newUser]);
    } else {
      setTestUsers((prevUsers) => prevUsers.filter((user) => user._id !== newUser._id));
    }
  }
      

  return (
    <Box sx={{ px: 0.5 }}>
      <TitledBox
        title={'Project Members (Event Editors)'}
        badge={editIcon()}
        onClick={() => setEditMode(!editMode)}
      >
        <Autocomplete 
          disabled={editMode}
          disableCloseOnSelect
          freeSolo
          options={searchedUser?.email ? [searchedUser.email] : []}
          onInputChange={(event, newInputValue) => handleEmailSearch(newInputValue)}
          renderOption={(props, option) => (
            <Box
              {...props}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              sx={{ px: 2 }}
            >
              <Typography sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {!toggleSelect ? option : <Typography sx={{ fontWeight: "bold" }}>User added to project successfully</Typography>}
              </Typography>
              {/* Icons for adding and confirming email of new user */}
              {!toggleSelect ? <AddCircleOutlineIcon sx={{ flexShrink: 0, ml: 2 }} onClick={handleToggleSelect} />
              : <CheckCircleOutline color="success" onClick={handleToggleSelect} />}
            </Box>
          )}
          renderInput={(params) => (
            <TextField 
              {...params} 
              value={searchedUser?.email || ''} 
              placeholder="Enter user email address" 
              InputProps={{ ...params.InputProps, disableUnderline: true }}
              sx={{
                '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                  borderBottom: 'none !important',
                },
                '& .MuiInput-root:before, & .MuiInput-root:after': {
                  borderBottom: 'none !important',
                }
              }} 
            />
          )}
        />
        {/* Display error message */}
        {errorMsg && (<Typography color="red">No account found with this email address</Typography>)}

        {/* Code for test data */}
        <ListComponent data={testUsers} editMode={editMode}  setEditMode={setEditMode} isLoading={isLoading} />
        {/* Replace with real data */}
      </TitledBox>
    </Box>
  )
}

export default EditProjectMembers