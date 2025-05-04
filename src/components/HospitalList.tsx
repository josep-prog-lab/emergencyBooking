
import { useState } from "react";
import { Hospital } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Phone as PhoneIcon } from "lucide-react";

interface HospitalListProps {
  hospitals: Hospital[] | null;
  isLoading: boolean;
  onSelectHospital: (hospital: Hospital) => void;
  selectedHospitalId: string | null;
}

const HospitalList = ({
  hospitals,
  isLoading,
  onSelectHospital,
  selectedHospitalId,
}: HospitalListProps) => {
  
  // Loading state for when fetching hospitals
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Nearby Hospitals</h2>
          <p className="text-gray-600">Finding hospitals close to your location...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="hospital-card">
            <CardContent className="p-4 flex flex-col gap-2">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // When no hospitals are found or location hasn't been shared yet
  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-2">No hospitals found</h2>
        <p className="text-gray-600">
          Please share your location to find nearby hospitals
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Nearby Hospitals</h2>
        <p className="text-gray-600">Select a hospital to send your emergency alert</p>
      </div>
      
      {hospitals.map((hospital) => (
        <Card
          key={hospital.id}
          className={`hospital-card ${
            selectedHospitalId === hospital.id
              ? "border-l-8 shadow-xl bg-blue-50"
              : ""
          }`}
          onClick={() => onSelectHospital(hospital)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg mb-2">{hospital.name}</h3>
              <span className="text-sm font-medium text-secondary">
                {hospital.distance.toFixed(1)} km away
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{hospital.address}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>~{hospital.responseTime} min response time</span>
              </div>
              
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-gray-500" />
                <span>{hospital.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HospitalList;
