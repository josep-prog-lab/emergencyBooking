
import { Hospital } from "../types/types";

export const mockHospitals: Hospital[] = [
  {
    id: "h1",
    name: "City Emergency Hospital",
    address: "123 Main Street, Downtown",
    distance: 1.2,
    responseTime: 5,
    phone: "+1 (555) 123-4567",
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    }
  },
  {
    id: "h2",
    name: "General Medical Center",
    address: "456 Park Avenue, Midtown",
    distance: 2.5,
    responseTime: 8,
    phone: "+1 (555) 234-5678",
    coordinates: {
      lat: 37.7833,
      lng: -122.4167
    }
  },
  {
    id: "h3",
    name: "St. Mary's Hospital",
    address: "789 Oak Street, Westside",
    distance: 3.7,
    responseTime: 12,
    phone: "+1 (555) 345-6789",
    coordinates: {
      lat: 37.7694,
      lng: -122.4862
    }
  },
  {
    id: "h4",
    name: "Memorial Healthcare",
    address: "101 Pine Road, Eastside",
    distance: 4.2,
    responseTime: 15,
    phone: "+1 (555) 456-7890",
    coordinates: {
      lat: 37.7992,
      lng: -122.3892
    }
  },
  {
    id: "h5",
    name: "University Medical Hospital",
    address: "202 Campus Drive, University District",
    distance: 5.6,
    responseTime: 18,
    phone: "+1 (555) 567-8901",
    coordinates: {
      lat: 37.8044,
      lng: -122.2711
    }
  }
];

export const getHospitalsByDistance = (userLat: number, userLng: number) => {
  // In a real app, this would calculate actual distances based on user coordinates
  // For now, we'll just return the mock data sorted by the predefined distances
  return [...mockHospitals].sort((a, b) => a.distance - b.distance);
};

// Function to simulate a delay in getting hospitals (for loading states)
export const fetchNearbyHospitals = (userLat: number, userLng: number): Promise<Hospital[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getHospitalsByDistance(userLat, userLng));
    }, 1500);
  });
};
