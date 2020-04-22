import React, { useEffect } from 'react';
import '../sass/UserProfile.scss';
import UserTable from '../components/presentational/profile/UserTable';
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
                    <UserTable />
                </div>
                <div className="profile__header">
                    <h3 className="profile__subtitle">My Upcoming Events</h3>
                </div>
                <div className="user-events">
                    <table className="user-data">
                        <tbody>
                            <tr>
                                <th className="user-data__header">Event</th>
                                <th className="user-data__header">Date/Time</th>
                                <th className="user-data__header">Link</th>
                            </tr>
                            <tr>
                                <td className="user-data__info">VRMS Team Meeting</td>
                                <td className="user-data__info">04/13, 7PM</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="profile__header">
                    <h3 className="profile__subtitle">My Teams</h3>
                </div>
                <div className="user-events">
                    <table className="user-data">
                        <tbody>
                            <tr>
                                <th className="user-data__header">Team</th>
                                <th className="user-data__header">Status</th>
                            </tr>
                            <tr>
                                <td className="user-data__info">VRMS</td>
                                <td className="user-data__info user-data__info--active">Active</td>
                            </tr>
                            <tr>
                                <td className="user-data__info">Where2Vote2018</td>
                                <td className="user-data__info user-data__info--inactive">Inactive</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default UserProfile;
    