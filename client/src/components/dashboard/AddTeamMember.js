import React, { useState } from "react";
import "../../sass/AddTeamMember.scss";

const AddTeamMember = (props) => {
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [user, setUser] = useState({
        id: "",
        role: ""
    });

    const handleInputChange = (e) => setEmail(e.currentTarget.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUser({
            id: "",
            role: ""
        });
        console.log("user1", user);
        setIsError(false);

        if (email === "") {
            setIsError(true);
            setErrorMessage("Please don't leave the field blank.");
        } else if (!email.includes("@") || !email.includes(".")) {
            setIsError(true);
            setErrorMessage("Please format the email address correctly.");
        } else {
            let hasEmail = await checkEmail();

            if (hasEmail === false) {
                setIsError(true);
                setErrorMessage("Email does not exist.");
            } else {
                console.log("user2", user);
                await addMember();
                console.log("Success. Team member added.", user);
            }
        }
    };

    async function addMember() {
        const parameters = {
            userId: user.id,
            projectId: props.project.projectId,
            roleOnProject: user.role
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

    async function checkEmail() {
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
            .then((response) => {
                if (response === false) {
                    setIsError(true);
                    setErrorMessage("Email not found.");

                    return response;
                } else {
                    setUser({
                        ...user, 
                        id: response._id, 
                        role: response.currentRole
                    });

                    return response;
                }
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
                onSubmit={(e) => e.preventDefault()}
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
                    onClick={(e) => handleSubmit(e)}
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
