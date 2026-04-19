import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';
import Serializable from './Serializable';

import type { UserHealth as UserHealthDto } from '@common/dtos';

export enum HealthInfoType {
  BLOOD_TYPE = 'Blood type',
  WEIGHT = 'weight',
  HEIGHT = 'height',
  LAST_DONATION_DATE = 'last donation date',
  LAST_VACCINATION_DATE = 'last vaccination date',
  MEDICAL_CONDITION = 'medical condition',
}

@Table({
  tableName: 'user_healths',
  timestamps: true,
  indexes: [
    { fields: ['id', 'infoType'] },
    { fields: ['userId', 'infoType'] }
  ]
})
class UserHealth extends Model implements Serializable<UserHealthDto> {
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
    type: DataType.ENUM(...Object.values(HealthInfoType)),
    allowNull: false,
  })
  declare infoType: HealthInfoType;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare details: string;

  toDto(): UserHealthDto {
    return {
      id: this.id,
      userId: this.userId,
      infoType: this.infoType,
      details: this.details,
    };
  }

  fromDto(dto: Partial<UserHealthDto>): this {
    if (dto.userId !== undefined) this.userId = dto.userId;
    if (dto.infoType !== undefined) this.infoType = dto.infoType as HealthInfoType;
    if (dto.details !== undefined) this.details = dto.details;
    return this;
  }
}

export default UserHealth;

