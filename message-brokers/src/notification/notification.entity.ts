export enum NotificationEvents {
  SignUp = 'UserSignedUp',
}

export type Notification = {
  event: NotificationEvents;
};
