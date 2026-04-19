import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import User from './User';
import RequestState from './RequestState';
import Serializable from './Serializable';

import type { Request as RequestDto } from '@common/dtos';

export enum RequestStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

@Table({
  tableName: 'requests',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['locationHex'] },
    { fields: ['bloodType', 'locationHex', 'status'] }
  ]
})
class Request extends Model implements Serializable<RequestDto> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare locationHex: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare locationLat: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare locationLng: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare bagCount: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare requiredByDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare bloodType: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare contactPhone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare requesterInfo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare locationName: string;

  @Column({
    type: DataType.ENUM(...Object.values(RequestStatus)),
    allowNull: false,
    defaultValue: RequestStatus.PENDING,
  })
  declare status: RequestStatus;

  @HasMany(() => RequestState, 'requestId')
  declare requestStates: RequestState[];

  toDto(): RequestDto {
    return {
      id: this.id,
      userId: this.userId,
      locationHex: this.locationHex,
      locationLat: this.locationLat,
      locationLng: this.locationLng,
      bagCount: this.bagCount,
      requiredByDate: this.requiredByDate,
      bloodType: this.bloodType,
      contactPhone: this.contactPhone,
      description: this.description,
      requesterInfo: this.requesterInfo,
      locationName: this.locationName,
      status: this.status,
    };
  }

  fromDto(dto: Partial<RequestDto>): this {
    if (dto.userId !== undefined) this.userId = dto.userId;
    if (dto.locationHex !== undefined) this.locationHex = dto.locationHex;
    if (dto.locationLat !== undefined) this.locationLat = dto.locationLat;
    if (dto.locationLng !== undefined) this.locationLng = dto.locationLng;
    if (dto.bagCount !== undefined) this.bagCount = dto.bagCount;
    if (dto.requiredByDate !== undefined) this.requiredByDate = dto.requiredByDate;
    if (dto.bloodType !== undefined) this.bloodType = dto.bloodType;
    if (dto.contactPhone !== undefined) this.contactPhone = dto.contactPhone;
    if (dto.description !== undefined) this.description = dto.description;
    if (dto.requesterInfo !== undefined) this.requesterInfo = dto.requesterInfo;
    if (dto.locationName !== undefined) this.locationName = dto.locationName;
    if (dto.status !== undefined) this.status = dto.status as RequestStatus;
    return this;
  }
}

export default Request;

