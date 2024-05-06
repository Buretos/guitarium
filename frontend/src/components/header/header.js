import { ControlPanel, Logo } from './components';
import styled from 'styled-components';

const Discription = styled.div`
	margin-top: 8px;
	font-style: italic;
`;

const HeaderContainer = ({ className }) => (
	<header className={className}>
		<Logo />
		<Discription>
			Гитары, струны и аксессуары,
			<br />
			история, учебники, ноты...
		</Discription>
		<ControlPanel />
	</header>
);

export const Header = styled(HeaderContainer)`
	display: flex;
	justify-content: space-between;
	background-color: #fff;
	position: fixed;
	top: 0;
	z-index: 10;
	width: 1000px;
	height: 120px;
	padding: 20px 40px;
	box-shadow: 0px -2px 17px #000;
`;
