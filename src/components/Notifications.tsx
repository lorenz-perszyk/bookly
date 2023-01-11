// I M P O R T S
import React, { createRef } from "react";
import styled from "@emotion/styled";
import { INotifications, CurrentBook } from "../helpers/Interfaces";
import {
	CSSTransition,
	TransitionGroup,
} from "react-transition-group";

// C O M P O N E N T
interface NotificationsProps {
	notifications: INotifications[] | [];
	currentBook: CurrentBook | null | undefined;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, currentBook }) => {
	return (
		<TransitionGroup component={NotificationWrapper}>
			{notifications.map((note) => {
				const noteRef = createRef<HTMLDivElement>();
				return (
					<CSSTransition
						key={note.id}
						nodeRef={noteRef}
						classNames="transition"
						timeout={2000}
						unmountOnExit
					>
						<Note ref={noteRef} color={note.color}>
							{note.icon} {note.message}
						</Note>
					</CSSTransition>
				);
			})}
		</TransitionGroup>
	);
};

export default Notifications;

// S T Y L E S
const Note = styled.div`
	width: 100%;
	width: 250px;
	height: 40px;
	display: flex;
	gap: 1rem;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	border: 1px solid black;

	svg {
		color: ${props => props.color? props.color : "black"};
	}

	// enter from
	&.transition-enter {
		opacity: 0;
		transform: translateY(50%);
	}

	// enter to
	&.transition-enter-active {
		opacity: 1;
		transform: translateY(0);
		transition: all 500ms;
	}

	// exit from
	&.transition-exit {
		opacity: 1;
		transform: translateY(0);
	}

	// exit to
	&.transition-exit-active {
		opacity: 0;
		transform: translateY(0);
		transition: all 300ms;
	}
`;

const DisplayWrapper = styled.div`
	position: relative;
	z-index: 1;
	margin-left: 350px;
	flex-grow: 1;
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

const NotificationWrapper = styled.div`
	width: 250px;
	height: auto;
	position: absolute;
	bottom: 16px;
	left: 16px;
	display: flex;
	flex-direction: column-reverse;
	gap: 8px;
`;
