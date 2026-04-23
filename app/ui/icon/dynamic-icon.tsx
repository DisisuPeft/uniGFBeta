import { iconMap } from "./icon-map";

type IconProps = {
  iconName: string;
  size?: number;
  color?: string;
};

export function DynamicIcon({
  iconName,
  size = 24,
  color = "#000",
}: IconProps) {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) return <span></span>;

  return <IconComponent size={size} color={color} />;
}
