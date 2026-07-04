import { iconMap } from "./icon-map";

type IconProps = {
  iconName: string;
  size?: number;
  className?: string;
  color?: string;
};

export function DynamicIcon({
  iconName,
  size = 64,
  className = "",
  color = "#1c2634",
}: IconProps) {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) return <span />;

  return (
    <div className={`relative flex items-center justify-center w-[110px] h-[110px] rounded-[32px] bg-gradient-to-br from-white/80 to-white/30 border border-white/60 shadow-[0_4px_16px_rgba(28,38,52,0.05)] backdrop-blur-md group-hover:scale-110 transition-transform duration-500 ${className}`}>
      <IconComponent size={size} color={color} strokeWidth={1.0} />
    </div>
  );
}

