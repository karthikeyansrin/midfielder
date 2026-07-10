export type EventCategory = 'security' | 'medical' | 'maintenance' | 'crowd_control' | 'weather' | 'operational' | 'match' | 'marketing';
export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';
export type EventStatus = 'active' | 'resolved' | 'investigating' | 'dismissed';

export interface Location {
  lat?: number;
  lng?: number;
  description?: string;
}

export interface StadiumEvent {
  id: string;
  timestamp: string; // ISO 8601 string
  category: EventCategory;
  severity: EventSeverity;
  title: string;
  description: string;
  location: Location;
  affectedZones: string[];
  metadata?: Record<string, unknown>;
  status: EventStatus;
  source: string;
}
