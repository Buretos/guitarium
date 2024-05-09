// Компонент строки пользователя на странице администрирования пользователей. Получает массив пользователей, доступные варианты выбора ролей для них. Содержит кнопки сохранить изменённые данные и удалить пользователя.

import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '../../../../components';
import { TableRow } from '../table-row/table.row';
import { PROP_TYPE } from '../../../../constants';
import styled from 'styled-components';
import { request } from '../../../../utils/request';
import { formatDateAndTime } from '../../../../utils';

const UserRowContainer = ({
	className,
	id,
	login,
	registeredAt,
	roleId: userRoleId,
	roles,
	onUserRemove,
}) => {
	const [initialRoleId, setInitialRoleId] = useState(userRoleId); // изначальная (текущая) роль пользователя, отображаемая в поле выбора ролей (см. тег select)
	const [selectedRoleId, setSelectedRoleId] = useState(userRoleId); // Новая роль выбранная из списка (перед выбором она соответствует текущей роли)

	const onRoleChange = ({ target }) => {
		// обработчик изменения роли выбранной из  выпадающего списка ролей
		setSelectedRoleId(Number(target.value)); // изменение id  роли на выбранное значение поля, value={roleId}
	};

	const onRoleSave = (userId, newUserRoleId) => {
		// обработчие сохранения выбранной роли
		request(`/users/${userId}`, 'PATCH', { roleId: newUserRoleId }).then(() => {
			// рапрос на сервер и обновление id роли в методе users
			setInitialRoleId(newUserRoleId);
		});
	};

	const isSaveButtonDisabled = selectedRoleId === initialRoleId; // флаг выключения активности кнопки сохранить при совпадении выбранной роли с изначальной раолью, т.е.  когда роль не изменилась

	return (
		<div className={className}>
			<TableRow border={true}>
				<div className="login-column">{login}</div>
				<div className="registered-at-column">
					{formatDateAndTime(registeredAt)}
				</div>
				<div className="role-column">
					<select value={selectedRoleId} onChange={onRoleChange}>
						{roles.map(
							(
								{ id: roleId, name: roleName }, // вывод выпадающего списка ролей (массивом map) по названию roleName контекст тега option, который соответствует полю name, и значению, соответствующему полю id массива roles, т.е. roleId
							) => (
								<option key={roleId} value={roleId}>
									{roleName}
								</option>
							),
						)}
					</select>
					<div className="save-role-button">
						<Icon
							id="fa-floppy-o"
							margin="0 0 0 10px"
							disabled={isSaveButtonDisabled}
							onClick={() => onRoleSave(id, selectedRoleId)}
						/>
					</div>
				</div>
			</TableRow>
			<Icon id="fa-trash-o" margin="0 0 0 10px" onClick={onUserRemove} />
		</div>
	);
};

export const UserRow = styled(UserRowContainer)`
	display: flex;
	margin-top: 10px;

	& select {
		font-size: 16px;
		padding: 0 5px;
	}
`;

UserRow.propTypes = {
	id: PropTypes.string.isRequired,
	login: PropTypes.string.isRequired,
	registeredAt: PropTypes.string.isRequired,
	roleId: PropTypes.number.isRequired,
	roles: PropTypes.arrayOf(PROP_TYPE.ROLE).isRequired,
	onUserRemove: PropTypes.func.isRequired,
};
