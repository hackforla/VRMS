import React from 'react';
import ProfileOption from '../profile/ProfileOption';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

const UserTable = ({ context }) => {
  const { user, removeOption } = context;

  return (
    <Box className="user-info">
      <Table className="user-data">
        <TableBody>
          <TableRow>
            <TableHead className="user-data__header">Name</TableHead>
            <TableCell className="user-data__info user-data">{user.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="user-data__header">Email</TableHead>
            <TableCell className="user-data__info">{user.email}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="user-data__header">Github</TableHead>
            <TableCell className="user-data__info">{user.github}</TableCell>
          </TableRow>

          {user.slack ? (
            <TableRow>
              <TableHead className="user-data__header">Slack</TableHead>
              <TableCell className="user-data__info">{user.slack}</TableCell>
            </TableRow>
          ) : (
            ''
          )}

          {user.desiredRoles ? (
            <TableRow>
              <TableHead className="user-data__header">Desired Roles</TableHead>
              <TableCell className="user-data__info user-data__info--flex">
                {user.desiredRoles.map((option, index) => (
                  <ProfileOption
                    key={index}
                    option={option}
                    removeOption={() => removeOption('desiredRoles', option)}
                  />
                ))}
              </TableCell>
            </TableRow>
          ) : (
            ''
          )}

          {user.hackNights ? (
            <TableRow>
              <TableHead className="user-data__header">My Hack Nights</TableHead>
              <TableCell className="user-data__info user-data__info--flex">
                {user.hackNights.map((option, index) => (
                  <ProfileOption
                    key={index}
                    option={option}
                    removeOption={() => removeOption('hackNights', option)}
                  />
                ))}
              </TableCell>
            </TableRow>
          ) : (
            ''
          )}

          {user.availability ? (
            <TableRow>
              <TableHead className="user-data__header">Availability</TableHead>
              <TableCell className="user-data__info user-data__info--flex">
                {user.availability.map((option, index) => (
                  <ProfileOption
                    key={index}
                    option={option}
                    removeOption={() => removeOption('availability', option)}
                  />
                ))}
              </TableCell>
            </TableRow>
          ) : (
            ''
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default UserTable;
