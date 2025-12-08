"use client";

export default function WindowButton({
  onClick,
  className = "",
  img,
}: {
  onClick?: () => void;
  className?: string;
  img: string;
}) {
  return (
    <button onClick={onClick} className={`w-6 h-6 bg-black border-white border-2 ${className}`}>
      <img src={img} alt="close button" className="h-[22px] w-[22px]" />
    </button>
  );
}
