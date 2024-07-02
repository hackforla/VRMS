import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import "../../sass/AddTeamMember.scss";

const AddTeamMember = (props) => {
    const [email, setEmail] = useState("");

    const handleInputChange = (e) => setEmail(e.currentTarget.value);

    return (
        <Box className="flex-container">
            <Box className="addmember-container">
                <form
                className="form-add-member"
                autoComplete="off"
                onSubmit={(e) => props.addToTeamHandler(e, email)}
                >
                <Box className="form-row">
                    <Box className="form-input-text">
                    <TextField 
                        label = "Add team member"
                        type = "email"
                        name=  "email"
                        placeholder="Email Address"
                        value={email.toString()}
                        onChange={(e) => handleInputChange(e)}
                        aria-label="Email Address"
                        autoComplete="none"
                        required="required"
                    />
                    </Box>
                </Box>

                <Box className="form-input-button">
                    <Button
                        type="submit"
                        className="addmember-button"
                        variant="contained"
                        color="primary"
                    >
                        Add
                    </Button>
                </Box>
                </form>
                {props.isSuccess && <Typography className="addmember-success">User Added</Typography>}
                {props.isError && <Typography className="addmember-warning">{props.errorMessage}</Typography>}
            </Box>
        </Box>
    );
};

export default AddTeamMember;
