// I M P O R T S
import React from "react";
import styled from "@emotion/styled";
import { CurrentBook, IResults } from "../helpers/Interfaces";


// C O M P O N E N T
interface InformationProps {
	currentBook?: CurrentBook | null;
	index: number;
	results: IResults[] | [];
	showingSavedBook: boolean;
}

const Information: React.FC<InformationProps> = ({
	currentBook,
	index,
	results,
	showingSavedBook,
}) => {
	return (
		<InformationWrapper>
			{results.length > 0 ? (
				<CurrentResult>
					{" "}
					{!showingSavedBook ? `${index + 1} / ${results.length}` : null}
				</CurrentResult>
			) : (
				<CurrentResult></CurrentResult>
			)}
				<Label>Author</Label>
				<div className="goblin">
					{currentBook ? currentBook.author.join(", ") : "Author"}
				</div>
				<Label>Release Year</Label>
				<div className="goblin">
					{currentBook ? currentBook.published : "not available"}
				</div>
				<Label>Page Count</Label>
				<div className="goblin">
					{currentBook ? currentBook.pageCount : "not available"}
				</div>
				<Label>Synopsis</Label>
			<ScrollWrapper>
				<Synopsis>
					{currentBook ? currentBook.description : "not available"}
				</Synopsis>
			</ScrollWrapper>
		</InformationWrapper>
	);
};

export default Information;


// S T Y L E S
const InformationWrapper = styled.div`
	width: 50%;
	max-width: 650px;
	height: 100%;
	padding-top: 120px;
	padding-right: 100px;
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 5;
	overflow: auto;

	.goblin {
		font-family: "Goblin One";
		font-size: 1.2rem;
	}

	h2 {
		font-family: "Goblin One";
		font-size: 2.5rem;
	}
`;

const CurrentResult = styled.div`
	text-align: end;
	width: 100%;
	height: 1rem;
	padding-bottom: 75px;
	border-bottom: 0.5px solid black;
`;

const Label = styled.div`
	font-size: 0.8rem;
	text-transform: uppercase;
	letter-spacing: 1px;
	margin-top: 30px;
	margin-bottom: 5px;
`;

const ScrollWrapper = styled.div`
	width: 100%;
	flex-grow: 1;
	overflow: auto;
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */

	&::-webkit-scrollbar {
		display: none; /* Hide scrollbar for Chrome, Safari and Opera */
	}

	&:hover {
		/* overflow-y: scroll; */
	}
`;

const Synopsis = styled.div`
	padding-bottom: 100px;
`;
