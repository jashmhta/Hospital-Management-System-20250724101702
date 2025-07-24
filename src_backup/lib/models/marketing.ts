}

/**;
 * Marketing CRM Module Models;
 * TypeScript interfaces corresponding to the Prisma schema for Marketing CRM;
 */;

// Marketing Campaign Model;
}
}

// Campaign Channel Model;
}
}

// Marketing Message Model;
}
}

// Message Interaction Model;
}
}

// Contact Model (for marketing purposes);
}

// Contact Note Model;

// Marketing Activity Model;

// Contact Segment Model;

// Segment Member Model;

// Campaign Segment Model (Many-to-Many);

// Lead Model;

// Lead Activity Model;

// Campaign Analytics Model;

// Marketing Template Model;

// Marketing Event Model;

// Event Registration Model;

// User interface (partial, only for marketing relations);

// Campaign Status enum;
export enum CampaignStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",

// Campaign Type enum;
export enum CampaignType {
  EMAIL = "EMAIL",
  SMS = "SMS",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  EVENT = "EVENT",
  PRINT = "PRINT",
  DIGITAL_AD = "DIGITAL_AD",
  OTHER = "OTHER",

// Channel Type enum;
export enum ChannelType {
  EMAIL = "EMAIL",
  SMS = "SMS",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  EVENT = "EVENT",
  PRINT = "PRINT",
  DIGITAL_AD = "DIGITAL_AD",
  OTHER = "OTHER",

// Message Status enum;
export enum MessageStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  SENT = "SENT",
  FAILED = "FAILED",

// Interaction Type enum;
export enum InteractionType {
  OPEN = "OPEN",
  CLICK = "CLICK",
  REPLY = "REPLY",
  UNSUBSCRIBE = "UNSUBSCRIBE",
  BOUNCE = "BOUNCE",

// Contact Status enum;
export enum ContactStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  UNSUBSCRIBED = "UNSUBSCRIBED",
  BOUNCED = "BOUNCED",

// Lead Status enum;
export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  CONVERTED = "CONVERTED",
  LOST = "LOST",

// Lead Source enum;
export enum LeadSource {
  WEBSITE = "WEBSITE",
  REFERRAL = "REFERRAL",
  EVENT = "EVENT",
  ADVERTISEMENT = "ADVERTISEMENT",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  OTHER = "OTHER",

// Event Status enum;
export enum EventStatus {
  PLANNED = "PLANNED",
  OPEN = "OPEN",
  FULL = "FULL",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",

// Registration Status enum;
export enum RegistrationStatus {
  REGISTERED = "REGISTERED",
  CONFIRMED = "CONFIRMED",
  ATTENDED = "ATTENDED",
  NO_SHOW = "NO_SHOW",
  CANCELLED = "CANCELLED";
