import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />} />
			<Route
				path="*"
				element={
					<main style={{ padding: "1rem" }}>
						<p>PAGE NOT FOUND!</p>
					</main>
				}
			/>
		</Routes>
	</BrowserRouter>
);
