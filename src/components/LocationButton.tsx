
import { useState } from "react";
import { UserLocation } from "../types/types";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LocationButtonProps {
  onLocationDetected: (location: UserLocation) => void;
  isLoading?: boolean;
}

const LocationButton = ({ onLocationDetected, isLoading = false }: LocationButtonProps) => {
  const { toast } = useToast();
  const [detecting, setDetecting] = useState(false);

  const detectLocation = () => {
    setDetecting(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      setDetecting(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation: UserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        // Get address using reverse geocoding (in a real app)
        // For now, just simulate address retrieval with a timeout
        setTimeout(() => {
          userLocation.address = "123 Main St, City";
          onLocationDetected(userLocation);
          setDetecting(false);
          
          toast({
            title: "Location detected",
            description: "Your location has been successfully detected.",
          });
        }, 1000);
      },
      (error) => {
        let errorMessage = "Unknown error occurred while detecting location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Request to get location timed out.";
            break;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        setDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <Button
      onClick={detectLocation}
      disabled={detecting || isLoading}
      className="location-btn flex items-center gap-2 text-lg"
      size="lg"
    >
      {detecting ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
          Detecting...
        </>
      ) : (
        <>
          <MapPin className="h-5 w-5" />
          MY LOCATION
        </>
      )}
    </Button>
  );
};

export default LocationButton;
