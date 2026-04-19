import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import UserHealth from './UserHealth';
import UserPreferredLocation from './UserPreferredLocation';
import Request from './Request';
import RequestState from './RequestState';
import Notification from './Notification';
import Serializable from './Serializable';
import type { User as UserDto } from '@common/dtos';

@Table({
  tableName: 'users',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['phone'] }
  ]
})
class User extends Model implements Serializable<UserDto> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare phone: string;

  @HasMany(() => UserHealth)
  declare healthInfo: UserHealth[];

  @HasMany(() => UserPreferredLocation)
  declare preferredLocations: UserPreferredLocation[];

  @HasMany(() => Request, 'userId')
  declare requests: Request[];

  @HasMany(() => RequestState, 'actionedById')
  declare actionedRequests: RequestState[];

  @HasMany(() => Notification, 'recipientId')
  declare notifications: Notification[];

  toDto(): UserDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
    };
  }

  fromDto(dto: Partial<UserDto>): this {
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.email !== undefined) this.email = dto.email;
    if (dto.phone !== undefined) this.phone = dto.phone;
    return this;
  }
}

export default User;

