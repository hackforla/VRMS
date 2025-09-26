import { useEffect, useState } from 'react'; 
import {  
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
import UserApiService from '../../api/UserApiService';
import ProjectApiService from '../../api/ProjectApiService';
import { StyledButton } from '../ProjectForm';


// Test Users Data
const testUsers = [
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

const ButtonGroup = ({ btnName1, btnName2, callBackFn1, callBackFn2, isLoading }) => (
    <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
    <Grid item xs="auto">
      <StyledButton
        sx="large"
        cursor="pointer"
        variant="contained"
        onClick={(btn) => callBackFn1(btn)}
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


const ListComponent = ({ projectId, projectMembers, renderedUsers, setRenderedUsers, editMode, closeConfirmModal, setChangesMade, setCloseConfirmModal, setEditMode, isLoading }) => {
  const [openModal, setOpenModal] = useState(false);
  const [removeConfirmModal, setRemoveConfirmModal] = useState(false);
  const [removeId, setRemoveId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(""); // Store user ID state of selected user to show info
  
  // Create new instance of ProjectApiService class to access backend routers & controllers
  const projectApiService = new ProjectApiService();

  console.log('Initial projectMembers:', projectMembers)

  useEffect(() => {
    setSelectedUserId(""); // close user info when exiting out of "Edit" mode
  }, [projectMembers, editMode])

  const handleSavePMs = async () => {
    alert('Saved PMs to database')
    // Insert logic to save (update) "renderedUsers" to database

    // Create addedUsers and removedUsers arrays from original projectMembers
    const addedUsers = renderedUsers.filter(
      newUser => !projectMembers.some(oldUser => oldUser._id === newUser._id)
    );
    const removedUsers = projectMembers.filter(
      oldUser => !renderedUsers.some(newUser => newUser._id === oldUser._id)
    );

    try {
      // Update using bulkWrite (bulk update)
      const addBulkOps = [
        ...addedUsers.map(user => ({
          updateOne: {
            filter: { _id: projectId },
            update: { $addToSet: { managedByUsers: user._id } },
          },
        })),
      ]
    
      const removeBulkOps = [
        ...removedUsers.map(user => ({
          updateOne: {
            filter: { _id: projectId },
            update: { $pull: { managedByUsers: user._id } },
          },
        })),  
      ]

      // // Update addedUsers in parallel
      // await Promise.all(
      //   addedUsers.map(userId =>
      //     projectApiService.updateManagedByUsers(projectId, userId, "add")
      //   )
      // );

      // // Update removedUsers in parallel
      // await Promise.all(
      //   removedUsers.map(userId =>
      //     projectApiService.updateManagedByUsers(projectId, userId, "remove")
      //   )
      // );

    } catch (err) {
      console.log(err)
    }
  }
  
  const handleClosePMs = () => setCloseConfirmModal(true);
  
  const handleCloseOnYes = () => {    
    setChangesMade(false); // Discard changes 
    setRenderedUsers(projectMembers); // Reset renderedUsers to original projectMembers
    setCloseConfirmModal(false); // Close modal and exit edit mode
    setEditMode(false);
  }

  const handleCloseOnNo = () => setCloseConfirmModal(false);

  const handleRemoveConfirm = () => {
    setChangesMade(true);
    // Remove user from renderedUsers state to update UI
    const updatedUsers = renderedUsers.filter(user => user._id !== removeId);
    setRenderedUsers(updatedUsers);
    // Show confirmation modal
    setRemoveConfirmModal(true);
    setOpenModal(false);
    // Auto close confirmation modal after 1.5 seconds
    setTimeout(() => {
      setRemoveConfirmModal(false);
    }, 1500);
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
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 'none',
    p: 4,
  };

  return (
    <Grid>
      <List className="search-results disablePadding">
        {renderedUsers.map((user, idx) => {
          const { _id, name, email } = user; // destructure user object
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
                >
                  <Grid container justifyContent={'space-between'}                   
                    onClick={() => {
                      if (editMode && !openModal) setSelectedUserId(_id);
                    }}
                  >
                    <Grid item>
                      <Typography fontWeight="bold" color="black">
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
                    {/* Remove Modal */}
                    <Modal
                      open={openModal}
                      hideBackdrop={true}
                    >
                      <Box sx={modalStyle2}>
                        <WarningAmberIcon sx={{ fontSize: 40, color: 'red' }} />
                        <Typography variant="h6" component="h2" fontWeight="bold">
                          Are you sure you want to remove this user from the project?
                        </Typography>
                        <ButtonGroup btnName1={"Yes"} btnName2={"No"} callBackFn1={handleRemoveConfirm} callBackFn2={() => { setSelectedUserId(""); setOpenModal(false); }} isLoading={isLoading} />
                      </Box>
                    </Modal>
                    {/* Remove Confirmation Modal */}
                    <Modal   
                      open={removeConfirmModal}
                      hideBackdrop={true}
                    >
                      <Box  
                        onClick={() => setRemoveConfirmModal(false)}
                        sx={modalStyle1}
                      >
                        <Box sx={modalStyle2} onClick={(e) => e.stopPropagation()}>
                          <CheckCircleOutline color="success" />
                          <Typography variant="h6" component="h2" fontWeight="bold">
                            User removed from project.
                          </Typography>
                        </Box>
                      </Box>
                    </Modal>
                  </Grid>
                  {editMode && <DeleteIcon style={{ color: 'red', marginLeft: 40 }} onClick={() => { setOpenModal(true); setRemoveId(_id); }} />}
                </ListItemButton>
              </ListItem>
              {/* User information */}
              {selectedUserId === _id &&
                <ListItem                 
                  style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'flex-end' }}
                  sx={{
                    borderLeft: 1.6,
                    borderRight: 1.6,
                    borderBottom: 1.6,
                    borderColor: 'grey.300',
                  }}
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
                        <CloseIcon onClick={() => setSelectedUserId("")} />
                      </Box>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography style={{ fontWeight: 600 }} sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "black"}}>
                            {name.firstName.toUpperCase() +
                              ' ' +
                              name.lastName.toUpperCase()}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "black"}}>
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
  const [error, setError] = useState(false);
  const [toggleSelect, setToggleSelect] = useState(false);
  const [email, setEmail] = useState('');
  const [searchedUser, setSearchedUser] = useState({});
  const [closeConfirmModal, setCloseConfirmModal] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [renderedUsers, setRenderedUsers] = useState([]);

  // Create new instance of UserApiService class to access backend routers & controllers
  const userApiService = new UserApiService();

  useEffect(() => {
    // Create an array of projectMembers (users) from project's managedByUsers (user IDs)
    const fetchProjectMembers = async () => {
      if (projectToEdit?.managedByUsers?.length) {  
        setIsLoading(true);
        try {
          const members = await Promise.all(
            projectToEdit.managedByUsers.map(async (userId) => {
              const user = await userApiService.fetchUserById(userId.toString());
              return user;
            })
          );
          setProjectMembers(members);
          setRenderedUsers(members);
        } catch (err) { 
          console.log(err)
        }
        setIsLoading(false);
      }
    }
    if (!changesMade) fetchProjectMembers();
  }, [changesMade]);
  
  const accessLevel = auth?.user?.accessLevel;
  const userId = auth?.user?._id;
  
  // Edit icon component only avaiable for VRMS admins and project members (users in project)
  const editIcon = () => {
    return (accessLevel !== 'user' || projectToEdit?.managedByUsers?.includes(userId)) && (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => {
          if (editMode && changesMade) {
            setCloseConfirmModal(true);
          } else {
            setEditMode(!editMode);
            setError(false);
          }
        }}
      >
        <EditIcon style={{ p: 1 }} />
        <Typography sx={{ p: 1, fontSize: '14px', fontWeight: '600' }}>
          {editMode ? 'Cancel' : 'Edit'}
        </Typography>
      </Box>
    );
  };

  const handleEmailSearch = async (search) => {   
    setEmail(search);
    // Reset toggleSelect state if user starts typing again
    if (toggleSelect) setToggleSelect(false);

    // RegEx for valid email check
    const emailRegEx = /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/gi;
    
    // Fetch user data based on email
    if (emailRegEx.test(search)) {
      setIsLoading(true);
      
      try {
        const user = await userApiService.fetchUserByEmail(search);
        console.log(user);

        if (user[0]) {
          setSearchedUser(user[0]);
          setError(false);
        } else {
          setSearchedUser({});
          setError(true);
        }
      } catch (err) {
        setError(true);
        console.log(err)
      }
    } else {
      setError(false);
      setSearchedUser({})
    }
    setIsLoading(false);
  }

  // Handle logic to toggle email selection and adding user to project's managedByUsers
  const handleAddUser = (addedUser) => {
    setToggleSelect(true);
    if (!toggleSelect) {
      setRenderedUsers((prevMembers) => [...prevMembers, addedUser]); // Add user to project's managedByUsers array
      setChangesMade(true); // Set changes made to true
    }
    // Confirmation message disappears after 1.5 seconds
    setTimeout(() => {
      setEmail("");
      setSearchedUser({});
      setToggleSelect(false);
    }, 1500);
  }


  return (
    <Box sx={{ px: 0.5 }}>
      <TitledBox
        title={'Project Members (Event Editors)'}
        badge={editIcon()}
      >
        {/* Email search componennt */}
        <Grid container direction="column" sx={{ width: '100%', backgroundColor: editMode ? 'white' : '' }}>
          <Grid item>
            <TextField 
              disabled={!editMode}
              onChange={(e) => handleEmailSearch(e.target.value)}
              placeholder="Enter user email address" 
              value={email} 
              size="small"
            />
          </Grid>
          {searchedUser?.email && (
            <Grid item>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                sx={{ px: 2, py: 2, border: 1, borderColor: 'grey.400', borderRadius: 1, mt: 1 }}
              >
                <Typography sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {!toggleSelect ? searchedUser?.email : <Typography sx={{ fontWeight: "bold" }}>User added to project successfully</Typography>}
                </Typography>
                {/* Icons for adding and confirming email of new user */}
                {!toggleSelect ? <AddCircleOutlineIcon sx={{ flexShrink: 0, ml: 2 }} onClick={() => handleAddUser(searchedUser)} />
                : <CheckCircleOutline color="success" />}
              </Box>
            </Grid>
          )}
        </Grid>
        {/* Display error message */}
        {error && (<Typography color="red">No account found with this email address</Typography>)}
        {/* Display users */}
        <ListComponent projectId={projectToEdit._id} projectMembers={projectMembers} editMode={editMode} setChangesMade={setChangesMade} closeConfirmModal={closeConfirmModal} setCloseConfirmModal={setCloseConfirmModal} setEditMode={setEditMode} renderedUsers={renderedUsers} setRenderedUsers={setRenderedUsers} isLoading={isLoading} />
      </TitledBox>
    </Box>
  )
}

export default EditProjectMembers