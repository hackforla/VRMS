export async function goFetch (endPoint, fetchMethod, updateBody ) {

  //const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

    const url = endPoint;
    const requestOptions = {
      method: fetchMethod,
      headers: {
          "Content-Type": "application/json",
          "x-customrequired-header": headerToSend
      },
      if () {
        body: JSON.stringify({ updateBody })
      }
    };

    try {
        const response = await fetch(url, requestOptions); 
        const resJson = await response.json();
        return resJson;
    } catch (error) {
        console.log(`update user error: `, error);
        alert("Server not responding.  Please try again.");
    }
}
