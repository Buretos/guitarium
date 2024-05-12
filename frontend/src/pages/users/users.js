import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserRole } from '../../selectors';
import { H2, Loader, PrivateContent } from '../../components';
import { TableRow, UserRow } from './components';
import { ROLE } from '../../constants';
import { checkAccess } from '../../utils/check-access';
import styled from 'styled-components';
import { request } from '../../utils/request';
import { CLOSE_MODAL, openModal } from '../../actions';

const UsersContainer = ({ className }) => {
	const dispatch = useDispatch();
	const [users, setUsers] = useState([]);
	const [roles, setRoles] = useState([]);
	const [shouIdUpdateUserList, setShouIdUpdateUserList] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const userRole = useSelector(selectUserRole);

	useEffect(() => {
		if (!checkAccess([ROLE.ADMIN], userRole)) {
			return;
		}
		setIsLoading(true);
		Promise.all([request('/users'), request('/users/roles')]).then(
			([usersRes, rolesRes]) => {
				setIsLoading(false);
				if (usersRes.error || rolesRes.error) {
					setErrorMessage(usersRes.error || rolesRes.error);
					return;
				}
				setUsers(usersRes.data);
				setRoles(rolesRes.data);
			},
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouIdUpdateUserList, userRole]);

	const onUserRemove = (userId) => {
		dispatch(
			openModal({
				text: 'Удалить этого пользователя?',
				onConfirm: () => {
					if (!checkAccess([ROLE.ADMIN], userRole)) {
						return;
					}
					request(`/users/${userId}`, 'DELETE').then(() => {
						setShouIdUpdateUserList(!shouIdUpdateUserList);
					});
					dispatch(CLOSE_MODAL);
				},
				onCancel: () => dispatch(CLOSE_MODAL),
			}),
		);
	};

	return (
		<PrivateContent access={[ROLE.ADMIN]} serverError={errorMessage}>
			<div className={className}>
				{isLoading ? (
					<Loader />
				) : (
					<>
						<H2>Пользователи</H2>
						<div>
							<div>
								<TableRow>
									<div className="login-column">Логин</div>
									<div className="registered-at-column">
										Дата регистрации
									</div>
									<div className="role-column">Роль</div>
								</TableRow>
							</div>
							{users.map(({ id, login, registeredAt, roleId }) => (
								<UserRow
									key={id}
									id={id}
									login={login}
									registeredAt={registeredAt}
									roleId={roleId}
									roles={roles.filter(
										({ id: roleId }) => roleId !== ROLE.GUEST,
									)}
									onUserRemove={() => onUserRemove(id)}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</PrivateContent>
	);
};

export const Users = styled(UsersContainer)`
	display: flex;
	align-items: center;
	flex-direction: column;
	margin: 0 auto;
	width: 570px;
	}
`;
