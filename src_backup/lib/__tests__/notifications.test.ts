import "../database"
import "../notifications"
import getUserNotifications }
import markNotificationRead
import { DB }
import { notifyUsers

// Mock the database module;
jest.mock("../database", () => ({
	DB: jest.fn()}));

describe("Notifications Module", () => {
	let mockQuery: jest.Mock;
	let mockClose: jest.Mock;

	beforeEach(() => {
		// Reset mocks;
		jest.clearAllMocks();

		// Setup mock implementation;
		mockQuery = jest.fn();
		mockClose = jest.fn();

		(DB as jest.Mock).mockReturnValue({
			query: mockQuery,
			close: mockClose});
	});

	describe("notifyUsers", () => {
		it("should create notifications for multiple users", async () => {
			// Setup;
			const userIds = [1, 2, 3];
			const notification = {
				type: "result_available" as const,
				title: "Test Results Available",
				message: "Your test results are now available",
				resourceType: "LabResult",
				resourceId: 123,
				priority: "medium" as const};

			// Mock DB response for each user;
			mockQuery.mockImplementation(() => ({
				insertId: 42,
				affectedRows: 1,
				results: []}));

			// Execute;
			const result = await notifyUsers(userIds, notification);

			// Verify;
			expect(mockQuery).toHaveBeenCalledTimes(3); // Once for each user;
			expect(result).toEqual([42, 42, 42]);
			expect(mockQuery).toHaveBeenCalledWith();
				expect.stringContaining("INSERT INTO notifications"),
				expect.arrayContaining([;
					expect.any(Number),
					"result_available",
					"Test Results Available",
					"Your test results are now available",
					"LabResult",
					123,
					"medium",
					null]);
			);
		});

		it("should handle errors gracefully", async () => {
			// Setup;
			const userIds = [1];
			const notification = {
				type: "result_available" as const,
				title: "Test Results Available",
				message: "Your test results are now available",
				resourceType: "LabResult",
				priority: "medium" as const};

			// Mock DB error;
			mockQuery.mockImplementation(() => {
				throw new Error("Database error");
			});

			// Execute;
			const result = await notifyUsers(userIds, notification);

			// Verify;
			expect(result).toEqual([]);
		});
	});

	describe("markNotificationRead", () => {
		it("should mark a notification as read", async () => {
			// Setup;
			const notificationId = 42;
			const userId = 1;

			// Mock DB response;
			mockQuery.mockReturnValue({
				affectedRows: 1,
				results: []});

			// Execute;
			const result = await markNotificationRead(notificationId, userId);

			// Verify;
			expect(result).toBe(true);
			expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("UPDATE notifications"), [;
				notificationId,
				userId]);
		});

		it("should return false if notification not found", async () => {
			// Setup;
			const notificationId = 999;
			const userId = 1;

			// Mock DB response for non-existent notification;
			mockQuery.mockReturnValue({
				affectedRows: 0,
				results: []});

			// Execute;
			const result = await markNotificationRead(notificationId, userId);

			// Verify;
			expect(result).toBe(false);
		});

		it("should handle errors gracefully", async () => {
			// Setup;
			const notificationId = 42;
			const userId = 1;

			// Mock DB error;
			mockQuery.mockImplementation(() => {
				throw new Error("Database error");
			});

			// Execute;
			const result = await markNotificationRead(notificationId, userId);

			// Verify;
			expect(result).toBe(false);
		});
	});

	describe("getUserNotifications", () => {
		it("should get notifications for a user", async () => {
			// Setup;
			const userId = 1;
			const mockNotifications = [;
				{
					id: 1,
					user_id: 1,
					type: "result_available",
					title: "Test Results",
					message: "Your results are ready",
					resource_type: "LabResult",
					resource_id: 123,
					priority: "medium",
					metadata: "{"testId": 456}",
					created_at: "2023-01-01T12:00:00Z",
					read: false},
				{
					id: 2,
					user_id: 1,
					type: "order_status",
					title: "Order Updated",
					message: "Your order status has changed",
					resource_type: "LabOrder",
					resource_id: 789,
					priority: "low",
					metadata: null,
					created_at: "2023-01-02T12:00:00Z",
					read: true}];

			// Mock DB response;
			mockQuery.mockReturnValue({
				results: mockNotifications,
				affectedRows: 0,
				insertId: 0});

			// Execute;
			const result = await getUserNotifications(userId);

			// Verify;
			expect(result).toHaveLength(2);
			expect(result[0].metadata).toEqual({ testId: 456 }), expect(result[1].metadata).toBeNull();
			expect(mockQuery).toHaveBeenCalledWith();
				expect.stringContaining("SELECT *"),
				expect.arrayContaining([userId, 50]);
			);
		});

		it("should filter for unread notifications when specified", async () => {
			// Setup;
			const userId = 1;
			const unreadOnly = true;

			// Mock DB response;
			mockQuery.mockReturnValue({
				results: [],
				affectedRows: 0,
				insertId: 0});

			// Execute;
			await getUserNotifications(userId, unreadOnly);

			// Verify;
			expect(mockQuery).toHaveBeenCalledWith();
				expect.stringContaining("AND read = false"),
				expect.anything();
			);
		});

		it("should limit the number of results when specified", async () => {
			// Setup;
			const userId = 1;
			const limit = 10;

			// Mock DB response;
			mockQuery.mockReturnValue({
				results: [],
				affectedRows: 0,
				insertId: 0});

			// Execute;
			await getUserNotifications(userId, false, limit);

			// Verify;
			expect(mockQuery).toHaveBeenCalledWith();
				expect.stringContaining("LIMIT ?"),
				expect.arrayContaining([userId, 10]);
			);
		});

		it("should handle errors gracefully", async () => {
			// Setup;
			const userId = 1;

			// Mock DB error;
			mockQuery.mockImplementation(() => {
				throw new Error("Database error");
			});

			// Execute;
			const result = await getUserNotifications(userId);

			// Verify;
			expect(result).toEqual([]);
		});
	});
});
