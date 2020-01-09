import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';

import '../sass/MagicLink.scss';

const MagicLink = (props) => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [event, setEvent] = useState([]);
    // const [isError, setIsError] = useState(null);
    // const [magicLink, setMagicLink] = useState('https://localhost:3000/api/happyURLfuntime');

    // async function fetchData() {
    //     try {
    //         const res = await fetch(`http://localhost:4000/api/events/${props.match.params.id}`);
    //         const resJson = await res.json();
    //         setEvent(resJson);
    //     } catch(error) {
    //         setIsError(error);
    //         alert(error);
    //     }
    // }

    // function forwardRequest() {
    //     return props.history.push('/user');
    // }

    useEffect(() => {
        // fetchData();

        // setTimeout(forwardRequest
        // , 5000);



    }, []);

    return (
        <div className="flex-container">
            <div className="new">
                <div className="new-headers">
                    {/* <h3>Magic Link Sent</h3> */}
                    <h3>Success!</h3>
                    {/* <h4>You gotta go click it!</h4>
                    <h5>You'll be returned to a page containing a brand spanking new user profile all to yourself!</h5> */}

                </div>
            </div>
        </div>
    )
};

export default MagicLink; 