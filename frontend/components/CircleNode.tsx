import { Handle, Position, NodeProps } from "@xyflow/react";
import { ChevronUp, ChevronRight } from "lucide-react";

export interface CircleNodeData extends Record<string, unknown> {
  label: string;
  isExpanded: boolean;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  glowColor?: string;
  children?: Array<{
    id: string;
    label: string;
    icon?: string;
    position?: { x: number; y: number };
    size?: 'small' | 'medium' | 'large';
    glowColor?: string;
    children?: Array<{ 
      id: string; 
      label: string;
      icon?: string;
      position?: { x: number; y: number };
      size?: 'small' | 'medium' | 'large';
      glowColor?: string;
    }>;
  }>;
}

export default function CircleNode({ data }: NodeProps) {
  const nodeData = data as CircleNodeData;
  const hasChildren = nodeData.children && nodeData.children.length > 0;
  
  const sizeClasses = {
    small: 'w-20 h-20 text-xs',
    medium: 'w-28 h-28 text-sm',
    large: 'w-36 h-36 text-base'
  };
  
  const size = nodeData.size || 'medium';
  const glowColor = nodeData.glowColor || '#06b6d4';

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-2 h-2 !bg-transparent border-0"
      />

      <div
        className={`
          flex items-center justify-center
          ${sizeClasses[size]} rounded-full
          bg-slate-900/95
          text-white font-semibold
          transition-all duration-300
          cursor-pointer
          border-2
          ${nodeData.isExpanded ? 'shadow-lg' : 'shadow-md'}
        `}
        style={{
          borderColor: glowColor,
          boxShadow: `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20, inset 0 0 20px ${glowColor}10`
        }}
      >
        <div className="text-center px-3 flex flex-col items-center gap-1">
          {nodeData.icon && (
            <div className="text-xs opacity-70 mb-1">{nodeData.icon}</div>
          )}
          <span className="break-words leading-tight">{nodeData.label}</span>
          {hasChildren && (
            <div className="text-white/60 mt-1">
              {nodeData.isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Top}
        className="w-2 h-2 !bg-transparent border-0"
      />
    </div>
  );
}
