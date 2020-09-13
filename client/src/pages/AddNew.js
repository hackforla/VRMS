import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { HeaderBarTextOnly } from '../components/Header';
import AddEvent from '../components/addNew/AddEvent';
import { UserProvider } from '../context/userContext';
import useAuth from '../hooks/useAuth';
import '../sass/AddNew.scss';

const AddNew = (props) => {
	// State Data
	const [projects, setProjects] = useState(null);
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
					return res.json();
				})
				.catch((err) => {
					console.log(err);
				});
				
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
							projects={projects && projects}
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
