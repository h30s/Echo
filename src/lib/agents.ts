// Multi-Agent Log Generator for Turing City
// Generates realistic logs for Traffic, Power, Emergency, and Security agents

export type AgentType = 'traffic' | 'power' | 'emergency' | 'security';

export interface LogEntry {
    id: string;
    timestamp: string;
    agent: AgentType;
    message: string;
    severity: 'info' | 'warning' | 'critical';
    sector?: string;
    data?: Record<string, unknown>;
}

// Sectors in Turing City
const SECTORS = ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5', 'Sector 6', 'Sector 7', 'Sector 8'];
const HIGHWAYS = ['Highway A', 'Highway B', 'Highway C', 'Highway D'];
const DRONES = Array.from({ length: 12 }, (_, i) => `Drone ${i + 1}`);
const FIRETRUCKS = Array.from({ length: 8 }, (_, i) => `Fire Truck ${i + 1}`);
const HOSPITALS = ['Central Hospital', 'East Medical', 'West Clinic', 'North Emergency'];

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getTimestamp(): string {
    return new Date().toISOString();
}

// Traffic Agent Log Templates
const trafficTemplates = [
    () => ({ message: `Vehicle count at ${randomItem(SECTORS)}: ${randomNumber(500, 2000)} vehicles/hour`, severity: 'info' as const }),
    () => ({ message: `Congestion level on ${randomItem(HIGHWAYS)}: ${randomNumber(40, 95)}%`, severity: randomNumber(1, 10) > 7 ? 'warning' as const : 'info' as const }),
    () => ({ message: `Traffic signal optimization at ${randomItem(SECTORS)} intersection`, severity: 'info' as const }),
    () => ({ message: `Rerouting ${randomNumber(50, 300)} vehicles from ${randomItem(HIGHWAYS)} due to incident`, severity: 'warning' as const }),
    () => ({ message: `Speed monitoring: Average ${randomNumber(45, 75)} km/h on ${randomItem(HIGHWAYS)}`, severity: 'info' as const }),
    () => ({ message: `Parking occupancy at ${randomItem(SECTORS)}: ${randomNumber(60, 98)}%`, severity: 'info' as const }),
    () => ({ message: `Accident reported near ${randomItem(SECTORS)} - ${randomItem(HIGHWAYS)} junction`, severity: 'critical' as const }),
    () => ({ message: `Traffic flow normalized in ${randomItem(SECTORS)}`, severity: 'info' as const }),
];

// Power Grid Agent Log Templates
const powerTemplates = [
    () => ({ message: `Grid load at Substation ${randomNumber(1, 50)}: ${randomNumber(60, 95)}%`, severity: 'info' as const }),
    () => ({ message: `Power consumption in ${randomItem(SECTORS)}: ${randomNumber(150, 450)} MW`, severity: 'info' as const }),
    () => ({ message: `Solar panel output: ${randomNumber(20, 80)}% efficiency`, severity: 'info' as const }),
    () => ({ message: `Battery storage level: ${randomNumber(40, 90)}%`, severity: 'info' as const }),
    () => ({ message: `Load balancing initiated between Substation ${randomNumber(1, 25)} and ${randomNumber(26, 50)}`, severity: 'warning' as const }),
    () => ({ message: `Scheduled maintenance at Substation ${randomNumber(1, 50)} - capacity reduced`, severity: 'warning' as const }),
    () => ({ message: `Power surge detected in ${randomItem(SECTORS)} - stabilizing`, severity: 'critical' as const }),
    () => ({ message: `Grid frequency: ${(50 + Math.random() * 0.1 - 0.05).toFixed(3)} Hz - nominal`, severity: 'info' as const }),
];

// Emergency Agent Log Templates
const emergencyTemplates = [
    () => ({ message: `911 call received from ${randomItem(SECTORS)} - processing`, severity: 'info' as const }),
    () => ({ message: `${randomItem(FIRETRUCKS)} dispatched to ${randomItem(SECTORS)}`, severity: 'warning' as const }),
    () => ({ message: `Ambulance en route to ${randomItem(HOSPITALS)} - ETA ${randomNumber(3, 15)} min`, severity: 'warning' as const }),
    () => ({ message: `Emergency response time in ${randomItem(SECTORS)}: ${randomNumber(4, 12)} minutes`, severity: 'info' as const }),
    () => ({ message: `${randomItem(DRONES)} deployed for aerial assessment at ${randomItem(SECTORS)}`, severity: 'info' as const }),
    () => ({ message: `Fire alert in ${randomItem(SECTORS)} - severity level ${randomNumber(1, 5)}`, severity: 'critical' as const }),
    () => ({ message: `Medical emergency at ${randomItem(SECTORS)} - ${randomItem(HOSPITALS)} notified`, severity: 'critical' as const }),
    () => ({ message: `All clear signal received from ${randomItem(SECTORS)}`, severity: 'info' as const }),
];

// Security Agent Log Templates
const securityTemplates = [
    () => ({ message: `Camera ${randomNumber(1, 1000)} in ${randomItem(SECTORS)}: All clear`, severity: 'info' as const }),
    () => ({ message: `Facial recognition scan: ${randomNumber(100, 500)} individuals processed`, severity: 'info' as const }),
    () => ({ message: `Patrol route updated for ${randomItem(SECTORS)}`, severity: 'info' as const }),
    () => ({ message: `Unauthorized access attempt at ${randomItem(SECTORS)} facility - monitoring`, severity: 'warning' as const }),
    () => ({ message: `Perimeter sensor triggered at ${randomItem(SECTORS)} boundary`, severity: 'warning' as const }),
    () => ({ message: `Threat level in ${randomItem(SECTORS)}: ${['LOW', 'MODERATE', 'LOW', 'LOW'][randomNumber(0, 3)]}`, severity: 'info' as const }),
    () => ({ message: `Security ${randomItem(DRONES)} completing sweep of ${randomItem(SECTORS)}`, severity: 'info' as const }),
    () => ({ message: `Crowd density at ${randomItem(SECTORS)} event: ${randomNumber(500, 5000)} individuals`, severity: 'info' as const }),
];

const agentTemplates: Record<AgentType, (() => { message: string; severity: 'info' | 'warning' | 'critical' })[]> = {
    traffic: trafficTemplates,
    power: powerTemplates,
    emergency: emergencyTemplates,
    security: securityTemplates,
};

export function generateLog(agent?: AgentType): LogEntry {
    const selectedAgent = agent || randomItem(['traffic', 'power', 'emergency', 'security'] as AgentType[]);
    const templates = agentTemplates[selectedAgent];
    const template = randomItem(templates)();

    return {
        id: generateId(),
        timestamp: getTimestamp(),
        agent: selectedAgent,
        message: template.message,
        severity: template.severity,
        sector: template.message.match(/Sector \d+/)?.[0],
    };
}

export function generateBatchLogs(count: number = 10): LogEntry[] {
    return Array.from({ length: count }, () => generateLog());
}

// Generate emergency scenario logs
export function generateEmergencyScenario(type: 'fire' | 'power_outage' | 'traffic_jam'): LogEntry[] {
    const scenarios: Record<string, LogEntry[]> = {
        fire: [
            { id: generateId(), timestamp: getTimestamp(), agent: 'emergency', message: '🔥 FIRE ALERT: Major fire detected in Sector 7!', severity: 'critical' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'traffic', message: 'Emergency rerouting initiated - clearing Highway B for emergency vehicles', severity: 'critical' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'power', message: 'Power grid isolation initiated in Sector 7 - preventing electrical hazards', severity: 'warning' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'security', message: 'Sector 7 evacuation initiated - all drones deployed for crowd management', severity: 'critical' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'emergency', message: 'Fire Truck 3 en route from Sector 4 - ETA 6 minutes via Highway B', severity: 'warning' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'emergency', message: 'Drone 7 providing aerial thermal imaging of fire spread', severity: 'info' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'traffic', message: 'Highway B cleared - all civilian vehicles diverted to Highway C', severity: 'info' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'emergency', message: 'Central Hospital alerted - 3 ambulances on standby', severity: 'warning' },
        ],
        power_outage: [
            { id: generateId(), timestamp: getTimestamp(), agent: 'power', message: '⚡ POWER OUTAGE: District 4 offline - 50,000 residents affected', severity: 'critical' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'traffic', message: 'Traffic signals in District 4 switching to backup power', severity: 'warning' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'security', message: 'Backup surveillance systems activated in District 4', severity: 'warning' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'power', message: 'Rerouting power from Substation 23 to critical facilities', severity: 'critical' },
        ],
        traffic_jam: [
            { id: generateId(), timestamp: getTimestamp(), agent: 'traffic', message: '🚗 MAJOR CONGESTION: Highway A blocked - multi-vehicle incident', severity: 'critical' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'emergency', message: 'First responders dispatched to Highway A incident', severity: 'warning' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'traffic', message: 'Implementing city-wide rerouting protocol', severity: 'warning' },
            { id: generateId(), timestamp: getTimestamp(), agent: 'security', message: 'Drones monitoring incident scene and traffic flow', severity: 'info' },
        ],
    };

    return scenarios[type] || scenarios.fire;
}

// Agent metadata
export const agentInfo: Record<AgentType, { name: string; icon: string; color: string }> = {
    traffic: { name: 'Traffic Agent', icon: '🚗', color: '#00f5ff' },
    power: { name: 'Power Grid Agent', icon: '⚡', color: '#ffff00' },
    emergency: { name: 'Emergency Agent', icon: '🚨', color: '#ff3366' },
    security: { name: 'Security Agent', icon: '🛡️', color: '#ff00ff' },
};
