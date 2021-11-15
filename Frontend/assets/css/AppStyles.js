import { StyleSheet, StatusBar, Platform } from "react-native";

export default StyleSheet.create({
	background: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	logoContainer: {
		position: "absolute",
		top: 70,
		alignItems: "center",
	},
	logo: {
		width: 200,
		height: 200,
		borderRadius: 10,
		borderWidth: 5,
		borderColor: "gold",
	},
	ScrollView: {
		margin: 20,
	},
	loginButton: {
		width: "100%",
		height: 70,
		backgroundColor: "#56cd75",
		alignItems: "center",
		borderRadius: 50,
	},
	registerButton: {
		width: "100%",
		height: 70,
		backgroundColor: "#e6af54",
		alignItems: "center",
		borderRadius: 50,
	},
	text: {
		fontSize: 36,
		fontWeight: "100",
		padding: 8,
		letterSpacing: 5,
	},
	textUppercase: {
		textTransform: "uppercase",
		letterSpacing: 10,
	},
	container: {
		flex: 1,
		backgroundColor: "#0099b3",
		// alignItems: "center",
		padding: 10,
		// justifyContent: "center",
		// Add platform specific code
		paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
	},
	headerText: {
		fontSize: Platform.OS === "android" ? 25 : 30,
		fontWeight: "bold",
		fontStyle: "italic",
		borderRadius: 10,
		color: "#5e5e5e",
		textShadowColor: "grey",
		textShadowOffset: { height: 1, width: 1 },
		textShadowRadius: 10,
		padding: 10,
		textAlign: "center",
		textTransform: "uppercase",
		letterSpacing: 3,
	},
	busStop: {
		backgroundColor: "white",
	},
	busStopDetails: {
		color: "black",
	},
	busDetails: {
		// Disabled because it causes issues
		// flex: 1,
		flexDirection: "row",
		backgroundColor: "white",
		padding: 5,
	},
	busNumber: {
		alignSelf: "center",
		textAlign: "center",
		color: "black",
		fontWeight: "bold",
	},
	busTiming: {
		paddingRight: 5,
		color: "black",
	},
	estimatedArrival: {
		textAlign: "center"
	},
	busType: {
		fontSize: 10,
		textAlign: "center"
	},
	noData: {
		paddingTop: 8,
	}
});
