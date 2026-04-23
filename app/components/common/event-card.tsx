interface EventCardProps {
  title: string;
  date: string;
  time: string;
  type?: "class" | "exam" | "meeting" | "deadline";
  description?: string;
}

export default function EventCard({
  title,
  date,
  time,
  //   type,
  description,
}: EventCardProps) {
  //   const typeColors = {
  //     class: "bg-blue-100 text-blue-700",
  //     exam: "bg-orange-100 text-orange-700",
  //     meeting: "bg-green-100 text-green-700",
  //     deadline: "bg-amber-100 text-amber-700",
  //   };

  //   const typeIcons = {
  //     class: "📖",
  //     exam: "📝",
  //     meeting: "👥",
  //     deadline: "⏰",
  //   };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* <div className={`${typeColors[type]} rounded-lg p-2 text-2xl`}> */}
        {/* {typeIcons[type]} */}
        {/* </div> */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 mb-2">
            {date} • {time}
          </p>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
