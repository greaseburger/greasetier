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
        <Image src={item.imgUrl} alt="image" width={100} height={100} />
        {/* <h1>{item.name}</h1> */}
      </div>
    );
  }
);

TierCard.displayName = "TierCard";
