import React, { useState, useEffect } from "react";
import moment from "moment";
import NewUserForm from "./../components/presentational/newUserForm";
import ReturnUserForm from "./../components/presentational/returnUserForm";

import "../sass/CheckIn.scss";

const CheckInForm = props => {
  const [isLoading, setIsLoading] = useState(false);
  // const [isFormReady, setIsFormReady] = useState(true);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newOrReturning] = useState(props && props.match.params.userType);
  // const [newProfile] = useState(props && props.match.params.userType);
  const [eventId, setEventId] = useState(props.location.search.slice(9, props.location.search.length));
  const [formInput, setFormInput] = useState({
    email: "",
    currentRole: "",
    desiredRole: "",
    attendanceLength: ""
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newMember, setNewMember] = useState(true);
  const [month, setMonth] = useState(
    moment()
      .format("MMM")
      .toUpperCase()
  );
  const [year, setYear] = useState(moment().format("YYYY"));
  const [reason, setReason] = useState("--SELECT ONE--");
  const [project, setProject] = useState("--SELECT ONE--");
  const [user, setUser] = useState(null);
  console.log(props.location.pathname);

  // form data to fill drop-downs
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ];
  const years = [
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013"
  ];
  const reasons = [
    "--SELECT ONE--",
    "Open Data",
    "Homelessness",
    "Social Justice/Equity",
    "Transportation",
    "Mental Health",
    "Civic Engagement",
    "Environment",
    "Education/STEM",
    "Fundraising"
  ];
  
  const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/questions", {
        headers: {
            "x-customrequired-header": headerToSend
        }
      });
      const resJson = await res.json();

      setQuestions(resJson);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleInputChange = e =>
    setFormInput({
      ...formInput,
      [e.currentTarget.name]: e.currentTarget.value
    });

  const handleFirstNameChange = e => setFirstName(e.currentTarget.value);

  const handleLastNameChange = e => setLastName(e.currentTarget.value);

  const handleMonthChange = e => setMonth(e.currentTarget.value);

  const handleYearChange = e => setYear(e.currentTarget.value);

  const handleReasonChange = e => {
    setReason(e.currentTarget.value);
    setIsQuestionAnswered(true);
  };

  const handleProjectChange = e => {
    setProject(e.currentTarget.value);
    setIsQuestionAnswered(true);
  };

  const handleNewMemberChange = e => {
    if (e.target.value === "true") {
      setNewMember(true);
      setMonth(
        moment()
          .format("MMM")
          .toUpperCase()
      );
      setYear(moment().format("YYYY"));
    }

    if (e.target.value === "false") {
      setNewMember(false);
    }
  };

  const submitForm = (userForm) => { 
    // First, create a new user in the user collection
    const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

    fetch('/api/users', {
        method: "POST",
        body: JSON.stringify(userForm),
        headers: {
            "Content-Type": "application/json",
            "x-customrequired-header": headerToSend
        }
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            
            throw new Error(res.statusText);
        })
        .then(responseId => {
            if (responseId.includes('E11000')) {
                setIsError(true);
                setErrorMessage('Email address is already in use.')
            } else {
                const checkInForm = { userId: (responseId), eventId: new URLSearchParams(props.location.search).get('eventId') };

                return fetch('/api/checkins', {
                    method: "POST",
                    body: JSON.stringify(checkInForm),
                    headers: {
                        "Content-Type": "application/json",
                        "x-customrequired-header": headerToSend
                    }
                })
                    .then(res => {
                        props.history.push(`/success?eventId=${eventId}`);
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => {
            console.log(err);
        });
}

const submitReturning = (returningUser, e = null) => {
    e && e.preventDefault();
    
    const answer = {
        newMember: false
    };

    if (reason !== "--SELECT ONE--") {
        answer.attendanceReason = reason;
    }

    // if (project !== "--SELECT ONE--") {
    //     answer.currentProject = project;
    // }

    // if ((returningUser.attendanceReason === undefined && reason === "--SELECT ONE--") || (returningUser.currentProject === undefined && project === "--SELECT ONE--")) {
    // if (returningUser.attendanceReason === undefined && reason === "--SELECT ONE--") {
    //   console.log('something should be selected');
    //     alert('Answer the question to unlock the check-in button!');
    // } else {
        // console.log(answer);

        const answerJson = JSON.stringify(answer);

        // console.log(answerJson);

        try {
            const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

            fetch(`/api/users/${returningUser._id}`, {
                method: "PATCH",
                body: answerJson,
                headers: {
                    "Content-Type": "application/json",
                    "x-customrequired-header": headerToSend
                }
            })
            .then(res => {
              console.log('res.ok, 209', res.ok);
              if (res.ok) {
                return res.json(); 
              }

              throw new Error(res.statusText)
            })
            .then(response => {
                const checkInForm = { userId: `${returningUser._id}`, eventId: new URLSearchParams(props.location.search).get('eventId') };
    
                // console.log(`Here's the form: ${checkInForm.toString()}`);
    
                return fetch('/api/checkins', {
                    method: "POST",
                    body: JSON.stringify(checkInForm),
                    headers: {
                        "Content-Type": "application/json",
                        "x-customrequired-header": headerToSend
                    }
                })
                .then(res => {
                    if (res.ok) {
                      return props.history.push('/success'); 
                    }
                    console.log('throwing new error in line 230');
                    throw new Error(res.statusText);
                })
                .catch(error => {
                  console.log(error.error);
                  setIsError(true);
                  setErrorMessage(error);
                  setIsLoading(false);
                })
            })
            .catch(error => {
              console.log(error);
              setIsError(true);
              setErrorMessage(error);
              setIsLoading(false);
            })              
        } catch (error) {
            console.log(error);
            setIsError(true);
            setErrorMessage(error);
            setIsLoading(false);
        }
    // }
}

const submitNewProfile = (userForm) => { 
  // First, create a new user in the user collection
  const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

  fetch('/api/users', {
      method: "POST",
      body: JSON.stringify(userForm),
      headers: {
          "Content-Type": "application/json",
          "x-customrequired-header": headerToSend
      }
  })
      .then(res => {
          if (res.ok) {
              return res.json();
          }
          
          throw new Error(res.statusText);
      })
      .then(responseId => {
          if (responseId.includes('E11000')) {
              setIsError(true);
              setErrorMessage('Email address is already in use.')
          } else {
            props.history.push(`/success`);
          }
      })
      .catch(err => {
          console.log(err);
      });
}

// const submitReturningUserForm = (email) => {
//     // First, create a new user in the user collection

//     fetch(`/api/users?email=${email}`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//         .then(res => {
//             return res.json();
//         })
//         .then(responseId => {

//             const answer = { 
//                 attendanceReason: reason
//             };

//             // const answer = { 
//             //     whichProject: project
//             // };

//             const answerJson = JSON.stringify(answer);

//             if (responseId === false) {
//                 setIsError(true);
//                 setErrorMessage("You haven't checked in with that email. Redirecting home to create a new profile...");

//                 setTimeout(() => {
//                     props.history.push("/");
//                 }, 4000)
//             } else {
//                 return fetch(`/api/users/${responseId}`, {
//                     method: "PATCH",
//                     body: answerJson,
//                     headers: {
//                         "Content-Type": "application/json"
//                     }
//                 })
//                 .then(res => {
//                     return res.json();
//                 })
//                 .then(response => {
//                     const checkInForm = { userId: `${response}`, eventId: new URLSearchParams(props.location.search).get('eventId') };

//                     // console.log(`Here's the form: ${checkInForm.toString()}`);

//                     return fetch('/api/checkins', {
//                         method: "POST",
//                         body: JSON.stringify(checkInForm),
//                         headers: {
//                             "Content-Type": "application/json"
//                         }
//                     })
//                     .then(res => {
//                         if (res.ok) {
//                             props.history.push('/success');
//                         }
//                     })
//                     .catch(err => console.log(err));
//                 })                    
//                 .catch(err => console.log(err));
//             }
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }

// function checkIsEmptyField(obj) {
//     if (!Object.values(obj).some(key => (key !== null && key !== ''))) {
//         setIsError(true);
//         setErrorMessage("Please don't leave any fields blank");
//         setIsFormReady(false);
//     }  
// } 

const checkInNewUser = (e) => {
    e.preventDefault();

    const firstAttended = `${month} ${year}`;
        
    // SET all of the user's info from useState objects
    const userForm = { 
        name: { 
            firstName, 
            lastName 
        }, 
        ...formInput,
        newMember,
        firstAttended
    };

    let ready = true;

    try {
        setIsLoading(true);

        if (
            userForm.name.firstName === "" || 
            userForm.name.lastName === "" || 
            userForm.email === "" || 
            userForm.currentRole === "" || 
            userForm.desiredRole === "" || 
            firstAttended === ""
        ) {
            setIsError(true);
            setErrorMessage("Please don't leave any fields blank");
            ready = false;
        } 
        
        const currYear = parseInt(moment().format('YYYY'));
        const currMonth = parseInt(moment().format('MM'));
        const yearJoined = parseInt(year);
        // extra date info needed to be recognized as a date
        const monthJoined = parseInt(moment(month + ' 9, 2020').format('MM')); 
        // console.log(currYear, currMonth, yearJoined, monthJoined);
        if(yearJoined > currYear || (yearJoined === currYear && monthJoined > currMonth)) {
            setIsError(true);
            setErrorMessage("You can't set a date in the future... Please try again.");
            ready = false;
        } 

        // console.log(isFormReady);

        // SUBMIT all of the user's info from the userForm object
        if(ready) {
            submitForm(userForm);
        }  

        setIsLoading(false);

    } catch(error) {
        console.log(error);
        setIsLoading(false);
    }
}

const createNewProfile = (e) => {
  e.preventDefault();

  const firstAttended = `${month} ${year}`;
      
  // SET all of the user's info from useState objects
  const userForm = { 
      name: { 
          firstName, 
          lastName 
      }, 
      ...formInput,
      newMember,
      firstAttended
  };

  let ready = true;

  try {
      setIsLoading(true);

      if (
          userForm.name.firstName === "" || 
          userForm.name.lastName === "" || 
          userForm.email === "" || 
          userForm.currentRole === "" || 
          userForm.desiredRole === "" || 
          firstAttended === ""
      ) {
          setIsError(true);
          setErrorMessage("Please don't leave any fields blank");
          ready = false;
      } 
      
      const currYear = parseInt(moment().format('YYYY'));
      const currMonth = parseInt(moment().format('MM'));
      const yearJoined = parseInt(year);
      // extra date info needed to be recognized as a date
      const monthJoined = parseInt(moment(month + ' 9, 2020').format('MM')); 
      // console.log(currYear, currMonth, yearJoined, monthJoined);
      if(yearJoined > currYear || (yearJoined === currYear && monthJoined > currMonth)) {
          setIsError(true);
          setErrorMessage("You can't set a date in the future... Please try again.");
          ready = false;
      } 

      // console.log(isFormReady);

      // SUBMIT all of the user's info from the userForm object
      if(ready) {
          submitNewProfile(userForm);
      }  

      setIsLoading(false);

  } catch(error) {
      console.log(error);
      setIsLoading(false);
  }
}

// const checkInReturningUser = (e) => {
//     e.preventDefault();

//     try {
//         setIsLoading(true);

//         // v1: Get userId from auth cookie (JWT) => return it in response
//         // fetch to create checkin using userId
    
//         submitReturningUserForm(formInput.email);

//         console.log('Checking in Returning User');

//         setIsLoading(false);
//     } catch(error) {
//         console.log(error);
//         setIsLoading(false);
//         // setIsError(error);
//         // alert(error);
//     }
// }

const checkEmail = (e) => {
    e.preventDefault();

    try {
        if (!formInput.email) {
          throw new Error("User email is required");
        }

        setIsLoading(true);

        fetch('/api/checkuser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-customrequired-header": headerToSend
            },
            body: JSON.stringify({ email: formInput.email })
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            
            throw new Error(res.statusText);
        })
        .then(resJson => {
          // console.log(resJson);
            setUser(resJson);
            setIsLoading(false);
            resJson && submitReturning(resJson);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
        })
    } catch (error) {
        console.log(error);
        setIsError(true);
        setErrorMessage(error)
        setIsLoading(false);
    }
}

// function getFormValue() {
//     if (Object.keys(formInput).includes(questions[0].htmlName.toString())) {
//         return `{formInput.${questions[0].htmlName.toString()}.toString()}`
//     } 
// }

useEffect(() => {
    fetchQuestions();

}, []);

  return (
    <div className="flex-container">
      {props.location.pathname === '/newProfile' && (
        <NewUserForm
          firstName={firstName}
          handleFirstNameChange={handleFirstNameChange}
          lastName={lastName}
          handleLastNameChange={handleLastNameChange}
          formInput={formInput}
          handleInputChange={handleInputChange}
          questions={questions}
          handleNewMemberChange={handleNewMemberChange}
          handleMonthChange={handleMonthChange}
          newMember={newMember}
          months={months}
          month={month}
          handleYearChange={handleYearChange}
          years={years}
          isError={isError}
          errorMessage={errorMessage}
          isLoading={isLoading}
          checkInNewUser={checkInNewUser}
        />
      )}

      {newOrReturning === "returningUser" && (
        <ReturnUserForm
          user={user}
          formInput={formInput}
          handleInputChange={handleInputChange}
          isError={isError}
          errorMessage={errorMessage}
          isLoading={isLoading}
          checkEmail={checkEmail}
          questions={questions}
          reason={reason}
          handleReasonChange={handleReasonChange}
          reasons={reasons}
          project={project}
          handleProjectChange={handleProjectChange}
          isLoading={isLoading}
          submitReturning={submitReturning}
          //   yearhandleYearChange={yearhandleYearChange}
        />
      )}
      
      {newOrReturning === "newUser" && (
        <NewUserForm
          firstName={firstName}
          handleFirstNameChange={handleFirstNameChange}
          lastName={lastName}
          handleLastNameChange={handleLastNameChange}
          formInput={formInput}
          handleInputChange={handleInputChange}
          questions={questions}
          handleNewMemberChange={handleNewMemberChange}
          handleMonthChange={handleMonthChange}
          newMember={newMember}
          months={months}
          month={month}
          handleYearChange={handleYearChange}
          years={years}
          isError={isError}
          errorMessage={errorMessage}
          isLoading={isLoading}
          checkInNewUser={checkInNewUser}
        />
      )}
    </div>
  );
};

export default CheckInForm;
