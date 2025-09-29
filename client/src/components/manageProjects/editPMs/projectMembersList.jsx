import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Modal,
} from "@mui/material";
import ButtonGroup from './buttonGroup'
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import UserApiService from '../../../api/UserApiService';
import ProjectApiService from '../../../api/ProjectApiService';

const userApiService = new UserApiService();
const projectApiService = new ProjectApiService();


const ProjectMembersList = ({ projectId, projectMembers, renderedUsers, setRenderedUsers, editMode, closeConfirmModal, setChangesMade, setCloseConfirmModal, setEditMode, isLoading, setEmail, setIsLoading }) => {
  const [openModal, setOpenModal] = useState(false);
  const [removeConfirmModal, setRemoveConfirmModal] = useState(false);
  const [removeId, setRemoveId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(""); // Store user ID state of selected user to show info

  useEffect(() => {
    setSelectedUserId(""); // close user info when exiting out of "Edit" mode
  }, [projectMembers, editMode])

  const handleSavePMs = async () => {
    // Create addedUsers and removedUsers arrays from original projectMembers
    const addedUsers = renderedUsers.filter(
      newUser => !projectMembers.some(oldUser => oldUser._id === newUser._id)
    );
    const removedUsers = projectMembers.filter(
      oldUser => !renderedUsers.some(newUser => newUser._id === oldUser._id)
    );

    if (addedUsers.length === 0 && removedUsers.length === 0) {
      // No changes made, exit edit mode
      setEditMode(false);
      setChangesMade(false);
      return;
    }

    // Use bulkWrite as opposed to a loop with Promise.all & controller for runtime and network efficiency
    try {
      setIsLoading(true);

      const addUsersToProjBulkOps = [
        ...addedUsers.map(user => ({
          // Update manageByUsers array for project
          updateOne: {
            filter: { _id: projectId },
            update: { $addToSet: { managedByUsers: user._id } },
          },
        })),
      ]
      const removeUsersFromProjBulkOps = [
        ...removedUsers.map(user => ({
          updateOne: {
            filter: { _id: projectId },
            update: { $pull: { managedByUsers: user._id } },
          },
        })),
      ]

      const projBulkOps = [...addUsersToProjBulkOps, ...removeUsersFromProjBulkOps];

      const addProjToUserBulkOps = [
        ...addedUsers.map(user => ({
          // Update managedProjects array for user
          updateOne: {
            filter: { _id: user._id },
            update: { $addToSet: { managedProjects: projectId } },
          },
        })),
      ]
      const removeProjFromUserBulkOps = [
        ...removedUsers.map(user => ({
          updateOne: {
            filter: { _id: user._id },
            update: { $pull: { managedProjects: projectId } },
          },
        })),
      ]

      const userBulkOps = [...addProjToUserBulkOps, ...removeProjFromUserBulkOps];

      await projectApiService.bulkUpdateManagedByUsers(projBulkOps); // Bulk update of each project's managedByUsers
      await userApiService.bulkUpdateManagedProjects(userBulkOps); // Bulk update of each user's managedProjects

      setChangesMade(false); // Reset changes made
      setEditMode(false); // Exit edit mode
    } catch (err) {
      console.log(err)
      alert('Save failed. Please try again.');
    }
    setIsLoading(false); 
  }

  const handleClosePMs = () => setCloseConfirmModal(true);

  const handleCloseOnYes = () => {
    setChangesMade(false); // Discard changes 
    setRenderedUsers(projectMembers); // Reset renderedUsers to original projectMembers
    setCloseConfirmModal(false); // Close modal and exit edit mode
    setEmail(""); // Clear email search field
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
                        <Typography style={{ fontWeight: 600 }} sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "black" }}>
                          {name.firstName.toUpperCase() +
                            ' ' +
                            name.lastName.toUpperCase()}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography sx={{ whiteSpace: "normal", wordBreak: "break-word", color: "black" }}>
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

export default ProjectMembersList