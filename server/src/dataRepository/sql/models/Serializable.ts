export default interface Serializable<Dto> {
  toDto(): Dto;
  fromDto(dto: Partial<Dto>): this;
}
