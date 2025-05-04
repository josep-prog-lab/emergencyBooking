
import { useState } from "react";
import { EmergencyType, Hospital, UserLocation } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, AlertTriangle } from "lucide-react";

interface EmergencyFormProps {
  selectedType: EmergencyType;
  selectedHospital: Hospital;
  userLocation: UserLocation;
  onSubmit: (description: string, manualAddress: string) => void;
  isSubmitting: boolean;
}

const EmergencyForm = ({
  selectedType,
  selectedHospital,
  userLocation,
  onSubmit,
  isSubmitting,
}: EmergencyFormProps) => {
  const [description, setDescription] = useState("");
  const [manualAddress, setManualAddress] = useState(userLocation.address || "");
  const [showManualAddress, setShowManualAddress] = useState(!userLocation.address);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(description, manualAddress);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Send Emergency Alert</h2>
        <p className="text-gray-600">
          Provide details about your emergency situation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hospital</label>
            <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="font-medium">{selectedHospital.name}</p>
              <p className="text-sm text-gray-600">{selectedHospital.address}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Emergency Type</label>
            <Select defaultValue={selectedType} disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EmergencyType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Emergency Description</label>
            <Textarea
              placeholder="Please provide details about your emergency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your Location</label>
              {!showManualAddress && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setShowManualAddress(true)}
                  className="text-secondary p-0 h-auto"
                >
                  Enter manually
                </Button>
              )}
            </div>
            
            {!showManualAddress ? (
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                <p className="text-sm">
                  {userLocation.address || `Lat: ${userLocation.lat.toFixed(6)}, Lng: ${userLocation.lng.toFixed(6)}`}
                </p>
              </div>
            ) : (
              <Input
                placeholder="Enter your exact location or address"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="emergency-btn flex items-center gap-2 w-full"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                SEND EMERGENCY ALERT
              </>
            )}
          </Button>
          
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-100">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <p className="text-xs">
              This will send your emergency information to {selectedHospital.name}. 
              Only use this service for genuine emergencies.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmergencyForm;
