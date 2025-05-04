
export enum EmergencyType {
  ACCIDENT = "Accident",
  PREGNANCY = "Pregnancy",
  OTHER = "Other Emergency"
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: number; // in kilometers
  responseTime: number; // estimated response time in minutes
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface EmergencyRequest {
  type: EmergencyType;
  description?: string;
  userLocation: UserLocation;
  selectedHospital?: Hospital;
  timestamp: Date;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'hospital';
  timestamp: Date;
}
