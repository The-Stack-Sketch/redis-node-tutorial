// A pretend database. Every read takes 800 ms, like a slow query on a busy table.
export interface Event {
  id: number;
  name: string;
  venue: string;
  seatsLeft: number;
}

const events = new Map<number, Event>([
  [42, { id: 42, name: "Jazz Night", venue: "City Hall", seatsLeft: 120 }],
  [43, { id: 43, name: "Indie Fest", venue: "Riverside Park", seatsLeft: 900 }],
]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getEvent(id: number): Promise<Event | null> {
  await sleep(800);
  return events.get(id) ?? null;
}

export async function updateEvent(id: number, changes: Partial<Event>): Promise<Event | null> {
  await sleep(200);
  const event = events.get(id);
  if (!event) return null;
  Object.assign(event, changes);
  return event;
}
