import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend} from "../utils/globalSettings";

const ProjectTeamMemberApi = {
  /**
   * @returns created projectTeamMember object
   * @param {object} member object with required paramters userId, projectId. For
   * other optional parameters, see projectTeamMember model
   */
  postMember(member) {
    console.log({member});
    return fetch('/api/projectteammembers', {
      method: 'POST', 
      headers: {
        "Content-Type": "application/json",
        "x-customrequired-header": headerToSend
      },
      body: JSON.stringify(member)
    })
      .then((res) => (!res.ok) 
        ? res.json().then((e) => Promise.reject(e)) 
        : res.json()
      )
  }
}

export default ProjectTeamMemberApi;