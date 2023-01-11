// I M P O R T S
import { useState, useEffect, useRef, FC } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Display from "./components/Display";
import {
	CurrentBook,
	IBookshelf,
	IResults,
	IGetBooks,
} from "./helpers/Interfaces";
import styled from "@emotion/styled";

// C O M P O N E N T
const App: FC = () => {
	const [results, setResults] = useState<IResults[] | []>([]);
	const [currentBook, setCurrentBook] = useState<
		CurrentBook | null | undefined
	>(null);
	const [index, setIndex] = useState<number>(0);
	const [bookshelf, setBookshelf] = useState<IBookshelf[]>([]);
	const [showingSavedBook, setShowingSavedBook] = useState<boolean>(false);
	const [state, setState] = useState<string>("start");
	const [show, setShow] = useState<boolean>(false);

	const key = "AIzaSyCBY4Irp4BE_U1wmg5I01DpX-ixPHEDfMI";

	useEffect(() => {
		if (state !== "start") {
			setCurrentBook(results[index]);
		}
	}, [results]);

	useEffect(() => {
		if (state !== "start") {
			setCurrentBook(results[index]);
		}
	}, [index]);

	const getSearchTerm = ({ keyword = "", category = "" }: IGetBooks) => {
		if (category === "Any") category = "";
		if (category !== "") category = `+subject:fiction/${category}`;

		return `${keyword.replaceAll(" ", "+")}${category}`;
	};
	/*
	const getResults = async (searchTerm: string) => {
		let totalResults: number = 0;
		let fetchedResults: number = 0;

		// Try to fetch search results at least once, or until no more results are returned
		do {
			try {
				const response = await fetch(
					`https://www.googleapis.com/books/v1/volumes?q=intitle:${searchTerm}
					&printType=books&maxResults=40&startIndex=${fetchedResults}&key=${key}`,
					{
						method: "GET",
					}
				);
				const data = await response.json();

				if (totalResults === 0) {
					totalResults = data.totalItems;
				}
				if (data.totalItems === 0) {
					setState("nothing found");
				} else {
					setState("showing results")
				}

				// Increase the variable controlling the "startIndex" by 40 until nothing more returned
				if (data.items) {
					fetchedResults += 40;
				} else {
					break;
				}
				console.log(data);
				return data;
			} catch (err) {
				console.error(err);
			}

			console.log("the end");
		} while (fetchedResults < totalResults);
	};

	const filterResults = (
		{ pageMin, pageMax, releaseMin, releaseMax }: IGetBooks,
		bookResults: any
	) => {
		if (pageMin === "") pageMin = "1";
		if (pageMax === "") pageMax = "9999";
		if (releaseMin === "") releaseMin = "1";
		if (releaseMax === "") releaseMax = "2023";
		console.warn('last start')
		let newBooks = bookResults.items
			.filter(
				({ volumeInfo }: any) =>
					volumeInfo.title &&
					volumeInfo.pageCount >= Number(pageMin) &&
					volumeInfo.pageCount <= Number(pageMax) &&
					volumeInfo.publishedDate &&
					volumeInfo.publishedDate.substring(0, 4) >= Number(releaseMin) &&
					volumeInfo.publishedDate.substring(0, 4) <= Number(releaseMax) &&
					volumeInfo.description
			)
			.map(({ volumeInfo }: any) => ({
				title: volumeInfo.title,
				author: volumeInfo.authors ? volumeInfo.authors : ["Not available"],
				pageCount: volumeInfo.pageCount
					? volumeInfo.pageCount
					: ["Not available"],
				published: volumeInfo.publishedDate
					? volumeInfo.publishedDate.substring(0, 4)
					: "---",
				description: volumeInfo.description ? volumeInfo.description : null,
			}));
		setResults((prev) => [...prev, newBooks].flat());
		console.warn('last end')
	};
	*/

	const getResults = async (
		{ pageMin, pageMax, releaseMin, releaseMax }: IGetBooks,
		searchTerm: string
	) => {
		if (pageMin === "") pageMin = "1";
		if (pageMax === "") pageMax = "9999";
		if (releaseMin === "") releaseMin = "1";
		if (releaseMax === "") releaseMax = "2023";

		let totalResults: number = 0;
		let fetchedResults: number = 0;
		let bookFound = false;

		// Try to fetch search results at least once, or until no more results are returned
		do {
			try {
				const response = await fetch(
					`https://www.googleapis.com/books/v1/volumes?q=intitle:${searchTerm}
					&printType=books&maxResults=40&startIndex=${fetchedResults}&key=${key}`,
					{
						method: "GET",
					}
				);
				const bookResults = await response.json();

				if (totalResults === 0) {
					totalResults = bookResults.totalItems;
				}

				// Increase the variable controlling the "startIndex" by 40, or break the loop if nothing is returned
				if (bookResults.items) {
					fetchedResults += 40;
				} else if (!bookResults.items && !bookFound) {
					setState("nothing found");
					break;
				} else if (!bookResults.items && bookFound) {
					break;
				}

				// Filter the search results according to the search parameters,
				// then return a new array of objects with the wanted information
				let newBooks = await bookResults.items
					.filter(
						({ volumeInfo }: any) =>
							volumeInfo.title &&
							volumeInfo.pageCount >= Number(pageMin) &&
							volumeInfo.pageCount <= Number(pageMax) &&
							volumeInfo.publishedDate &&
							volumeInfo.publishedDate.substring(0, 4) >= Number(releaseMin) &&
							volumeInfo.publishedDate.substring(0, 4) <= Number(releaseMax) &&
							volumeInfo.description
					)
					.map(({ volumeInfo }: any) => ({
						title: volumeInfo.title,
						author: volumeInfo.authors ? volumeInfo.authors : ["Not available"],
						pageCount: volumeInfo.pageCount
							? volumeInfo.pageCount
							: ["Not available"],
						published: volumeInfo.publishedDate.substring(0, 4),
						description: volumeInfo.description,
					}));
				setResults((prev) => [...prev, newBooks].flat());
				if (newBooks.length > 0) {
					setState(() => "showing results");
					bookFound = true;
				} else if (!bookFound && fetchedResults >= totalResults) {
					setState("nothing found");
				}
			} catch (err) {
				console.error(err);
			}
		} while (fetchedResults < totalResults);
	};

	const getBooks = (data: IGetBooks) => {
		setShowingSavedBook(false);
		let searchTerm = getSearchTerm(data);
		getResults(data, searchTerm);
	};

	const returnToSearchResults = () => {
		setShowingSavedBook(false);
		setCurrentBook(results[index]);
	};

	const nextBook = (): void => {
		index === results.length - 1 ? null : setIndex((prev) => (prev += 1));
	};

	const prevBook = (): void => {
		index === 0 ? null : setIndex((prev) => (prev -= 1));
	};

	const saveBook = (): void => {
		if (currentBook && !bookshelf.includes(currentBook)) {
			setBookshelf((prev) => [...prev, currentBook]);
		}
	};

	const showBook = (id: string): void => {
		setShowingSavedBook(true);
		setCurrentBook(bookshelf.find((item) => item.title === id));
		setState("showing results");
	};

	const removeBook = (id: string): void => {
		setBookshelf((prev) => prev.filter((item) => item.title !== id));
	};

	const newSearch = () => {
		setShowingSavedBook(false);
		setState("start");
		setTimeout(() => {
			setResults([]);
			setCurrentBook(null);
			setIndex(0);
		}, 750);
	};

	const showSidebar = () => setShow((show) => (show ? false : true));

	return (
		<AppContainer>
			<ContentWrapper>
				<Sidebar
					getBooks={getBooks}
					bookshelf={bookshelf}
					removeBook={removeBook}
					showBook={showBook}
					newSearch={newSearch}
					results={results}
					state={state}
					show={show}
				/>
				<Display
					currentBook={currentBook}
					nextBook={nextBook}
					saveBook={saveBook}
					prevBook={prevBook}
					showingSavedBook={showingSavedBook}
					returnToSearchResults={returnToSearchResults}
					index={index}
					results={results}
					bookshelf={bookshelf}
					state={state}
					showSidebar={showSidebar}
					show={show}
				/>
			</ContentWrapper>
		</AppContainer>
	);
};

export default App;

const AppContainer = styled.div`
	width: 100%;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	overflow: hidden;
	background-color: whitesmoke;
`;

const ContentWrapper = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: row;
`;
