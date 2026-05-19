export interface EventLocation {
  city?: string;
  state?: string;
  country?: string;
}

export interface VRMSEvent {
  _id: string;
  name: string;
  location?: EventLocation;
  hacknight?: string;
  eventType?: string;
  description?: string;
  project?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  hours?: number;
  createdDate?: string;
  updatedDate?: string;
  checkInReady: boolean;
  videoConferenceLink?: string;
  owner?: { ownerId: number };
  recurringEventLink?: { recurringEventId: string };
}

export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

export interface CronLike {
  schedule(expression: string, callback: () => void): unknown;
}
