import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from '../../../../components';
import { ROLE } from '../../../../constants';
import { selectCart, selectUserLogin, selectUserRole } from '../../../../selectors';
import { clearCart, logout } from '../../../../actions';
import styled from 'styled-components';
import { checkAccess } from '../../../../utils';

const RightAligned = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

const UserName = styled.div`
	font-size: 22px;
	font-weight: bold;
`;

const ControlPanelContainer = ({ className }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const roleId = useSelector(selectUserRole);
	const login = useSelector(selectUserLogin);
	const cart = useSelector(selectCart);
	const countAll = cart.productsInCart.reduce((sum, item) => sum + item.count, 0);

	const onLogout = () => {
		dispatch(logout());
		sessionStorage.removeItem('userData');
		dispatch(clearCart());
	};
	const isAdmin = checkAccess([ROLE.ADMIN], roleId);
	const isSalesman = checkAccess([ROLE.SALESMAN], roleId);

	return (
		<div className={className}>
			<RightAligned>
				{roleId === ROLE.GUEST ? (
					<Button width="30%">
						<Link to="/login">Войти</Link>
					</Button>
				) : roleId === ROLE.CLIENT ? (
					<>
						<UserName title="покупатель">{login}</UserName>
						<Icon
							title="выход"
							id="fa-sign-out"
							margin="0 0 0 10px"
							onClick={onLogout}
						/>
					</>
				) : roleId === ROLE.SALESMAN ? (
					<>
						<UserName title="продавец">{login}</UserName>
						<Icon
							id="fa-sign-out"
							title="выход"
							margin="0 0 0 10px"
							onClick={onLogout}
						/>
					</>
				) : (
					<>
						<UserName title="администратор">{login}</UserName>
						<Icon
							id="fa-sign-out"
							title="выход"
							margin="0 0 0 10px"
							onClick={onLogout}
						/>
					</>
				)}
			</RightAligned>
			<RightAligned>
				<Icon
					title="Bернуться на предыдущую страницу"
					id="fa fa-arrow-left"
					margin="10px 0 0 0"
					onClick={() => navigate(-1)}
				/>
				{roleId === ROLE.CLIENT || roleId === ROLE.GUEST ? (
					<Link to="/cart">
						<div className="cart">
							<div className="iconCart">
								<Icon
									title="Корзина"
									id="fa-shopping-cart"
									margin="10px 0 0 10px"
								/>
							</div>
							<div className="countCart">{countAll}</div>
						</div>
					</Link>
				) : (
					<></>
				)}

				{isSalesman && (
					<>
						<Link to="/products">
							<Icon
								title="добавление нового товара"
								id="fa fa-plus"
								margin="10px 0 0 16px"
							/>
						</Link>
					</>
				)}

				{(roleId === ROLE.CLIENT || roleId === ROLE.SALESMAN) && (
					<>
						<Link to="/orders">
							<Icon
								title="история покупок"
								id="fa fa-archive"
								margin="10px 0 0 16px"
							/>
						</Link>
					</>
				)}

				{isAdmin && (
					<>
						<Link to="/products">
							<Icon
								title="добавление нового товара"
								id="fa fa-plus"
								margin="10px 0 0 16px"
							/>
						</Link>
						<Link to="/users">
							<Icon
								title="управление пользователями"
								id="fa-user-plus"
								margin="10px 0 0 16px"
							/>
						</Link>
						<Link to="/orders">
							<Icon
								title="история покупок"
								id="fa fa-archive"
								margin="10px 0 0 16px"
							/>
						</Link>
					</>
				)}
			</RightAligned>
		</div>
	);
};

export const ControlPanel = styled(ControlPanelContainer)`
	width: 250px;

	& .cart {
		display: flex;
	}

	& .iconCart {
		display: flex;
		justify-content: space-between;
	}

	& .countCart {
		display: flex;
		justify-content: space-between;
		margin: 17px 0 0 8px;
	}
`;
