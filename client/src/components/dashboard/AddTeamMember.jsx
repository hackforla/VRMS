import React, { useState } from "react";
import "../../sass/AddTeamMember.scss";

const AddTeamMember = (props) => {
    const [email, setEmail] = useState("");

    const handleInputChange = (e) => setEmail(e.currentTarget.value);

    return (
        <div className="flex-container">
            <div className="addmember-container">
                <form
                className="form-add-member"
                autoComplete="off"
                onSubmit={(e) => props.addToTeamHandler(e, email)}
                >
                <div className="form-row">
                    <div className="form-input-text">
                    <label htmlFor="email">Add team member:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={email.toString()}
                        onChange={(e) => handleInputChange(e)}
                        aria-label="Email Address"
                        autoComplete="none"
                        required="required"
                    />
                    </div>
                </div>

                <div className="form-input-button">
                    <button
                    type="submit"
                    className="addmember-button"
                    >
                    Add
                    </button>
                </div>
                </form>
                {props.isSuccess ? <p className="addmember-success">User Added</p> : null}
                <div className="addmember-warning">{props.isError ? props.errorMessage : null}</div>
            </div>
        </div>
    );
};

export default AddTeamMember;
