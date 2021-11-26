import React, { createContext, useState, useEffect } from "react";

const { Provider, Consumer } = createContext();

const AuthProvider = (props) => {
	const [token, setToken] = useState(null);
	useEffect(() => {
		console.log("authprovider props " + JSON.stringify(props._token));
		if (props._token) {
			setToken(props._token);
		}
	});

	return <Provider value={{ token: token }}>{props.children}</Provider>;
};

export { AuthProvider };

export default Consumer;
