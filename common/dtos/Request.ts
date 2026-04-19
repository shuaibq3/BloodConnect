type Request = {
  id: string;
  userId: string;
  locationHex: string;
  locationLat: number;
  locationLng: number;
  bagCount: number;
  requiredByDate: Date;
  bloodType: string;
  contactPhone?: string;
  description?: string;
  requesterInfo?: string;
  locationName?: string;
  status: string;
};

export default Request;
