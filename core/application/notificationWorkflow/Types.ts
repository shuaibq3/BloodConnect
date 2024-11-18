import { UserDTO } from '../../../commons/dto/UserDTO'

export interface NotificationAttributes {
  userId: string;
  title: string;
  body: string;
  type: string;
  payload: Record<string, unknown>;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface NotificationQueueMessage {
  userId: string;
  snsEndpointArn: string;
  type: string;
  payload: NotificationPayload;
}
export interface StoreNotificationEndPoint extends UserDTO {
  snsEndpointArn: string;
  updatedAt?: string;
}

export interface SnsRegistrationAttributes {
  userId: string;
  deviceToken: string;
  platform: 'APNS' | 'FCM';
}
