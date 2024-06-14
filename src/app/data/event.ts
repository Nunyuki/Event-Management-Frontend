
export interface Event {
  id: string;
  eventName: string;
  createdBy: string;
  createdOn: Date;
  categoryId: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  eventDescription: string;
}