import { Plus } from "lucide-react";

export default function PrimaryButton({
  children,
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold
        text-white bg-emerald-600 rounded-full shadow-md
        hover:bg-emerald-700 active:bg-emerald-800
        transition-colors duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
        focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900
        ${className}
      `}
      {...props}
    >
      <Plus className="w-5 h-5 stroke-[3]" />
      {children}
    </button>
  );
}
