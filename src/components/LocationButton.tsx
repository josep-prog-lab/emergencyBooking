
import { useState } from "react";
import { UserLocation } from "../types/types";
import { Button } from "@/components/ui/button";
import { MapPin, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface LocationButtonProps {
  onLocationDetected: (location: UserLocation) => void;
  isLoading?: boolean;
}

const LocationButton = ({ onLocationDetected, isLoading = false }: LocationButtonProps) => {
  const { toast } = useToast();
  const [detecting, setDetecting] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState("");

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
        
        // Attempt to get more accurate address using reverse geocoding API
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}&zoom=18&addressdetails=1`)
          .then(response => response.json())
          .then(data => {
            if (data && data.display_name) {
              userLocation.address = data.display_name;
            } else {
              userLocation.address = "Location detected (address unavailable)";
            }
            onLocationDetected(userLocation);
            setDetecting(false);
            
            toast({
              title: "Location detected",
              description: "Your location has been successfully detected.",
            });
          })
          .catch(error => {
            console.error("Geocoding error:", error);
            userLocation.address = "Location detected (address unavailable)";
            onLocationDetected(userLocation);
            setDetecting(false);
            
            toast({
              title: "Location detected",
              description: "Your coordinates were detected but we couldn't retrieve your address.",
            });
          });
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
        maximumAge: 0,
        timeout: 15000
      }
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location or use automatic detection.",
        variant: "destructive",
      });
      return;
    }

    // Create a user location with the manual address
    // Note: We use placeholder coordinates as they'll be less relevant with a manual address
    const userLocation: UserLocation = {
      lat: 0,
      lng: 0,
      address: manualAddress.trim()
    };
    
    onLocationDetected(userLocation);
    
    toast({
      title: "Location set",
      description: "Your manual location has been set successfully.",
    });
    
    setShowManualInput(false);
    setManualAddress("");
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={detectLocation}
        disabled={detecting || isLoading}
        className="location-btn flex items-center gap-2 text-lg w-full"
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
            DETECT MY LOCATION
          </>
        )}
      </Button>
      
      {!showManualInput ? (
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => setShowManualInput(true)}
          className="w-full"
        >
          <Edit className="h-4 w-4 mr-2" />
          Enter location manually
        </Button>
      ) : (
        <form onSubmit={handleManualSubmit} className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Enter your exact location or address"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              Set Location
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowManualInput(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      
      <p className="text-xs text-gray-500 text-center">
        We use your location only to find nearby hospitals.
      </p>
    </div>
  );
};

export default LocationButton;
