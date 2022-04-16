import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import AppStyles from "../../assets/css/AppStyles";

const Table = ({ information }: { information: any }) => {
	return (
		<View style={{ display: "flex" }}>
			{information.map((info: any, key: number) => {
				return (
					<View
						style={{
							display: "flex",
						}}
						key={key}
					>
						<View style={AppStyles.tableInformationStyle}>
							<View style={AppStyles.tableRowInformationStyle}>
								<Text style={AppStyles.tableTextStyle}>
									First Bus
								</Text>
							</View>
							<View style={AppStyles.tableRowInformationStyle}>
								<Text style={AppStyles.tableTextStyle}>
									Last Bus
								</Text>
							</View>
						</View>
						<View style={AppStyles.tableInformationStyle}>
							<View style={AppStyles.tableRowInformationStyle}>
								<Text style={AppStyles.tableTextStyle}>
									WD: {info.WD_FirstBus} hrs
								</Text>
							</View>
							<View style={AppStyles.tableRowInformationStyle}>
								<Text style={AppStyles.tableTextStyle}>
									WD: {info.WD_LastBus} hrs
								</Text>
							</View>
						</View>
						<View style={AppStyles.tableInformationStyle}>
							<View style={AppStyles.tableRowInformationStyle}>
								<Text style={AppStyles.tableTextStyle}>
									SAT: {info.SAT_FirstBus} hrs
								</Text>
							</View>
							<View style={AppStyles.tableRowInformationStyle}>
								<Text style={AppStyles.tableTextStyle}>
									SAT: {info.SAT_LastBus} hrs
								</Text>
							</View>
						</View>
						<View style={AppStyles.tableInformationStyle}>
							<View style={AppStyles.tableRowInformationStyle}>
								<Text style={AppStyles.tableTextStyle}>
									SUN: {info.SUN_FirstBus} hrs
								</Text>
							</View>
							<View style={AppStyles.tableRowInformationStyle}>
								<Text style={AppStyles.tableTextStyle}>
									SUN: {info.SUN_LastBus} hrs
								</Text>
							</View>
						</View>
					</View>
				);
			})}
		</View>
	);
};

export default Table;
