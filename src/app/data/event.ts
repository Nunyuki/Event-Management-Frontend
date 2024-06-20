export interface Event {
  id: string;
  eventName: string;
  createdBy: string;
  createdOn: string;
  categoryName: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  maxCapacity: number;
  image: File | null;
}