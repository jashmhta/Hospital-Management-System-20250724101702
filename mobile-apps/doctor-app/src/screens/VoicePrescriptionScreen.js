import Voice from "@react-native-voice/voice";
import React, { useState, useEffect } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const VoicePrescriptionScreen = ({ route, navigation }) => {
	const { patientId } = route.params;
	const [isRecording, setIsRecording] = useState(false);
	const [transcription, setTranscription] = useState("");
	const [prescription, setPrescription] = useState({
		medications: [],
		instructions: "",
		duration: "",
		notes: "",
	});

	useEffect(() => {
		Voice.onSpeechStart = onSpeechStart;
		Voice.onSpeechRecognized = onSpeechRecognized;
		Voice.onSpeechEnd = onSpeechEnd;
		Voice.onSpeechError = onSpeechError;
		Voice.onSpeechResults = onSpeechResults;

		return () => {
			Voice.destroy().then(Voice.removeAllListeners);
		};
	}, []);

	const onSpeechStart = () => {
		setIsRecording(true);
	};

	const onSpeechRecognized = () => {
		/* SECURITY: Console statement removed */
	};

	const onSpeechEnd = () => {
		setIsRecording(false);
	};

	const onSpeechError = (error) => {
		/* SECURITY: Console statement removed */
		setIsRecording(false), Alert.alert("An error occurred");
	};

	const onSpeechResults = (event) => {
		const result = event.value[0];
		setTranscription(result);
		processMedicalTranscription(result);
	};

	const startRecording = async () => {
		try {
			await Voice.start("en-US");
		} catch (error) {
			/* SECURITY: Console statement removed */
		}
	};

	const _stopRecording = async () => {
		try {
			await Voice.stop();
		} catch (error) {
			/* SECURITY: Console statement removed */
		}
	};

	const processMedicalTranscription = (text) => {
		// AI-powered medical transcription processing
		// This would integrate with medical NLP API
		const processedPrescription = parseMedicalText(text);
		setPrescription(processedPrescription);
	};

	const parseMedicalText = (text) => {
		// Simplified medical text parsing
		// In production, this would use advanced NLP
		const medications = [];
		const words = text.toLowerCase().split(" ");

		// Basic drug name recognition
		const commonDrugs = ["aspirin", "ibuprofen", "acetaminophen", "metformin", "lisinopril"];
		words.forEach((word, index) => {
			if (commonDrugs.includes(word)) {
				medications.push({
					name: word,
					dosage: words[index + 1] || "100mg",
					frequency: "twice daily",
				});
			}
		});

		return {
			medications,
			instructions: text,
			duration: "7 days",
			notes: "Generated from voice input",
		};
	};

	const savePrescription = async () => {
		try {
			const response = await fetch("/api/prescriptions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${await AsyncStorage.getItem("doctorToken")}`,
				},
				body: JSON.stringify({
					patientId,
					...prescription,
					transcription,
				}),
			});

			if (response.ok) {
				Alert.alert("An error occurred");
				navigation.goBack();
			} else {
				Alert.alert("An error occurred");
			}
		} catch (error) {
			/* SECURITY: Console statement removed */
			Alert.alert("An error occurred");
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Voice Prescription</Text>
				<Text style={styles.subtitle}>Patient ID: {patientId}</Text>
			</View>

			<View style={styles.voiceSection}>
				<TouchableOpacity
					style={[styles.recordButton, isRecording && styles.recordingButton]}
					onPress={isRecording ? _stopRecording : startRecording}
				>
					<Text style={styles.recordButtonText}>
						{isRecording ? "Stop Recording" : "Start Voice Prescription"}
					</Text>
				</TouchableOpacity>

				{transcription ? (
					<View style={styles.transcriptionBox}>
						<Text style={styles.transcriptionLabel}>Transcription:</Text>
						<Text style={styles.transcriptionText}>{transcription}</Text>
					</View>
				) : null}
			</View>

			<View style={styles.prescriptionSection}>
				<Text style={styles.sectionTitle}>Processed Prescription</Text>

				{prescription.medications.map((med, index) => (
					<View key={index} style={styles.medicationCard}>
						<Text style={styles.medicationName}>{med.name}</Text>
						<Text style={styles.medicationDetails}>
							Dosage: {med.dosage} | Frequency: {med.frequency}
						</Text>
					</View>
				))}

				<TextInput
					style={styles.textInput}
					placeholder="Additional instructions"
					value={prescription.instructions}
					onChangeText={(text) => setPrescription({ ...prescription, instructions: text })}
					multiline
				/>

				<TouchableOpacity style={styles.saveButton} onPress={savePrescription}>
					<Text style={styles.saveButtonText}>Save Prescription</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	header: {
		backgroundColor: "white",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#00796B",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		marginTop: 5,
	},
	voiceSection: {
		padding: 20,
		alignItems: "center",
	},
	recordButton: {
		backgroundColor: "#00796B",
		paddingVertical: 15,
		paddingHorizontal: 30,
		borderRadius: 25,
		marginBottom: 20,
	},
	recordingButton: {
		backgroundColor: "#d32f2f",
	},
	recordButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	transcriptionBox: {
		backgroundColor: "white",
		padding: 15,
		borderRadius: 10,
		width: "100%",
	},
	transcriptionLabel: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333",
	},
	transcriptionText: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
	},
	prescriptionSection: {
		padding: 20,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
		color: "#333",
	},
	medicationCard: {
		backgroundColor: "white",
		padding: 15,
		borderRadius: 8,
		marginBottom: 10,
	},
	medicationName: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#00796B",
	},
	medicationDetails: {
		fontSize: 14,
		color: "#666",
		marginTop: 5,
	},
	textInput: {
		backgroundColor: "white",
		padding: 15,
		borderRadius: 8,
		marginTop: 15,
		minHeight: 100,
		textAlignVertical: "top",
	},
	saveButton: {
		backgroundColor: "#00796B",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	saveButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default VoicePrescriptionScreen;
