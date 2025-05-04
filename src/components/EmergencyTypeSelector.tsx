
import { EmergencyType } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Bell, Phone } from "lucide-react";

interface EmergencyTypeSelectorProps {
  selectedType: EmergencyType | null;
  onSelectType: (type: EmergencyType) => void;
}

const EmergencyTypeSelector = ({
  selectedType,
  onSelectType,
}: EmergencyTypeSelectorProps) => {
  
  // Array of emergency types with their associated information
  const emergencyOptions = [
    {
      type: EmergencyType.ACCIDENT,
      title: "Accident",
      description: "Traffic accidents, falls, injuries",
      icon: <AlertTriangle className="h-10 w-10 text-emergency-accident" />,
      bgColorClass: "bg-red-50",
      borderColorClass: "border-emergency-accident",
      priority: "First Priority",
    },
    {
      type: EmergencyType.PREGNANCY,
      title: "Pregnancy",
      description: "Labor, pregnancy complications",
      icon: <Bell className="h-10 w-10 text-emergency-pregnancy" />,
      bgColorClass: "bg-purple-50",
      borderColorClass: "border-emergency-pregnancy",
      priority: "Second Priority",
    },
    {
      type: EmergencyType.OTHER,
      title: "Other Emergency",
      description: "Heart attack, severe pain, etc.",
      icon: <Phone className="h-10 w-10 text-emergency-other" />,
      bgColorClass: "bg-blue-50",
      borderColorClass: "border-emergency-other",
      priority: "Third Priority",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Emergency Type</h2>
        <p className="text-gray-600">Choose the type of emergency you're experiencing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {emergencyOptions.map((option) => (
          <Card
            key={option.type}
            className={`
              cursor-pointer transition-all duration-200 overflow-hidden
              ${option.bgColorClass}
              ${selectedType === option.type ? 'ring-2 ring-primary ring-offset-2' : ''}
            `}
            onClick={() => onSelectType(option.type)}
          >
            <div className={`h-2 ${option.borderColorClass} bg-${option.borderColorClass}`}></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-full bg-white shadow-sm">
                  {option.icon}
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-white rounded-full shadow-sm">
                  {option.priority}
                </span>
              </div>
              <h3 className="font-bold text-xl mb-2">{option.title}</h3>
              <p className="text-gray-600 text-sm">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmergencyTypeSelector;
