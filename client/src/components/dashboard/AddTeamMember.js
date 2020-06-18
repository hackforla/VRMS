import React from 'react';

const AddTeamMember = props => {
  
  const handleSubmit = e => {
    console.log('success');
  }

  return (
    <div className="flex-container">
      <div className="addmember-container">
          <form className="form-check-in" autoComplete="off" onSubmit={e => e.preventDefault()}>
            <div className="form-row">
              <div className="form-input-text">
                <label htmlFor="email">Enter email address:</label>
                <input 
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  // value={email.toString()}
                  // onChange={e => handleInputChange(e)}
                  aria-label="Email Address"
                  autoComplete="none"
                  required="required"
                /> 
              </div>
            </div>
          </form>

          {/* <div className="addmember-warning">
            {isError ? errorMessage : null}
          </div> */}

          <div className="form-input-button">
            <button
              onClick={e => handleSubmit(e)}
              className="addmember-button"
            >
              Add
            </button>
          </div>
              
        </div>
      </div>
  );
}

export default AddTeamMember;
