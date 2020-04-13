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
                            <tr><th className="user-data__header">Name</th><td className="user-data__info user-data">John Smith</td></tr>
                            <tr><th className="user-data__header">Email</th><td className="user-data__info">john.smith@test.com</td></tr>
                            <tr><th className="user-data__header">Github</th><td className="user-data__info">www.github.com/j_smith</td></tr>
                            <tr><th className="user-data__header">Slack</th><td className="user-data__info">www.slack.com/j_smith</td></tr>
                            <tr><th className="user-data__header">Desired Roles</th><td className="user-data__info user-data__info--flex">
                                <p className="user-data__selection"><span>UX</span><button className="user-data__delete">X</button></p>
                                <p className="user-data__selection"><span>Front End</span><button className="user-data__delete">X</button></p>
                            </td></tr>
                            <tr><th className="user-data__header">My Hack Nights</th><td class="user-data__info user-data__info--flex">
                                <p className="user-data__selection"><span>DTLA</span><button className="user-data__delete">X</button></p>
                                <p className="user-data__selection"><span>Westside</span><button className="user-data__delete">X</button></p>
                            </td></tr>
                            <tr><th className="user-data__header">Availability</th><td class="user-data__info user-data__info--flex">
                                <p className="user-data__selection"><span>Mon PM</span><button className="user-data__delete">X</button></p>
                                <p className="user-data__selection"><span>Thurs PM</span><button className="user-data__delete">X</button></p>  
                            </td></tr>
                        </tbody>
                    </table>
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
    