import styled from "@emotion/styled";

export const MainButton = styled.button`
	width: 100%;
	height: 36px;
	border-radius: 4px;
	font-size: 1.2rem;
	color: white;
	background-color: #ff5b37;
    font-size: 1rem;

	&:hover {
		background-color: #e75332;
	}

	&:disabled {
		background-color: lightgrey;
		cursor: not-allowed;
	}
`;

export const SecondaryButton = styled(MainButton)`
    border: 1px solid #ff5b37;
    color: #ff5b37;
    background-color: whitesmoke;
    grid-area: secondary;

	&:hover {
		background-color: #FEDFD8;
	}

	&:disabled {
		background-color: whitesmoke;
		color: lightgrey;
		border: 1px solid lightgrey;
	}
`

export const ReturnButton = styled(MainButton)`
	grid-area: main;
`