// I M P O R T S
import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Search from "./Search";
import Bookshelf from "./Bookshelf";
import gsap from "gsap";
import { IGetBooks, IResults, IBookshelf } from "../helpers/Interfaces";

// C O M P O N E N T
interface SidebarProps {
	getBooks: (data: IGetBooks) => void;
	removeBook: (id: string) => any;
	showBook: (id: string) => void;
	newSearch: () => void;
	bookshelf: IBookshelf[] | [];
	results: IResults[] | [];
	state: string;
	show: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
	getBooks,
	removeBook,
	showBook,
	newSearch,
	bookshelf,
	results,
	state,
	show,
}) => {
	const [flex, setFlex] = useState<string>("search");

	const sidebarRef = useRef<HTMLDivElement>(null);

	const toggleFlex = (tab: string) => {
		setFlex((prev) => prev === "search" ? "bookshelf" : "search");
	};

	useEffect(() => {
		show
			? gsap.to(sidebarRef.current, {
					x: 350,
					duration: 0.5,
					ease: "power2.Out",
			  })
			: gsap.to(sidebarRef.current, {
					x: 0,
					duration: 0.5,
					ease: "power2.Out",
			  });
	}, [show]);

	return (
		<SidebarWrapper ref={sidebarRef}>
			<NavWrapper>
				<p>Bookly</p>
			</NavWrapper>
			<Search
				getBooks={getBooks}
				active={flex}
				toggleFlex={toggleFlex}
				newSearch={newSearch}
				results={results}
				state={state}
			/>
			<Bookshelf
				bookshelf={bookshelf}
				removeBook={removeBook}
				active={flex}
				toggleFlex={toggleFlex}
				showBook={showBook}
			/>
		</SidebarWrapper>
	);
};

export default Sidebar;

// S T Y L E S

const SidebarWrapper = styled.div`
	width: 350px;
	height: 100%;
	position: relative;
	left: -350px;
	display: flex;
	flex-direction: column;
	background-color: whitesmoke;
	border-right: 2px solid black;
`;

const NavWrapper = styled.div`
	width: 100%;
	height: 40px;
	margin-bottom: 40px;
	display: flex;
	align-items: center;
	background-color: #ff5b37;
	color: white;
	padding: 0 1.5rem;

	p {
		font-family: "Goblin One", Verdana, sans-serif;
		font-size: 1.2rem;
		font-weight: 600;
	}
`;
