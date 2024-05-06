// Компонент получается из store redux текущего пользователя и запрошивает с сервера данные о пользователях и список ролей. При успешном получении возвращает контент страницы администрирования пользователей

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../selectors';
import { H2, Loader, PrivateContent } from '../../components';
import { TableRow, UserRow } from './components';
import { ROLE } from '../../constants';
import { checkAccess } from '../../utils/check-access';
import styled from 'styled-components';
import { request } from '../../utils/request';

const UsersContainer = ({ className }) => {
	const [users, setUsers] = useState([]); // Стейт массива users, добавляется с сервера
	const [roles, setRoles] = useState([]); // Стейт массива roles, добавляется с сервера
	const [shouIdUpdateUserList, setShouIdUpdateUserList] = useState(false); // Стейт флага изменения списка пользователей (для рендеринга через useEffect)
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null); // Стейт сообщения об ошибке, получается с сервера
	const userRole = useSelector(selectUserRole); // роль текущего пользователя, вошедшего в сессию (берётся из селектора store redux)

	useEffect(() => {
		// Обращение к серверу через useEffect

		// Сначала проверяем права доступа текущего пользователя на страницу, чтобы лишний раз не запрашивать сервер. По хорошему эту проверку надо положить в каждый обработчик, и мы положим хотя в этом компоненте есть ещё только один обработчик -)))
		if (!checkAccess([ROLE.ADMIN], userRole)) {
			return;
		}
		setIsLoading(true);
		// Итак, проверка прошла успешно, теперь ответ должен вернуться и по пользователям и по ролям. Нам нужны оба ответа поэтому и Promise.all (для оптимизации скорости запросов), хотя можно запросить и по отдельности, но времени уйдёт больше.
		Promise.all([request('/users'), request('/users/roles')]).then(
			([usersRes, rolesRes]) => {
				setIsLoading(false);
				if (usersRes.error || rolesRes.error) {
					// Проверка ответа запросов на ошибки, если они есть, то текст соответствующей ошибки передаётся в errorMessage
					setErrorMessage(usersRes.error || rolesRes.error);
					return;
				}
				// После безошибочного ответа получаем и записываем массивы users и roles
				setUsers(usersRes.data);
				setRoles(rolesRes.data);
			},
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouIdUpdateUserList, userRole]);

	const onUserRemove = (userId) => {
		// функция-обработчик с кнопки удаления пользователя
		if (!checkAccess([ROLE.ADMIN], userRole)) {
			// проверка прав на удаление пользователя
			return;
		}

		request(`/users/${userId}`, 'DELETE').then(() => {
			// Обращение к серверу для удаления
			setShouIdUpdateUserList(!shouIdUpdateUserList); // Инвертируем флаг изменения списка пользователей для рендеринга через useEffect
		});
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
							{users.map(
								// распечатка массива пользователей построчно
								({ id, login, registeredAt, roleId }) => (
									<UserRow // Компонент строки пользователя
										key={id}
										id={id}
										login={login}
										registeredAt={registeredAt}
										roleId={roleId}
										roles={roles.filter(
											// передача в строку пользователя списка (массива) ролей, полученных с срвера без роли "Гость", т.к. эта роль присваивается незарегистрированным пользователям, которых нет в природе
											({ id: roleId }) => roleId !== ROLE.GUEST,
										)}
										onUserRemove={() => onUserRemove(id)} // id на каждый элемент массива (строки пользователя) уже есть. Вешаем на кждый элемент массива обработчик для удаления пользователя. Передаём его в пропсы компонента UserRow (строки таблицы пользователей), чтобы прикрепить его там к кнопке удаления.
									/>
								),
							)}
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
