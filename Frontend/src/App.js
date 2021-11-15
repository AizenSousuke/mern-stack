import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

function App() {
	return (
		<BrowserRouter>
			<h1>Title</h1>
			<Link to="/register">Register</Link>
			<Routes>
				<Route path="/" element={<Login />}></Route>
				<Route path="/register" element={<Register />}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
