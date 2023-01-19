// I M P O R T S
import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useForm, SubmitHandler } from "react-hook-form";
import { MainButton } from "./Buttons";
import { IGetBooks, IResults } from "../helpers/Interfaces";

// C O M P O N E N T
interface ContainerProps {
	readonly active: string;
}

interface SearchProps {
	getBooks: (data: IGetBooks) => void;
	active: string;
	toggleFlex: (tab: string) => void;
	results: IResults[] | [];
	newSearch: () => void;
	state: string;
}

const Search: React.FC<SearchProps> = ({
	getBooks,
	toggleFlex,
	newSearch,
	active,
}) => {
	const [currentSearch, setCurrentSearch] = useState<IGetBooks | null>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const paramsRef = useRef<HTMLInputElement>(null);
	const nodeRef: any = currentSearch ? paramsRef : formRef;

	const { register, handleSubmit, reset } = useForm<IGetBooks>({
		defaultValues: { keyword: "", category: "" },
	});

	const onSubmit: SubmitHandler<IGetBooks> = (data) => {
		getBooks(data);
		setCurrentSearch(data);
	};

	return (
		<SearchWrapper active={active}>
			<h2 onClick={() => toggleFlex("search")}>Search</h2>
			<Description>
				A simple search app. May you find the weird and curious.
			</Description>
			<SwitchTransition>
				<CSSTransition
					key={currentSearch ? "true" : "false"}
					nodeRef={nodeRef}
					classNames="transition"
					timeout={250}
				>
					{!currentSearch ? (
						<Form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
							<label htmlFor="keyword"><strong>Search</strong></label>
							<Input
								id="keyword"
								type="text"
								{...register("keyword")}
								minLength={3}
								placeholder="Search term"
								required
							></Input>
							<InputWrapper><strong>Advanced search:<br />&nbsp;</strong></InputWrapper>
							<label htmlFor="genre">Genre</label>
							<Select id="genre" {...register("category")}>
								<option value="Any">Any</option>
								<option value="Classics">Classics</option>
								<option value="Horror">Horror</option>
								<option value="Fantasy">Fantasy</option>
								<option value="Crime">Crime</option>
								<option value="Romance">Romance</option>
							</Select>
							<label htmlFor="page count">Page Count</label>
							<InputWrapper>
								<NumberInput
									type="number"
									{...register("pageMin", { max: 9998 })}
									placeholder="any"
								></NumberInput>
								<p>to</p>
								<NumberInput
									type="number"
									{...register("pageMax", { max: 9999 })}
									placeholder="any"
								></NumberInput>
							</InputWrapper>
							<label htmlFor="release year">Release Year</label>
							<InputWrapper>
								<NumberInput
									type="number"
									{...register("releaseMin", {
										max: 2022,
										maxLength: 4,
										pattern: /[d]?|([1-9]{1})|([1-2]{1}[0-9]{3})/,
									})}
									placeholder="any"
								></NumberInput>
								<p>to</p>
								<NumberInput
									type="number"
									{...register("releaseMax", {
										max: 2023,
										maxLength: 4,
										pattern: /[d]?|([2-9]{1})|([1-2]{1}[0-9]{3})/,
									})}
									placeholder="any"
								></NumberInput>
							</InputWrapper>
							<SubmitButton type="submit" value="Search" />
						</Form>
					) : (
						<SearchParams ref={paramsRef}>
							<ParamWrapper>
								<ParamTitle>You are searching for:</ParamTitle>
								<ParamValue>{currentSearch?.keyword}</ParamValue>
							</ParamWrapper>
							{currentSearch.category ? (
								<ParamWrapper>
									<ParamTitle>In the category:</ParamTitle>
									<ParamValue>{currentSearch.category}</ParamValue>
								</ParamWrapper>
							) : null}
							{currentSearch.pageMin || currentSearch.pageMax ? (
								<ParamWrapper>
									<ParamTitle>Page count:</ParamTitle>
									<ParamValue>
										{currentSearch.pageMin || "1"}
										<span>to</span>
										{currentSearch.pageMax || "9999"}
									</ParamValue>
								</ParamWrapper>
							) : null}
							{currentSearch.releaseMin || currentSearch.releaseMax ? (
								<ParamWrapper>
									<ParamTitle>Published between:</ParamTitle>
									<ParamValue>
										{currentSearch.releaseMin || "1800"}
										<span>to</span>
										{currentSearch.releaseMax || "2023"}
									</ParamValue>
								</ParamWrapper>
							) : null}
							<MainButton
								type="button"
								onClick={() => {
									reset();
									newSearch();
									setCurrentSearch(null);
								}}
							>
								New Search
							</MainButton>
						</SearchParams>
					)}
				</CSSTransition>
			</SwitchTransition>
		</SearchWrapper>
	);
};

export default Search;

// S T Y L E S
const SearchWrapper = styled.div<ContainerProps>`
	width: 100%;
	height: 50px;
	padding: 0 1.5rem;
	overflow: hidden;
	position: relative;
	border-bottom: 2px solid black;
	flex-grow: ${(props) => (props.active === "search" ? "1" : "0")};
	transition: all 0.5s cubic-bezier(0.15, 0.67, 0.46, 1);

	h2 {
		cursor: ${(props) => (props.active !== "search" ? "pointer" : "default")};
		transition: all 0.15s ease-out;

		&:hover {
			transform: translateX(10px);
		}
	}

	label {
		display: block;
	}

	p {
		display: inline-block;
	}

	button {
		margin-top: 40px;
	}
`;

const Description = styled.p`
	margin-top: 20px;
	margin-bottom: 40px;
`;

const baseInputStyles = css`
	width: 100%;
	height: 36px;
	background: none;
	border: none;
	border-bottom: 0.5px solid black;
	margin-bottom: 20px;

	&:focus {
		border-radius: 2px;
		outline: 1.5px solid #ff5b37;
	}
`;

const Input = styled.input`
	${baseInputStyles}
`;

const Select = styled.select`
	${baseInputStyles}
`;

const NumberInput = styled(Input)`
	display: inline-flex;
	flex-grow: 1;
`;

const SubmitButton = styled.input`
	width: 100%;
	height: 36px;
	margin-top: 40px;
	border-radius: 4px;
	font-size: 1.2rem;
	color: white;
	background-color: #ff5b37;
	font-size: 1rem;
	border: none;
	cursor: pointer;

	&:hover {
		background-color: #e75332;
	}
`;

const InputWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;

	p {
		padding: 0 20px;
	}
`;

const Form = styled.form`
	&.transition-enter {
		opacity: 0;
		transform: translateY(-10px);
	}
	&.transition-enter-active {
		opacity: 1;
		transform: translateY(0);
		transition: all 250ms;
	}
	&.transition-exit {
		opacity: 1;
		transform: translateY(0);
	}
	&.transition-exit-active {
		opacity: 0;
		transition: all 250ms;
		transform: translateY(10px);
	}
`;

const SearchParams = styled.div`
	height: 400px;
	position: relative;

	&.transition-enter {
		opacity: 0;
		transform: translateY(-10px);
	}
	&.transition-enter-active {
		opacity: 1;
		transform: translateY(0);
		transition: all 250ms;
	}
	&.transition-exit {
		opacity: 1;
		transform: translateY(0);
	}
	&.transition-exit-active {
		opacity: 0;
		transition: all 250ms;
		transform: translateY(10px);
	}
`;

const ParamWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding-bottom: 0.5rem;
	border-bottom: 1px dashed #f98f77;
`;

const ParamTitle = styled.p`
	padding-top: 8px;
`;

const ParamValue = styled.p`
	font-size: 1.2rem;
	font-weight: 500;
	color: #ff5b37;

	span {
		padding: 0 10px;
		font-size: 1rem;
		font-weight: 400;
		color: black;
	}
`;
