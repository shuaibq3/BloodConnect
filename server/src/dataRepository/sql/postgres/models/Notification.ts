import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';
import Serializable from './Serializable';

import type { Notification as NotificationDto } from '@common/dtos';

export enum NotificationType {
  REQUEST = 'Blood donation request',
  COMPLETION = 'Blood donation completion',
  ACCEPTANCE = 'Blood donation request acceptance',
}

export enum NotificationStatus {
  SENT = 'Sent',
  FAILED = 'Failed',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
}

@Table({
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    { fields: ['id', 'notificationType'] },
    { fields: ['notificationType', 'recipientId'] }
  ]
})
class Notification extends Model implements Serializable<NotificationDto> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM(...Object.values(NotificationType)),
    allowNull: false,
  })
  declare notificationType: NotificationType;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare recipientId: string;

  @BelongsTo(() => User, 'recipientId')
  declare recipient: User;

  @Column({
    type: DataType.ENUM(...Object.values(NotificationStatus)),
    allowNull: false,
    defaultValue: NotificationStatus.PENDING,
  })
  declare status: NotificationStatus;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  toDto(): NotificationDto {
    return {
      id: this.id,
      notificationType: this.notificationType,
      recipientId: this.recipientId,
      status: this.status,
      title: this.title,
      content: this.content,
    };
  }

  fromDto(dto: Partial<NotificationDto>): this {
    if (dto.notificationType !== undefined) this.notificationType = dto.notificationType as NotificationType;
    if (dto.recipientId !== undefined) this.recipientId = dto.recipientId;
    if (dto.status !== undefined) this.status = dto.status as NotificationStatus;
    if (dto.title !== undefined) this.title = dto.title;
    if (dto.content !== undefined) this.content = dto.content;
    return this;
  }
}

export default Notification;

