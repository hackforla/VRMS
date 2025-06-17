import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';

import '../../sass/UserAdmin.scss';

const Buttonsx = {
  px: 2,
  py: 0.5,
};

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
    <Box className="container--usermanagement" sx={{ px: '1.8rem', mb: 0 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 5,
          height: '100%',
          width: 1 / 1,
        }}
      >
        <Typography variant="h1">User Search</Typography>

        <Box className="tab-buttons">
          <ButtonGroup
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              mx: 1,
            }}
          >
            <Button
              sx={Buttonsx}
              type="button"
              variant={searchResultType === 'name' ? 'contained' : 'secondary'}
              onClick={buttonSwap}
            >
              Results by Name
            </Button>
            <Button
              sx={Buttonsx}
              type="button"
              variant={searchResultType === 'email' ? 'contained' : 'secondary'}
              onClick={buttonSwap}
            >
              Results by Email
            </Button>
          </ButtonGroup>
        </Box>
        <TextField
          type="text"
          placeholder="Enter name and / or email to find a user."
          variant="standard"
          value={searchTerm}
          onChange={handleChange}
        />
        <Box
          sx={{
            bgcolor: searchResults.length > 0 ? '#F5F5F5' : 'transparent',
            my: 1.2,
            borderRadius: 1,
            flexGrow: 1,
            width: 1 / 1,
          }}
        >
          <Box>
            <List className="search-results disablePadding">
              {searchResults.map((u) => {
                return (
                  // eslint-disable-next-line no-underscore-dangle
                  <ListItem
                    sx={{
                      px: 2.4,
                      py: 1,
                      borderBottom: 1.6,
                      borderBottomColor: 'grey.300',
                    }}
                    key={`result_${u._id}`}
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
        <Box>
          {/* <Button
            type='button'
            variant='secondary'
          >
            Add a New User
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
};

export default UserManagement;
