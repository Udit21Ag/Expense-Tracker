import React from "react";
import "./main.css";
import TopBar from "./topbar";
import Display from "./display";

function Main() {
	return (
		<div className="root">
			<TopBar />
			<main className="content">
				<div className="name">
					<strong>X</strong>pense Tracker
				</div>
				<Display />
			</main>
		</div>
	);
}

export default Main;
