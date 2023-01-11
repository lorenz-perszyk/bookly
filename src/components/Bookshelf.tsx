// I M P O R T S
import React, { useRef, createRef } from "react";
import styled from "@emotion/styled";
import { RxCross2 } from "react-icons/rx";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { IBookshelf } from "../helpers/Interfaces";

// C O M P O N E N T
interface BookshelfProps {
	bookshelf: IBookshelf[] | [];
	removeBook: (id: string) => void;
	active: string;
	toggleFlex: (tab: string) => void;
	showBook: (id: string) => void;
}
const Bookshelf: React.FC<BookshelfProps> = ({
	removeBook,
	toggleFlex,
	showBook,
	bookshelf,
	active,
}) => {
	return (
		<BookshelfWrapper active={active}>
			<TitleWrapper onClick={() => toggleFlex("bookshelf")}>
				<h2>Bookshelf</h2>
			</TitleWrapper>
			<BookList>
				{!bookshelf[0] ? (
					<p>
						<br />
						Looks kind of empty here ... time to add some books!
					</p>
				) : (
					<TransitionGroup component={null}>
						{bookshelf.map((item, index: number) => {
							const bookRef = createRef<HTMLInputElement>();
							return (
								<CSSTransition
									key={`book${item.title}`}
									timeout={300}
									classNames="transition"
									nodeRef={bookRef}
									appear
								>
									<ShelfItem ref={bookRef} key={`book${item.title}`}>
										{item.title}
										<ButtonWrapper>
											<ShowButton onClick={() => showBook(item.title)}>
												Show
											</ShowButton>
											<DeleteButton onClick={() => removeBook(item.title)}>
												<RxCross2 />
											</DeleteButton>
										</ButtonWrapper>
									</ShelfItem>
								</CSSTransition>
							);
						})}
					</TransitionGroup>
				)}
			</BookList>
		</BookshelfWrapper>
	);
};

export default Bookshelf;

// S T Y L E S

const TitleWrapper = styled.div`
	height: 60px;
	width: 100%;
	position: relative;
	z-index: 10;
	top: 0;
	position: sticky;
	display: flex;
	align-items: center;
	background-color: whitesmoke;
	border-bottom: 0.5px solid black;

	h2 {
		width: 100%;
	}
`;

const BookshelfWrapper = styled.div<{ active: string }>`
	position: relative;
	width: 100%;
	height: 60px;
	padding: 0 1.5rem;
	flex-grow: ${(props) => (props.active === "bookshelf" ? "1" : "0")};
	overflow: auto;
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
	transition: all 0.5s cubic-bezier(0.15, 0.67, 0.46, 1);

	&::-webkit-scrollbar {
		display: none; /* Hide scrollbar for Chrome, Safari and Opera */
	}

	h2 {
		line-height: 60px;
		transition: all 0.15s ease-out;
		cursor: pointer;

		&:hover {
			transform: translateX(10px);
		}
	}
`;

const ShelfItem = styled.div`
	width: 100%;
	height: auto;
	padding: 15px 0;
	border-bottom: 0.5px solid black;
	font-weight: 500;

	&.transition-appear {
		opacity: 0;
		transform: translateX(-100%);
	}

	&.transition-appear-active {
		opacity: 1;
		transform: translateX(0);
		transition: all 300ms;
	}

	// enter from
	&.transition-enter {
		opacity: 0;
		transform: translateX(-100%);
	}

	// enter to
	&.transition-enter-active {
		opacity: 1;
		transform: translateX(0);
		transition: all 300ms;
	}

	// exit from
	&.transition-exit {
		opacity: 1;
	}

	// exit to
	&.transition-exit-active {
		opacity: 0;
		transition: all 300ms;
	}
`;

const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: row;
	gap: 10px;
	padding-top: 10px;
`;

const ShowButton = styled.button`
	width: 100px;
	height: 24px;
	border-radius: 12px;
	border: 0.5px solid black;
	text-align: center;

	&:hover {
		background-color: #dbdbdb;
	}
`;

const DeleteButton = styled.button`
	width: 24px;
	border-radius: 50%;
	background-color: rgba(170, 74, 68, 0);
	border: 0.5px solid rgba(0, 0, 0, 1);
	vertical-align: baseline;

	svg {
		transform: translateY(2px);
	}

	&:hover {
		opacity: 1;
		color: white;
		background-color: rgba(170, 74, 68, 1);
		border: unset;
	}
`;

const BookList = styled.div`
	overflow-y: visible;
	overflow-x: visible;
	transition: all 0.5s cubic-bezier(0.15, 0.67, 0.46, 1);
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */

	&::-webkit-scrollbar {
		display: none; /* Hide scrollbar for Chrome, Safari and Opera */
	}
`;
