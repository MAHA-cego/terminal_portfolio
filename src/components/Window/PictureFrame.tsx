import imgTemp from "@/public/media/images/Noodles.png";
import xCross from "@/public/media/icons/cross.png";

export default function PictureFrame() {
  return (
    <div>
      <h1>imgname.png</h1>
      <button>
        <img src={xCross.src} alt="" />
      </button>
      <img src={imgTemp.src} alt="" />
    </div>
  );
}
