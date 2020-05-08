import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { HeaderBarTextOnly } from '../components/Header';
import AddEvent from '../components/addNew/AddEvent';
import { UserProvider, UserContext } from '../context/userContext';
import useAuth from '../hooks/useAuth';
import '../sass/AddNew.scss';

const AddNew = (props) => {
	// State Data
	const [projects, setProjects] = useState([]);
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
					if (res.ok) {
						return res.json();
					}
					throw new Error(res.statusText);
				})
				.catch((err) => {
					console.log(err);
				});

			setProjects(prjs);
		};

		getProjects();
	}, []);

	return auth && auth.user ? (
		<div className='flex-container'>
			<HeaderBarTextOnly>Add New {props.match.params.item}</HeaderBarTextOnly>
			{props.match.params.item === 'event' && (
				<UserProvider>
						<AddEvent projects={projects} error={error} setError={setError} />
				</UserProvider>
			)}
		</div>
	) : (
		<Redirect to='/login' />
	);
};

export default AddNew;
