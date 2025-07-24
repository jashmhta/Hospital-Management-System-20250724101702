import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import { useOfflineHook } from "react-native-offline";

const HomeScreen = ({ navigation }) => {
	const [patientData, setPatientData] = useState(null);
	const [upcomingAppointments, setUpcomingAppointments] = useState([]);
	const [isOffline, setIsOffline] = useState(false);
	const offlineData = useOfflineHook();

	useEffect(() => {
		initializeBiometrics();
		loadPatientData();
		checkConnectivity();
	}, []);

	const initializeBiometrics = async () => {
		try {
			const { available, biometryType } = await ReactNativeBiometrics.isSensorAvailable();
			if (available) {
				// Setup biometric authentication
				const { success } = await ReactNativeBiometrics.simplePrompt();
				if (!success) {
					Alert.alert("Biometric authentication failed");
				}
			}
		} catch (error) {
			/* SECURITY: Console statement removed */
		}
	};

	const loadPatientData = async () => {
		try {
			// Try to load from cache first (offline capability)
			const cachedData = await AsyncStorage.getItem("patientData");
			if (cachedData) {
				setPatientData(JSON.parse(cachedData));
			}

			// Fetch fresh data if online
			if (!offlineData.isOffline) {
				const response = await fetch("/api/patients/me", {
					headers: {
						Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
					},
				});
				const data = await response.json();
				setPatientData(data);

				// Cache the data for offline use
				await AsyncStorage.setItem("patientData", JSON.stringify(data));
			}
		} catch (error) {
			/* SECURITY: Console statement removed */
		}
	};

	const checkConnectivity = () => {
		setIsOffline(offlineData.isOffline);
	};

	return (
		<ScrollView style={styles.container}>
			{isOffline && (
				<View style={styles.offlineBar}>
					<Text style={styles.offlineText}>Offline Mode - Limited functionality</Text>
				</View>
			)}

			<View style={styles.header}>
				<Text style={styles.welcomeText}>Welcome back, {patientData?.full_name || "Patient"}</Text>
				<Text style={styles.patientId}>ID: {patientData?.mrn}</Text>
			</View>

			<View style={styles.quickActions}>
				<TouchableOpacity
					style={styles.actionCard}
					onPress={() => navigation.navigate("Appointments")}
				>
					<Text style={styles.actionTitle}>Book Appointment</Text>
					<Text style={styles.actionSubtitle}>Schedule your next visit</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Records")}>
					<Text style={styles.actionTitle}>Medical Records</Text>
					<Text style={styles.actionSubtitle}>View your health history</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Bills")}>
					<Text style={styles.actionTitle}>Pay Bills</Text>
					<Text style={styles.actionSubtitle}>Manage your payments</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.upcomingSection}>
				<Text style={styles.sectionTitle}>Upcoming Appointments</Text>
				{upcomingAppointments.map((appointment, index) => (
					<View key={index} style={styles.appointmentCard}>
						<Text style={styles.appointmentDate}>{appointment.date}</Text>
						<Text style={styles.appointmentDoctor}>Dr. {appointment.doctor}</Text>
						<Text style={styles.appointmentDepartment}>{appointment.department}</Text>
					</View>
				))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	offlineBar: {
		backgroundColor: "#ff9500",
		padding: 10,
		alignItems: "center",
	},
	offlineText: {
		color: "white",
		fontSize: 14,
		fontWeight: "bold",
	},
	header: {
		backgroundColor: "white",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	welcomeText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	patientId: {
		fontSize: 16,
		color: "#666",
		marginTop: 5,
	},
	quickActions: {
		padding: 20,
	},
	actionCard: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	actionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#007AFF",
		marginBottom: 5,
	},
	actionSubtitle: {
		fontSize: 14,
		color: "#666",
	},
	upcomingSection: {
		padding: 20,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
		color: "#333",
	},
	appointmentCard: {
		backgroundColor: "white",
		padding: 15,
		borderRadius: 8,
		marginBottom: 10,
	},
	appointmentDate: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#007AFF",
	},
	appointmentDoctor: {
		fontSize: 14,
		color: "#333",
		marginTop: 5,
	},
	appointmentDepartment: {
		fontSize: 12,
		color: "#666",
		marginTop: 2,
	},
});

export default HomeScreen;
