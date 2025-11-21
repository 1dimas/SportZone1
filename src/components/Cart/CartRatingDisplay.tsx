import { FiStar } from "react-icons/fi";

type CartRatingDisplayProps = {
  rating: number;
  size?: "sm" | "md";
};

const CartRatingDisplay = ({ rating, size = "sm" }: CartRatingDisplayProps) => {
  const fontSize = size === "sm" ? "text-[11px]" : "text-sm";
  
  return (
    <div className={`flex items-center ${fontSize} text-gray-600`}>
      <FiStar className="text-yellow-400 mr-1 fill-yellow-400" size={size === "sm" ? 12 : 14} />
      <span>{rating > 0 ? rating.toFixed(1) : "Belum ada rating"}</span>
    </div>
  );
};

export default CartRatingDisplay;