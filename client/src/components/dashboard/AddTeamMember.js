import React, { useState } from "react";
import "../../sass/AddTeamMember.scss";

const AddTeamMember = (props) => {
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");

    const handleInputChange = (e) => setEmail(e.currentTarget.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);

        if (email === "") {
            setIsError(true);
            setErrorMessage("Please don't leave the field blank.");
        } else if (!email.includes("@") || !email.includes(".")) {
            setIsError(true);
            setErrorMessage("Please format the email address correctly.");
        } else {
            await addToRoster();
            console.log("Success. Team member added.");
        }
    };

    async function addToRoster() {
        try {
            return await fetch("/api/checkuser", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                throw new Error(res.statusText);
            })
            .then(response => {
                if (response === false) {
                    setIsError(true);
                    setErrorMessage("Email not found.");

                    return response;
                } else {
                    return response;
                }
            })
            .then(user => {
                addMember(user);
            })
            .catch((err) => {
                console.log(err);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function addMember(user) {
        const parameters = {
            userId: user._id,
            projectId: props.project.projectId,
            roleOnProject: user.currentRole
        };

        try {
            return await fetch("/api/projectteammembers", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(parameters),
            })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                throw new Error(res.statusText);
            })
            .catch((err) => {
                console.log(err);
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex-container">
            <div className="addmember-container">
                <form
                className="form-add-member"
                autoComplete="off"
                onSubmit={(e) => handleSubmit(e)}
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

                <div className="addmember-warning">{isError ? errorMessage : null}</div>
            </div>
        </div>
    );
};

export default AddTeamMember;
