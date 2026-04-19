import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';
import Serializable from './Serializable';

import type { UserPreferredLocation as UserPreferredLocationDto } from '@common/dtos';

@Table({
  tableName: 'user_preferred_locations',
  timestamps: true,
  indexes: [
    { fields: ['h3Hex'] },
    { fields: ['id', 'h3Hex'] }
  ]
})
class UserPreferredLocation extends Model implements Serializable<UserPreferredLocationDto> {
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
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare lat: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare lng: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare h3Hex: string;

  toDto(): UserPreferredLocationDto {
    return {
      id: this.id,
      userId: this.userId,
      lat: this.lat,
      lng: this.lng,
      h3Hex: this.h3Hex,
    };
  }

  fromDto(dto: Partial<UserPreferredLocationDto>): this {
    if (dto.userId !== undefined) this.userId = dto.userId;
    if (dto.lat !== undefined) this.lat = dto.lat;
    if (dto.lng !== undefined) this.lng = dto.lng;
    if (dto.h3Hex !== undefined) this.h3Hex = dto.h3Hex;
    return this;
  }
}

export default UserPreferredLocation;

