import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmergencyType, UserLocation, Hospital, EmergencyRequest } from "@/types/types";
import EmergencyTypeSelector from "@/components/EmergencyTypeSelector";
import LocationButton from "@/components/LocationButton";
import HospitalList from "@/components/HospitalList";
import EmergencyForm from "@/components/EmergencyForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { fetchNearbyHospitals } from "@/utils/hospitalData";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Main state variables
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [emergencyType, setEmergencyType] = useState<EmergencyType | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[] | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handler for emergency type selection
  const handleSelectEmergencyType = (type: EmergencyType) => {
    setEmergencyType(type);
  };
  
  // Handler for location detection
  const handleLocationDetected = (location: UserLocation) => {
    setUserLocation(location);
    setIsLoadingHospitals(true);
    
    // If location has valid coordinates, use them to fetch nearby hospitals
    // Otherwise, fetch a default list (this would happen with manual address input)
    if (location.lat !== 0 || location.lng !== 0) {
      // Fetch nearby hospitals based on location
      fetchNearbyHospitals(location.lat, location.lng)
        .then((hospitals) => {
          setHospitals(hospitals);
          setIsLoadingHospitals(false);
        })
        .catch((error) => {
          console.error("Error fetching hospitals:", error);
          toast({
            title: "Error",
            description: "Failed to fetch nearby hospitals. Please try again.",
            variant: "destructive",
          });
          setIsLoadingHospitals(false);
        });
    } else {
      // For manual address without coordinates, just fetch all hospitals
      fetchNearbyHospitals(37.7749, -122.4194) // default coordinates for fetching
        .then((hospitals) => {
          setHospitals(hospitals);
          setIsLoadingHospitals(false);
        })
        .catch((error) => {
          console.error("Error fetching hospitals:", error);
          toast({
            title: "Error",
            description: "Failed to fetch nearby hospitals. Please try again.",
            variant: "destructive",
          });
          setIsLoadingHospitals(false);
        });
    }
  };
  
  // Handler for hospital selection
  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };
  
  // Handle continue to next step
  const handleContinue = () => {
    if (step === 1) {
      if (!emergencyType) {
        toast({
          title: "Selection Required",
          description: "Please select an emergency type to continue.",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedHospital) {
        toast({
          title: "Selection Required",
          description: "Please select a hospital to continue.",
          variant: "destructive",
        });
        return;
      }
      setStep(3);
    }
  };
  
  // Handle go back
  const handleGoBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };
  
  // Handle submit emergency alert
  const handleSubmitEmergency = (description: string, manualAddress: string) => {
    if (!emergencyType || !userLocation || !selectedHospital) return;
    
    setIsSubmitting(true);
    
    // Create emergency request
    const emergencyRequest: EmergencyRequest = {
      type: emergencyType,
      description: description,
      userLocation: {
        ...userLocation,
        address: manualAddress || userLocation.address,
      },
      selectedHospital: selectedHospital,
      timestamp: new Date(),
    };
    
    // Simulate sending emergency request
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Navigate to emergency chat page
      navigate("/emergency-chat", { state: { emergencyRequest } });
    }, 2000);
  };
  
  // Determine if we can continue to the next step
  const canContinue = (currentStep: number) => {
    if (currentStep === 1) {
      return !!emergencyType;
    }
    if (currentStep === 2) {
      return !!selectedHospital;
    }
    return false;
  };

  return (
    <div className="container max-w-4xl px-4 py-8">
      {/* Header */}
      <header className="text-center mb-10">
        <div className="inline-block p-4 bg-red-50 rounded-full mb-4">
          <AlertTriangle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Emergency Hospital Quick-Connect
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Fast emergency response system that connects you with nearby hospitals in critical situations.
          No registration required.
        </p>
      </header>
      
      {/* Emergency Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
        <div>
          <p className="font-medium text-amber-800">For Genuine Emergencies Only</p>
          <p className="text-sm text-amber-700">
            This service is designed exclusively for real emergency situations. Misuse may impact
            response times for other critical cases.
          </p>
        </div>
      </div>
      
      {/* Steps Indicator */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`rounded-full h-10 w-10 flex items-center justify-center font-medium ${
                step === i
                  ? "bg-primary text-white"
                  : step > i
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {i}
            </div>
            <span className="text-xs mt-2">
              {i === 1 ? "Type" : i === 2 ? "Location" : "Send"}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content - Step 1: Emergency Type Selection */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <EmergencyTypeSelector 
            selectedType={emergencyType} 
            onSelectType={handleSelectEmergencyType} 
          />
        </div>
      )}

      {/* Main Content - Step 2: Location and Hospital Selection */}
      {step === 2 && (
        <div className="space-y-6">
          {!userLocation && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-6">Share Your Location</h2>
              <p className="text-gray-600 mb-8">
                We need your location to find nearby hospitals. You can use automatic detection or enter your address manually.
              </p>
              <div className="max-w-md mx-auto">
                <LocationButton onLocationDetected={handleLocationDetected} />
              </div>
            </div>
          )}

          {userLocation && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                <p className="font-medium">Your location</p>
                <p className="text-sm text-gray-600">{userLocation.address || `Coordinates: ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`}</p>
                <Button
                  variant="link"
                  onClick={() => setUserLocation(null)}
                  className="p-0 h-auto text-sm"
                >
                  Change location
                </Button>
              </div>
              
              <HospitalList
                hospitals={hospitals}
                isLoading={isLoadingHospitals}
                onSelectHospital={handleSelectHospital}
                selectedHospitalId={selectedHospital?.id || null}
              />
            </div>
          )}
        </div>
      )}

      {/* Main Content - Step 3: Emergency Form */}
      {step === 3 && emergencyType && userLocation && selectedHospital && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <EmergencyForm
            selectedType={emergencyType}
            selectedHospital={selectedHospital}
            userLocation={userLocation}
            onSubmit={handleSubmitEmergency}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <Button variant="outline" onClick={handleGoBack} disabled={isSubmitting}>
            Back
          </Button>
        )}

        {step < 3 && (
          <Button 
            className="ml-auto flex items-center gap-2"
            onClick={handleContinue} 
            disabled={!canContinue(step)}
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;
