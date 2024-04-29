import React, { useState } from "react";
import { Pressable } from "react-native";
import { Overlay } from "react-native-elements";

/**
 * This component, on press will pop out a modal 
 * */
const ModalAdder = ({
	children,
	modalElement,
	style,
}: {
	children: any;
	modalElement: any;
	style: any;
}) => {
	const [modalOpened, setModalOpened] = useState(false);
	return (
		<Pressable
			onPress={() => {
				setModalOpened(true);
			}}
			style={style}
			testID={"Pressable"}
		>
			<Overlay
				isVisible={modalOpened}
				onBackdropPress={() => setModalOpened(false)}
			>
				{modalElement}
			</Overlay>
			{children}
		</Pressable>
	);
};

export default ModalAdder;
