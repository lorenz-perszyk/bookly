// I M P O R T S
import React, { useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import {
	SwitchTransition,
	CSSTransition,
	Transition,
} from "react-transition-group";
import { CurrentBook } from "../helpers/Interfaces";
import { MainButton, SecondaryButton, ReturnButton } from "./Buttons";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { IResults } from "../helpers/Interfaces";
import { BsCheckCircle } from "react-icons/bs";
import backgroundTexture from "./src/assets/linen_texture.webp";
import divider from "../assets/divider.svg";
import shadow from "../assets/shadow.svg";

// C O M P O N E N T
interface CoverProps {
	currentBook: CurrentBook | null | undefined;
	showingSavedBook: boolean;
	index: number;
	results: IResults[] | [];
	bookshelf: {}[] | any[];
	nextBook: () => any;
	saveBook: () => any;
	prevBook: () => void;
	returnToSearchResults: () => void;
	addSuccess: () => void;
}

const Cover: React.FC<CoverProps> = ({
	currentBook,
	showingSavedBook,
	index,
	results,
	bookshelf,
	nextBook,
	saveBook,
	prevBook,
	returnToSearchResults,
	addSuccess,
}) => {
	const titleRef = useRef(null);

	const activateNextBook = () => {
		nextBook();
	};

	const activatePrevBook = () => {
		prevBook();
	};

	const addToShelf = () => {
		saveBook();
		addSuccess();
	};

	return (
		<CoverWrapper>
			<BookCover>
				{/* <CoverLine className="top" src={divider} /> */}
				{/* <CoverLine className="bottom" src={divider} /> */}
				<Shadow src={shadow} />
				<SwitchTransition mode={"out-in"}>
					<CSSTransition
						key={currentBook?.title}
						timeout={250}
						classNames="fade"
						nodeRef={titleRef}
					>
						<BookTitle ref={titleRef}>
							{currentBook && currentBook.title
								? currentBook.title
								: "Book Title"}
						</BookTitle>
					</CSSTransition>
				</SwitchTransition>
			</BookCover>
			{results.length !== 0 ? (
				<ButtonWrapper>
					{!showingSavedBook ? (
						<>
							<MainButton
								onClick={activatePrevBook}
								disabled={index + 1 === 1 ? true : false}
							>
								<BsArrowLeft
									css={css`
										margin-right: 12px;
									`}
								/>{" "}
								Previous
							</MainButton>
							<MainButton
								onClick={activateNextBook}
								disabled={index + 1 === results.length ? true : false}
							>
								Next{" "}
								<BsArrowRight
									css={css`
										margin-left: 12px;
									`}
								/>
							</MainButton>
						</>
					) : (
						<ReturnButton onClick={() => returnToSearchResults()}>
							Return to search results
						</ReturnButton>
					)}
					<SecondaryButton
						onClick={addToShelf}
						disabled={bookshelf.includes(currentBook ? true : false)}
					>
						Save to Bookshelf
					</SecondaryButton>
				</ButtonWrapper>
			) : null}
		</CoverWrapper>
	);
};

export default Cover;

// S T Y L E S
const CoverWrapper = styled.div(`
	width: 55%;
	height: 100%;
	position: relative;
	z-index: 5;
	padding: 5vh 40px 0 0;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
`);

const ButtonWrapper = styled.div`
	width: 300px;
	display: grid;
	grid-template: repeat(2, 1fr) / repeat(2, 1fr);
	grid-template-areas:
		"main main"
		"secondary secondary";
	gap: 1rem;

	svg {
		stroke-width: 0.5px;
		width: 20px;
		height: 20px;
		transform: translateY(4px);
	}
`;

const BookCover = styled.div`
	width: 70%;
	min-width: 350px;
	max-width: 450px;
	height: 70%;
	max-height: 600px;
	padding: 70px 30px 50px 40px;
	font-size: 2.3rem;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	overflow-wrap: break-word;
	background-image: url("./src/assets/linen_texture.webp");
	background-size: contain;
	background-color: #e8d7ce;
	background-blend-mode: exclusion;
	color: white;
	margin-bottom: 60px;
	border-radius: 4px;
	/* border: 1.5px solid black; */
	box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
		rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
`;

const CoverLine = styled.img`
	position: absolute;
	width: 40%;

	&.top {
		top: 25px;
	}
	&.bottom {
		bottom: 25px;
	}
`;

const Shadow = styled.img`
	position: absolute;
	mix-blend-mode: multiply;
	opacity: 0.8;
	height: 100%;
	top: 0;
	left: 5px;
`;

const BookTitle = styled.div`
	font-family: "Goblin One";
	hyphens: auto;
	width: 100%;

	&.fade-enter {
		opacity: 0;
	}

	&.fade-enter-active {
		opacity: 1;
		transition: all 200ms;
	}

	&.fade-exit {
		opacity: 1;
	}

	&.fade-exit-active {
		opacity: 0;
		transform: translateY(10px);
		transition: all 200ms;
	}
`;
