import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Request from './Request';
import User from './User';
import Serializable from './Serializable';

import type { RequestState as RequestStateDto } from '@common/dtos';

export enum RequestStateAction {
  ACCEPTED = 'Accepted',
  DECLINED = 'Declined',
  PENDING = 'Pending',
  DONATED = 'Donated',
}

@Table({
  tableName: 'request_states',
  timestamps: true,
  indexes: [
    { fields: ['id', 'actionedById'] }
  ]
})
class RequestState extends Model implements Serializable<RequestStateDto> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Request)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare requestId: string;

  @BelongsTo(() => Request)
  declare request: Request;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare actionedById: string;

  @BelongsTo(() => User, 'actionedById')
  declare actionedBy: User;

  @Column({
    type: DataType.ENUM(...Object.values(RequestStateAction)),
    allowNull: false,
  })
  declare action: RequestStateAction;

  toDto(): RequestStateDto {
    return {
      id: this.id,
      requestId: this.requestId,
      actionedById: this.actionedById,
      action: this.action,
    };
  }

  fromDto(dto: Partial<RequestStateDto>): this {
    if (dto.requestId !== undefined) this.requestId = dto.requestId;
    if (dto.actionedById !== undefined) this.actionedById = dto.actionedById;
    if (dto.action !== undefined) this.action = dto.action as RequestStateAction;
    return this;
  }
}

export default RequestState;
