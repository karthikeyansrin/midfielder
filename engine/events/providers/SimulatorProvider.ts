import { EventProvider } from './EventProvider';
import { StadiumEvent, EventCategory, EventSeverity } from '../../../domain/events/StadiumEvent';

interface EventTemplate {
  title: string;
  category: EventCategory;
  severity: EventSeverity;
  descriptionTemplate: string[];
  zones: string[];
  probabilityWeight: number;
}

export class SimulatorProvider implements EventProvider {
  public readonly name = 'SimulatorProvider';
  private timer: NodeJS.Timeout | null = null;
  private onEventPublished: ((event: StadiumEvent) => void) | null = null;
  private _isPaused: boolean = false;
  private intervalMs: number = 15000;

  // Real-world stadium zones
  private zones = ['North Gate', 'South Gate', 'East Gate', 'West Gate', 'VIP Lounge', 'Section 101', 'Section 102', 'Food Court A', 'Merch Stand 1'];

  // Event templates with probabilities
  private eventTemplates: EventTemplate[] = [
    {
      title: 'Crowd Congestion',
      category: 'crowd_control',
      severity: 'medium',
      descriptionTemplate: ['High density of fans detected at {zone}.', 'Movement is slowing down significantly at {zone}.'],
      zones: ['North Gate', 'South Gate', 'Section 101', 'Section 102'],
      probabilityWeight: 25,
    },
    {
      title: 'Food Queue Increase',
      category: 'operational',
      severity: 'low',
      descriptionTemplate: ['Wait times at {zone} have exceeded 15 minutes.', 'High demand at {zone}. Additional staff recommended.'],
      zones: ['Food Court A'],
      probabilityWeight: 20,
    },
    {
      title: 'Merchandise Promotion',
      category: 'marketing',
      severity: 'low',
      descriptionTemplate: ['Flash sale active at {zone}.', 'New team jerseys arrived at {zone}.'],
      zones: ['Merch Stand 1'],
      probabilityWeight: 15,
    },
    {
      title: 'Gate Closure',
      category: 'operational',
      severity: 'high',
      descriptionTemplate: ['{zone} has been temporarily closed for maintenance.', '{zone} is closed due to a minor technical fault with the turnstiles.'],
      zones: ['North Gate', 'South Gate', 'East Gate', 'West Gate'],
      probabilityWeight: 10,
    },
    {
      title: 'Transit Delay',
      category: 'operational',
      severity: 'medium',
      descriptionTemplate: ['Metro line servicing {zone} is reporting 20 minute delays.', 'Heavy traffic reported near {zone}. Expect delayed arrivals.'],
      zones: ['North Gate', 'East Gate'],
      probabilityWeight: 10,
    },
    {
      title: 'Medical Emergency',
      category: 'medical',
      severity: 'critical',
      descriptionTemplate: ['Medical team dispatched to {zone} for fan requiring assistance.', 'First aid required at {zone}.'],
      zones: this.zones,
      probabilityWeight: 5,
    },
    {
      title: 'Security Incident',
      category: 'security',
      severity: 'high',
      descriptionTemplate: ['Unattended bag reported at {zone}. Security investigating.', 'Minor altercation reported at {zone}. Security on scene.'],
      zones: this.zones,
      probabilityWeight: 5,
    },
    {
      title: 'Weather Alert',
      category: 'weather',
      severity: 'medium',
      descriptionTemplate: ['Approaching thunderstorms. Ensure {zone} is secure.', 'High winds expected. Checking temporary structures near {zone}.'],
      zones: ['North Gate', 'South Gate', 'East Gate', 'West Gate'],
      probabilityWeight: 10,
    },
  ];

  public start(onEventPublished: (event: StadiumEvent) => void, intervalMs: number = 15000): void {
    this.onEventPublished = onEventPublished;
    this.intervalMs = intervalMs;
    this._isPaused = false;
    
    this.startTimer();

    // Generate an initial event immediately
    this.generateEvent();
  }

  private startTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this._isPaused) {
        this.generateEvent();
      }
    }, this.intervalMs);
  }

  public pause(): void {
    this._isPaused = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public resume(): void {
    if (this._isPaused) {
      this._isPaused = false;
      this.startTimer();
    }
  }

  public get isPaused(): boolean {
    return this._isPaused;
  }

  public generateManualEvent(): void {
    this.generateEvent();
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.onEventPublished = null;
  }

  private generateEvent(): void {
    if (!this.onEventPublished) return;

    const template = this.selectRandomTemplate();
    const zone = template.zones[Math.floor(Math.random() * template.zones.length)];
    const description = template.descriptionTemplate[Math.floor(Math.random() * template.descriptionTemplate.length)].replace('{zone}', zone);

    const newEvent: StadiumEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      category: template.category,
      severity: template.severity,
      title: template.title,
      description,
      location: {
        description: zone,
      },
      affectedZones: [zone],
      status: 'active',
      source: this.name,
      metadata: {
        generatedBy: 'simulator',
        probabilityWeight: template.probabilityWeight
      }
    };

    this.onEventPublished(newEvent);
  }

  private selectRandomTemplate(): EventTemplate {
    const totalWeight = this.eventTemplates.reduce((sum, t) => sum + t.probabilityWeight, 0);
    let randomNum = Math.random() * totalWeight;

    for (const template of this.eventTemplates) {
      if (randomNum < template.probabilityWeight) {
        return template;
      }
      randomNum -= template.probabilityWeight;
    }

    return this.eventTemplates[0];
  }
}
