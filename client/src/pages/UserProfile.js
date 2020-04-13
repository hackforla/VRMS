import React, { useEffect } from 'react';
import '../sass/UserProfile.scss';

const UserProfile = (props) => {

    useEffect(() => {
        // fetchData();

    }, []);

    return (
        <div>
            <div>
                <div className="profile__header">
                    <h3 className="profile__title">My Profile</h3>
                </div>
                <div className="user-info">
                    <table className="user-data">
                        <tbody>
                            <tr><th className="user-data__header">Name</th><td class="user-data__info">John Smith</td></tr>
                            <tr><th className="user-data__header">Email</th><td class="user-data__info">john.smith@test.com</td></tr>
                            <tr><th className="user-data__header">Github</th><td class="user-data__info">www.github.com/j_smith</td></tr>
                            <tr><th className="user-data__header">Slack</th><td class="user-data__info">www.slack.com/j_smith</td></tr>
                            <tr><th className="user-data__header">Desired Roles</th><td class="user-data__info">
                                <p className="user-data__selection"><span>UX</span><button className="user-data__delete">X</button></p>
                                <p className="user-data__selection">Front End</p>
                            </td></tr>
                            <tr><th className="user-data__header">My Hack Nights</th><td class="user-data__info">
                                <p className="user-data__selection">DTLA</p>
                                <p className="user-data__selection">Westside</p>
                            </td></tr>
                            <tr><th className="user-data__header">Availability</th><td class="user-data__info">
                                <p className="user-data__selection">Mon pm</p>
                                <p className="user-data__selection">Thurs pm</p>    
                            </td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="profile__header">
                    <h3 className="profile__subtitle">My Upcoming Events</h3>
                </div>
                <div className="user-events">
                    
                </div>
            </div>
        </div>
    )
};

export default UserProfile;
    