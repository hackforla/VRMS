import React from 'react';

const ProfileOption = ({ index, option, removeOption })=> {
    return (
        <p key={index} className="user-data__selection">
            <span>{option}</span>
            <button className="user-data__delete" onClick={removeOption}>X</button>
        </p>
    )
};

export default ProfileOption;