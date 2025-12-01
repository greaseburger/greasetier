import React, { forwardRef } from "react";
import { Tiers, Tier, TierItem } from "@/lib/types";
import Image from "next/image";

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: TierItem;
  className: string;
}

export const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ item, ...props }, ref) => {
    return (
      <div {...props} id={item.id} ref={ref}>
        <h1>{item.name}</h1>
        {/* <Image src={item.imgUrl} alt="image" width={100} height={100} /> */}
      </div>
    );
  }
);

Item.displayName = "Item";
