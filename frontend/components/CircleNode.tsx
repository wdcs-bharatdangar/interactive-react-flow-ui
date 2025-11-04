import { Handle, Position, NodeProps } from "@xyflow/react";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface CircleNodeData extends Record<string, unknown> {
  label: string;
  isExpanded: boolean;
  children?: Array<{
    id: string;
    label: string;
    children?: Array<{ id: string; label: string }>;
  }>;
}

export default function CircleNode({ data }: NodeProps) {
  const nodeData = data as CircleNodeData;
  const hasChildren = nodeData.children && nodeData.children.length > 0;

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-primary"
      />

      <div
        className={`
          flex items-center justify-center
          w-32 h-32 rounded-full
          bg-gradient-to-br from-primary/90 to-primary
          text-primary-foreground font-semibold text-sm
          shadow-lg hover:shadow-xl
          transition-all duration-300
          cursor-pointer
          border-4 border-background
          ${nodeData.isExpanded ? "ring-4 ring-primary/30" : ""}
        `}
      >
        <div className="text-center px-4 flex flex-col items-center gap-1">
          <span className="break-words">{nodeData.label}</span>
          {hasChildren && (
            <div className="text-primary-foreground/80">
              {nodeData.isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-primary"
      />
    </div>
  );
}
