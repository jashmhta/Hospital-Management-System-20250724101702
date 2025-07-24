import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from "@apollo/gateway";
import { RedisCache } from "apollo-server-cache-redis";
import {
	ApolloServerPluginCacheControl,
	ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import responseCachePlugin from "apollo-server-plugin-response-cache";
import { Express } from "express";
import type { GraphQLSchema } from "graphql";
import Redis from "ioredis";

import type { ILogger } from "../../lib/core/logging";
import type { MetricsCollector } from "../../lib/monitoring/metrics-collector";
import { authMiddleware } from "../middleware/auth";
/**
 * GraphQL Federation Configuration
 *
 * This module configures Apollo Federation to create a unified GraphQL schema
 * across multiple microservices. It implements:
 *
 * - Service discovery for GraphQL endpoints
 * - Schema composition with conflict resolution
 * - Type merging and references across services
 * - Query planning and execution
 * - Caching with invalidation
 */
export interface ServiceDefinition {
	name: string;
	url: string;
}

export interface FederationConfig {
	services: ServiceDefinition[];
	redisConfig: {
		host: string;
		port: number;
		password?: string;
		db?: number;
	};
	enablePlayground: boolean;
	enableIntrospection: boolean;
	defaultQueryTimeout: number;
	logger: ILogger;
	metrics: MetricsCollector;
}

export class GraphQLFederation {
	private gateway: ApolloGateway;
	private server: ApolloServer;
	private schema: GraphQLSchema | null = null;
	private redis: Redis.Redis;
	private config: FederationConfig;
	private logger: ILogger;
	private metrics: MetricsCollector;
	constructor(config: FederationConfig) {
		this.config = config;
		this.logger = config.logger;
		this.metrics = config.metrics;
		// Initialize Redis
		this.redis = new Redis({
			host: config.redisConfig.host,
			port: config.redisConfig.port,
			password: config.redisConfig.password,
			db: config.redisConfig.db || 0,
		});
		// Create authenticated data source class
		class AuthenticatedDataSource extends RemoteGraphQLDataSource {
			willSendRequest({ request, context }: any) {
				if (context.user) {
					request.http.headers.set("x-user-id", context.user.id);
					request.http.headers.set("x-user-roles", JSON.stringify(context.user.roles));
				}
				if (context.trace) {
					request.http.headers.set("x-trace-id", context.trace.traceId);
					request.http.headers.set("x-span-id", context.trace.spanId);
				}
				request.http.timeout = config.defaultQueryTimeout;
			}
			async didReceiveResponse({ response, request, context }: any) {
				const serviceName = this.url.split("/").pop() || "unknown";
				const operationName = request.operationName || "unknown";
				this.metrics.recordHistogram(
					"graphql.service_response_time",
					response.extensions?.timing || 0,
					{
						service: serviceName,
						operation: operationName,
					}
				);
				return response;
			}
			async didEncounterError({ error, request }: any) {
				const serviceName = this.url.split("/").pop() || "unknown";
				const operationName = request.operationName || "unknown";
				this.metrics.incrementCounter("graphql.service_errors", 1, {
					service: serviceName,
					operation: operationName,
					errorType: error.name || "UnknownError",
				});
				this.logger.error("GraphQL federation service error", {
					service: serviceName,
					operation: operationName,
					error: error.message,
				});
				return error;
			}
			experimental_didUpdateComposition({ typeDefs, errors }: any) {
				if (errors != null) {
					this.logger.error("Error composing GraphQL schema", { errors });
					return;
				}
				this.logger.info("GraphQL schema updated successfully");
			}
			experimental_didFailComposition({ errors }: any) {
				this.logger.error("Failed to compose GraphQL schema", { errors });
			}
			__exposeQueryPlanExperimental = config.enablePlayground;
		}
		// Initialize Apollo Gateway
		this.gateway = new ApolloGateway({
			supergraphSdl: new IntrospectAndCompose({
				subgraphs: config.services.map((service) => ({
					name: service.name,
					url: service.url,
				})),
				pollIntervalInMs: 60000, // Poll for schema changes every minute
			}),
			buildService: ({ url }) => new AuthenticatedDataSource({ url }),
		});
		// Initialize Apollo Server
		this.server = new ApolloServer({
			gateway: this.gateway,
			plugins: [
				ApolloServerPluginCacheControl({
					defaultMaxAge: 30, // Default max age of 30 seconds
				}),
				responseCachePlugin({
					cache: new RedisCache({
						client: this.redis,
						prefix: "apollo-cache:",
					}),
					sessionId: (requestContext) => {
						if (requestContext.context.user) {
							return `${requestContext.context.user.id}:${requestContext.context.user.roles.join(",")}`;
						}
						return null;
					},
				}),
				config.enablePlayground ? ApolloServerPluginLandingPageGraphQLPlayground() : undefined,
				{
					async serverWillStart() {
						config.logger.info("GraphQL Federation gateway starting...");
						return {
							async serverWillStop() {
								config.logger.info("GraphQL Federation gateway stopping...");
							},
						};
					},
				},
			],
		});
	}
}

export default FederationService;
