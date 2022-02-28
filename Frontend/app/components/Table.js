import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";

const Table = ({ information }) => {
	return (
		<View style={{ display: "flex" }}>
			{information.map((info) => {
				return (
					<View
						style={{
							display: "flex",
						}}
					>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Text>WD First Bus: {info.WD_FirstBus} hrs</Text>
							<Text>WD Last Bus: {info.WD_LastBus} hrs</Text>
						</View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Text>SAT First Bus: {info.SAT_FirstBus} hrs</Text>
							<Text>SAT Last Bus: {info.SAT_LastBus} hrs</Text>
						</View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Text>SUN First Bus: {info.SUN_FirstBus} hrs</Text>
							<Text>SUN Last Bus: {info.SUN_LastBus} hrs</Text>
						</View>
					</View>
				);
			})}
		</View>
	);
};

export default Table;
