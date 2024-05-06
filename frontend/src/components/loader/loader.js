import styled, { keyframes } from 'styled-components';

// Define the keyframes for the spin animation
const spin = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
`;

export const Loader = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 50px;
	height: 50px;
	border: 5px solid gray;
	border-top-color: transparent;
	border-radius: 50%;
	animation: ${spin} 1s linear infinite;
`;
