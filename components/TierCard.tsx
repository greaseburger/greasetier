import React, { forwardRef } from "react";
import { TierItem } from "@/lib/types";
import Image from "next/image";

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: TierItem;
  className: string;
}

export const TierCard = forwardRef<HTMLDivElement, ItemProps>(
  ({ item, ...props }, ref) => {
    return (
      <div {...props} id={item.id} ref={ref}>
        <div className="group relative">
          <Image
            src={item.imgUrl}
            alt="image"
            width={100}
            height={100}
            className="h-28 w-20 rounded-sm object-cover"
          />
          <div className="absolute top-full left-0 z-50 mt-1 hidden w-fit rounded bg-white p-0.5 text-black shadow-lg transition-opacity duration-200 group-hover:block">
            {item.name}
          </div>
        </div>
      </div>
    );
  },
);

TierCard.displayName = "TierCard";
