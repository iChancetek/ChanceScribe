import { 
  Rocket, 
  Cpu, 
  Microscope, 
  Satellite, 
  Telescope, 
  Zap, 
  Sparkles, 
  Brain, 
  Radio, 
  Globe2, 
  Radar, 
  Activity, 
  Anchor, 
  Atom, 
  Briefcase, 
  Compass, 
  Flame,
  Lightbulb,
  Mic2,
  Wifi,
  Layers
} from "lucide-react";
import { LucideProps } from "lucide-react";

// Provide a diverse list of icons
const ICONS = [
  Rocket, Cpu, Microscope, Satellite, Telescope, Zap, Sparkles, Brain, Radio, Globe2, 
  Radar, Activity, Anchor, Atom, Briefcase, Compass, Flame, Lightbulb, 
  Mic2, Wifi, Layers
];

interface WorkspaceIconProps extends LucideProps {
  workspaceId: string;
}

export function WorkspaceIcon({ workspaceId, ...props }: WorkspaceIconProps) {
  // Deterministically select an icon based on the string value of workspaceId
  const hash = workspaceId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Ensure positive index
  const index = Math.abs(hash) % ICONS.length;
  const SelectedIcon = ICONS[index];

  return <SelectedIcon {...props} />;
}
