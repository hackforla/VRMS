import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { HeaderBarTextOnly } from '../components/Header';
import AddEvent from '../components/addNew/AddEvent';
import { UserProvider, UserContext } from '../context/userContext';
import useAuth from '../hooks/useAuth';
import '../sass/AddNew.scss';

const AddNew = (props) => {
	// State Data
<<<<<<< HEAD
	const [projects, setProjects] = useState(null);
=======
	const [projects, setProjects] = useState([]);
>>>>>>> 3d4a1c902a85712644b0b4d30bb0ff12081f1235
	const [redirectLink, setRedirectLink] = useState('');
	const [error, setError] = useState(null);

	const auth = useAuth();

	useEffect(() => {
		const getProjects = async () => {
			const prjs = await fetch('/api/projects', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((res) => {
<<<<<<< HEAD
					return res.json();
=======
					if (res.ok) {
						return res.json();
					}
					throw new Error(res.statusText);
>>>>>>> 3d4a1c902a85712644b0b4d30bb0ff12081f1235
				})
				.catch((err) => {
					console.log(err);
				});
<<<<<<< HEAD
				
=======

>>>>>>> 3d4a1c902a85712644b0b4d30bb0ff12081f1235
			setProjects(prjs);
		};

		getProjects();
	}, []);

	return auth && auth.user ? (
		redirectLink ? (
			<Redirect to={redirectLink} />
		) : (
			<div className='flex-container'>
				<HeaderBarTextOnly>Add New {props.match.params.item}</HeaderBarTextOnly>
				{props.match.params.item === 'event' && (
					<UserProvider>
						<AddEvent
<<<<<<< HEAD
							projects={projects && projects}
=======
							projects={projects}
>>>>>>> 3d4a1c902a85712644b0b4d30bb0ff12081f1235
							error={error}
							setError={setError}
							setRedirectLink={setRedirectLink}
						/>
					</UserProvider>
				)}
			</div>
		)
	) : (
		<Redirect to='/login' />
	);
};

export default AddNew;
