import {cx} from "class-variance-authority";

import {PropsWithClassName} from "@shared/lib/types";

interface AvatarProps extends PropsWithClassName {
  src: string;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = ({src, alt, className}) => (
  <div className={cx("w-12 h-12 rounded-full overflow-hidden", className)}>
    <img className="w-[100%] h-full" src={src} alt={alt} />
  </div>
);
