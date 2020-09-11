import React, { useEffect } from 'react';
import '../sass/UserProfile.scss';
import UserTable from '../components/presentational/profile/UserTable';
import UserEvents from '../components/presentational/profile/UserEvents';
import UserTeams from '../components/presentational/profile/UserTeams';
import { UserProvider, UserContext } from '../context/userContext';

const UserProfile = ({ user, setUser, removeOption, events, teams }) => {
    useEffect(() => {
        fetch('http://localhost:6999/api/users/5e1d2346316d2f00172ef066')
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.log("Error fetching:", err));
    }, []);
    
    return (
        <div>
            <div className="profile__header">
                <h3 className="profile__title">My Profile</h3>
            </div>    
            <UserTable context={{ user, removeOption }}/>
            <div className="profile__header">
                <h3 className="profile__subtitle">My Upcoming Events</h3>
            </div>
            <UserEvents context={{ events }}/> 
            <div className="profile__header">
                <h3 className="profile__subtitle">My Teams</h3>
            </div>
            <UserTeams context={{ teams }}/> 
        </div>
    )
};

export default (function (WrappedComponent) {
    return (props) => {
        return (
        <UserContext.Consumer>
            {(context) => (<WrappedComponent {...props} {...context}/>)}
        </UserContext.Consumer>
        )
    }
})(UserProfile);
    