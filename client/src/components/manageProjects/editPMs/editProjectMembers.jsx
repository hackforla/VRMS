import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import useAuth from '../../../hooks/useAuth';
import EditIcon from '../../../svg/Icon_Edit.svg?react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import TitledBox from '../../parts/boxes/TitledBox';
import UserApiService from '../../../api/UserApiService';
import ProjectMembersList from './projectMembersList' 

const userApiService = new UserApiService();

const EditProjectMembers = ({ projectToEdit }) => {
  // ----------------- States -----------------
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [toggleSelect, setToggleSelect] = useState(false);
  const [email, setEmail] = useState('');
  const [searchedUser, setSearchedUser] = useState({});
  const [closeConfirmModal, setCloseConfirmModal] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [renderedUsers, setRenderedUsers] = useState([]);

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
  }, []);
  
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
            setError("");
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
        if (user[0]) {
          setSearchedUser(user[0]);
          setError("");
        } else {
          setSearchedUser({});
          setError("No account found with this email address");
        }
      } catch (err) {
        setError("No account found with this email address");
        console.log(err)
      }
    } else {
      setError("");
      setSearchedUser({})
    }
    setIsLoading(false);
  }

  // Handle logic to toggle email selection and adding user to project's managedByUsers
  const handleAddUser = (addedUser) => {
    // Check if user is already in renderedUsers
    if (renderedUsers.some(user => user._id === addedUser._id)) {
      setError("The user has already been added");
      return;
    }

    setToggleSelect(true);
    if (!toggleSelect) {
      setRenderedUsers((prevUsers) => [...prevUsers, addedUser]); // Add user to project's managedByUsers array
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
        {error && (<Typography color="red">{error}</Typography>)}
        {/* Display project members */}
        <ProjectMembersList projectId={projectToEdit._id} projectMembers={projectMembers} editMode={editMode} setChangesMade={setChangesMade} closeConfirmModal={closeConfirmModal} setCloseConfirmModal={setCloseConfirmModal} setEditMode={setEditMode} renderedUsers={renderedUsers} setRenderedUsers={setRenderedUsers} isLoading={isLoading} setEmail={setEmail} setIsLoading={setIsLoading} />
      </TitledBox>
    </Box>
  )
}

export default EditProjectMembers