import React, { useState } from "react";
import { Modal, Pressable } from "react-native";
import { Overlay, Text } from "react-native-elements";

/**
 * This component, on press will pop out a modal */
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
