import React, { useState } from 'react';
import '../../sass/UserAdmin.scss';

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
      <div>
        <h3>User Management</h3>
        <input
          type="text"
          className="text-input"
          placeholder="Search by name and email..."
          value={searchTerm}
          onChange={handleChange}
        />
        <div className="tab-buttons">
          <div>
            <button
              type="button"
              className={
                searchResultType === 'name'
                  ? 'select-button selected'
                  : 'select-button'
              }
              onClick={buttonSwap}
              disabled={searchResultType === 'name'}
            >
              Results by Name
            </button>
          </div>
          <div>
            <button
              type="button"
              className={
                searchResultType === 'email'
                  ? 'select-button selected'
                  : 'select-button'
              }
              onClick={buttonSwap}
              disabled={searchResultType === 'email'}
            >
              Results by Email
            </button>
          </div>
        </div>
        <div>
          <div>
            <ul className="search-results">
              {searchResults.map((u) => {
                return (
                  // eslint-disable-next-line no-underscore-dangle
                  <li key={`result_${u._id}`}>
                    <button
                      className="search-results-button"
                      type="button"
                      onClick={() => setUserToEdit(u)}
                    >
                      {searchResultType === 'name'
                        ? `${u.name?.firstName} ${u.name?.lastName} ( ${u.email} )`
                        : `${u.email} ( ${u.name?.firstName} ${u.name?.lastName} )`}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
