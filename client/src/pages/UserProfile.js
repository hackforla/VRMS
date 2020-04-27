import React, { useEffect } from 'react';
import '../sass/UserProfile.scss';
import UserTable from '../components/presentational/profile/UserTable';
import UserEvents from '../components/presentational/profile/UserEvents';
import UserTeams from '../components/presentational/profile/UserTeams';
import { UserProvider, UserContext } from '../context/userContext';

const UserProfile = (props) => {

    useEffect(() => {
        // fetchData();
    }, []);

    return (
        <UserProvider>
            <div>
                <div className="profile__header">
                    <h3 className="profile__title">My Profile</h3>
                </div>    
                <UserContext.Consumer>
                    {({ user, removeOption }) => <UserTable context={{ user, removeOption }}/>}
                </UserContext.Consumer>
                <div className="profile__header">
                    <h3 className="profile__subtitle">My Upcoming Events</h3>
                </div>
                <UserContext.Consumer>
                    { ({ events }) => <UserEvents context={{ events }}/> }
                </UserContext.Consumer>
                <div className="profile__header">
                    <h3 className="profile__subtitle">My Teams</h3>
                </div>
                <UserContext.Consumer>
                    { ({ teams }) => <UserTeams context={{ teams }}/> }
                </UserContext.Consumer>
            </div>
        </UserProvider>
    )
};

export default UserProfile;
    