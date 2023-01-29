// I M P O R T S
import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { IResults } from "../helpers/Interfaces";

// C O M P O N E N T
interface CircleProps {
	state: string;
	results: IResults[] | [];
	ref: any;
	showSidebar: () => void;
}

const Circle = React.forwardRef<HTMLInputElement, CircleProps>(
	({ state, results, showSidebar }, ref) => {
		const [text, setText] = useState("Bookly");
		const booklyRef = useRef(null);
		const sorryRef = useRef(null);
		const nodeRef = state === "start" ? booklyRef : sorryRef;

		useEffect(() => {
			if (results.length === 0 && state === "start") {
				setText("Bookly");
			}
			if (
				(state === "showing results" && results.length === 0) ||
				state === "nothing found"
			) {
				setText(`Sorry, nothing found.`);
			}
			if (results.length !== 0 || state === "showing results") {
				setText("");
			}
		}, [results, state]);

		return (
			<MainCircle ref={ref} onClick={() => showSidebar()}>
				<TextWrapper>
					<SwitchTransition>
						<CSSTransition
							key={state}
							nodeRef={nodeRef}
							classNames="transition"
							timeout={250}
						>
							{state === "start" ? (
								<Title ref={booklyRef}>{text}</Title>
							) : (
								<Sorry ref={sorryRef}>{text}</Sorry>
							)}
						</CSSTransition>
					</SwitchTransition>
				</TextWrapper>
			</MainCircle>
		);
	}
);

export default Circle;


// S T Y L E S

const Title = styled.div`
	font-family: "Goblin One";
	font-size: 4rem;
	transition: font-size 0.3s;

	&.transition-enter {
		opacity: 0;
	}

	&.transition-enter-active {
		opacity: 1;
		transition: all 250ms;
	}

	&.transition-exit {
		opacity: 1;
	}

	&.transition-exit-active {
		opacity: 0;
		transition: all 250ms;
	}
`;

const Sorry = styled.div`
	font-family: "Goblin One";
	font-size: 2.4rem;
	line-height: 1.5;

	&.transition-enter {
		opacity: 0;
	}

	&.transition-enter-active {
		opacity: 1;
		transition: all 250ms;
	}

	&.transition-exit {
		opacity: 1;
	}

	&.transition-exit-active {
		opacity: 0;
		transition: all 250ms;
	}
`;

const TextWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
`;

const MainCircle = styled.div`
	width: 550px;
	height: 550px;
	position: absolute;
	z-index: 0;
	border-radius: 100%;
	background-color: #ebae8c;
	cursor: pointer;
	&:hover ${Title} {
		font-size: 4.2rem
	}
`;