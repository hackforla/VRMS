import React, { useState } from 'react';
import {Box, Button, ButtonGroup, TextField, Typography, List, ListItem, ListItemButton} from '@mui/material';


import '../../sass/UserAdmin.scss';

// const h3sx = {
//   fontFamily: 'aliseoregular',
//   fontSize: {xs: "1.6rem"},
//   marginBottom: `1rem`,
//   marginTop: `1rem`,
//   textAlign: "center",
// }
const ButtonGroupsx = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  minWidth: '127%',
}
const Boxsx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '75%'
}
const Buttonsx = {
  p: '0.1rem'
}

const UserManagement = ({ users, setUserToEdit }) => {
  let searchResults = [];
  const [searchResultType, setSearchResultType] = useState('name'); // Which results will diplay
  const [searchTerm, setSearchTerm] = useState(''); // Serch term for the user/email search

  // Swaps the buttons and displayed panels for the search results, by email or by name
  const buttonSwap = () =>
    searchResultType === 'email'
      ? setSearchResultType('name')
      : setSearchResultType('email');

  // Handle change on input in search form
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (!searchTerm) {
    searchResults = [];
  } else {
    searchResults =
      searchResultType === 'email'
        ? Object.values(users)
            .filter((user) =>
              user.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase().trim())
            )
            .sort((a, b) => a.email.localeCompare(b.email))
        : Object.values(users)
            .filter((user) =>
              `${user.name?.firstName} ${user.name?.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase().trim())
            )
            .sort((a, b) =>
              a.name?.firstName
                .concat(a.name?.lastName)
                .localeCompare(b.name?.firstName.concat(b.name?.lastName))
            );
  }
  return (
    <div className="container--usermanagement">
      <Box sx={Boxsx}>
        <Typography variant='h1'>User Management</Typography>
        
        <div className="tab-buttons">
          <ButtonGroup sx={ButtonGroupsx}>
              <Button
                sx={Buttonsx}
                type="button"
                variant={
                  searchResultType === 'name'
                  ? 'contained'
                  : 'secondary'
                }
                onClick={buttonSwap
                }
              >
                Results by Name
              </Button>
              <Button
                sx={Buttonsx}
                type="button"
                variant={
                  searchResultType === 'email'
                  ? 'contained'
                  : 'secondary'
                }
                onClick={buttonSwap
                }
              >
                Results by Email
              </Button>
          </ButtonGroup>
        </div>
        <TextField
          sx={{
            mt: '0.43rem',
          }}
          type="text"
          placeholder="Enter name and / or email to find a user."
          variant='standard'
          value={searchTerm}
          onChange={handleChange}
        />
        <Box sx={{ bgcolor: '#F5F5F5', my: 3, width: '125%'}}>
          <Box>
              <List className="search-results disablePadding">
                {searchResults.map((u) => {
                  return (
                    // eslint-disable-next-line no-underscore-dangle
                    <ListItem
                    sx={{
                      px: '1.2rem',
                      py: '0.25rem'
                      
                    }} 
                      key={`result_${u._id}`}>
                      <ListItemButton
                        sx={{
                          px: '0.12rem',
                          py: '0.18rem',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                        className="search-results-button"
                        type="button"
                        onClick={() => setUserToEdit(u)}
                      >
                        {searchResultType === 'name'
                          ? `${u.name?.firstName} ${u.name?.lastName} ( ${u.email} )`
                          : `${u.email} ( ${u.name?.firstName} ${u.name?.lastName} )`}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
          </Box>
        </Box>
        <div>
          <Button
            sx={{

            }}
            type='button'
            variant='secondary'
          >
            Add a New User
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default UserManagement;
