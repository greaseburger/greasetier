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
        <div className="relative group">
          <Image src={item.imgUrl} alt="image" width={100} height={100} />
          <div className="absolute left-0 top-full mt-1 hidden w-fit p-0.5 bg-white text-black rounded shadow-lg group-hover:block">
            {item.name}
          </div>
          {/* <h1>{item.name}</h1> */}
        </div>
      </div>
    );
  }
);

TierCard.displayName = "TierCard";
