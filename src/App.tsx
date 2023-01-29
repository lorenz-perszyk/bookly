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
	const searching = useRef(false);

	const key = "AIzaSyCBY4Irp4BE_U1wmg5I01DpX-ixPHEDfMI";

	useEffect(() => {
		if (state !== "start") {
			setCurrentBook(results[index]);
		}
	}, [results, index]);

	const getSearchTerm = ({ keyword = "", category = "" }: IGetBooks) => {
		if (category === "Any") category = "";
		if (category !== "") category = `+subject:fiction/${category}`;

		return `${keyword.replaceAll(" ", "+")}${category}`;
	};
	
	const getResults = async (searchData: IGetBooks, searchTerm: string, total = 0, fetched = 0) => {
		// Check if in searching mode, if not stop fetching results
		let totalResults = total;
		let fetchedResults = fetched;

		// Fetch search results at least once, or until no more results are returned
		try {
			const response = await fetch(
				`https://www.googleapis.com/books/v1/volumes?q=intitle:${searchTerm}
				&printType=books&maxResults=40&startIndex=${fetchedResults}&key=${key}`,
				{
					method: "GET",
				}
			);
			const searchResults = await response.json();
			
			totalResults = searchResults.totalItems;

			// Check if any results were returned
			if (searchResults.totalItems === 0) {
				setState("nothing found");
				return;
			} else {
				if (!searching.current) {return}
				setState("showing results")
			}

			// Increase the variable controlling the "startIndex" by 40 if fetch was successful
			if (searchResults.items) {fetchedResults += 40};

			// If less than the total amount of results have been returned, recall the function
			if (fetchedResults < totalResults) {
				filterResults(searchData, searchResults);
				getResults(searchData, searchTerm, totalResults, fetchedResults);
			} else {
				return;
			}
		} catch (err) {
			console.error(err);
		}
	};

	const filterResults = (
		{ pageMin, pageMax, releaseMin, releaseMax }: IGetBooks,
		bookResults: any
	) => {
		if (pageMin === "") pageMin = "1";
		if (pageMax === "") pageMax = "9999";
		if (releaseMin === "") releaseMin = "1";
		if (releaseMax === "") releaseMax = "2023";

		// Filter the API results and create a mapped array
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
				author: volumeInfo.authors 
					? volumeInfo.authors 
					: ["Not available"],
				pageCount: volumeInfo.pageCount
					? volumeInfo.pageCount
					: ["Not available"],
				published: volumeInfo.publishedDate
					? volumeInfo.publishedDate.substring(0, 4)
					: "---",
				description: volumeInfo.description 
					? volumeInfo.description 
					: null,
			}));

			// If any books matched the search criteria, add them to the results array
			if (!searching.current) {return};
			if (newBooks.length > 0) {
				setState("showing results");
				setResults((prev) => [...prev, newBooks].flat());
			}
	};
	
	const getBooks = (data: IGetBooks) => {
		searching.current = true
		setResults([]);
		setShowingSavedBook(false);
		let searchTerm = getSearchTerm(data);
		getResults(data, searchTerm);
	};

	const newSearch = () => {
		searching.current = false
		setShowingSavedBook(false);
		setState("start");
		setTimeout(() => {
			setResults([]);
			setCurrentBook(null);
			setIndex(0);
		}, 750);
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


// S T Y L E S
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
