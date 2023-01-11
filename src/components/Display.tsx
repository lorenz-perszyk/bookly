// I M P O R T S
import React, { useRef, useState, useEffect, createRef } from "react";
import Cover from "./Cover";
import Information from "./Information";
import Notifications from "./Notifications";
import Circle from "./Circle";
import styled from "@emotion/styled";
import gsap from "gsap";
import Lottie from "lottie-react";
import circles from "../assets/bookly.json";
import { v4 as uuidv4 } from "uuid";
import { CurrentBook, IResults, INotifications } from "../helpers/Interfaces";
import { BsCheckCircle } from "react-icons/bs";

// C O M P O N E N T
interface DisplayProps {
	nextBook: () => void;
	saveBook: () => void;
	prevBook: () => void;
	returnToSearchResults: () => void;
	showSidebar: () => void;
	currentBook: CurrentBook | null | undefined;
	showingSavedBook: boolean;
	index: number;
	results: IResults[] | [];
	bookshelf: {}[] | [];
	state: string;
	show: boolean;
}

const Display: React.FC<DisplayProps> = ({
	nextBook,
	saveBook,
	prevBook,
	returnToSearchResults,
	showSidebar,
	currentBook,
	showingSavedBook,
	index,
	results,
	bookshelf,
	state,
	show,
}) => {
	const [notifications, setNotifications] = useState<INotifications[] | []>([]);
	const displayRef = useRef<HTMLInputElement>(null);
	const infoRef = useRef<HTMLInputElement>(null);
	const animationRef = useRef<HTMLInputElement>(null);
	const circleRef = createRef<HTMLInputElement>();

	useEffect(() => {
		if (
			(state === "showing results" && results.length > 0) ||
			showingSavedBook
		) {
			gsap.to(infoRef.current, {
				delay: 0.5,
				duration: 0.75,
				autoAlpha: 1,
			});
			gsap.to(circleRef.current, {
				duration: 0.75,
				autoAlpha: 0.3,
			});
			gsap.to(animationRef.current, {
				duration: 0.5,
				autoAlpha: 0,
			});
		} else {
			gsap.to(infoRef.current, {
				duration: 0.75,
				autoAlpha: 0,
			});
			gsap.to(circleRef.current, {
				delay: 0.5,
				duration: 0.75,
				autoAlpha: 1,
			});
			gsap.to(animationRef.current, {
				delay: 0.75,
				duration: 0.5,
				autoAlpha: 1,
			});
		}
	}, [state]);

	useEffect(() => {
		show
			? gsap.to(displayRef.current, {
					x: 175,
					duration: 0.5,
					ease: "power2.Out",
			  })
			: gsap.to(displayRef.current, {
					x: 0,
					duration: 0.5,
					ease: "power2.Out",
			  });
	}, [show]);

	const addSuccess = () => {
		const icon: any = <BsCheckCircle />;
		const message = {
			id: uuidv4(),
			type: "success",
			icon: icon,
			message: "Added to Bookshelf",
			color: "green",
		};
		setNotifications((prev) => [message, ...prev]);
		setTimeout(
			() => setNotifications((prev) => prev.filter((m) => m.id !== message.id)),
			2000
		);
	};

	return (
		<DisplayWrapper ref={displayRef}>
			<div ref={infoRef} className="flex">
				<Cover
					currentBook={currentBook}
					nextBook={nextBook}
					saveBook={saveBook}
					prevBook={prevBook}
					addSuccess={addSuccess}
					showingSavedBook={showingSavedBook}
					returnToSearchResults={returnToSearchResults}
					index={index}
					results={results}
					bookshelf={bookshelf}
				/>
				<Information
					currentBook={currentBook}
					index={index}
					results={results}
					showingSavedBook={showingSavedBook}
				/>
				<Notifications
					notifications={notifications}
					currentBook={currentBook}
				/>
			</div>
			<Circle
				ref={circleRef}
				state={state}
				results={results}
				showSidebar={showSidebar}
			/>
			<LottieWrapper ref={animationRef}>
				<Lottie
					animationData={circles}
					autoplay={true}
					loop={true}
					width={1080}
					height={1080}
				/>
			</LottieWrapper>
		</DisplayWrapper>
	);
};

export default Display;

// S T Y L E S

const DisplayWrapper = styled.div`
	position: relative;
	z-index: 1;
	left: -175px;
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;

	.flex {
		position: relative;
		z-index: 1;
		display: flex;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
`;

const LottieWrapper = styled.div`
	width: 1080px;
	height: fit-content;
	position: absolute;
	z-index: -1;
	padding: 37px 30px 30px;
	display: flex;
	align-items: center;
	justify-content: center;
`;
