"use client";

import Image from "next/image";
import { Review } from "@/lib/types";

interface CarouselProps {
  reviews: Review[];
}

export function Carousel({ reviews }: CarouselProps) {
  const slides = reviews.length ? [...reviews, ...reviews] : [];

  return (
    <div className="overflow-hidden rounded-[28px] bg-foam p-4">
      <div className="flex w-max animate-marquee gap-4">
        {slides.map((review, index) => (
          <div
            key={`${review.id}-${index}`}
            className="relative h-56 w-80 shrink-0 overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-soft"
          >
            <Image src={review.image_url} alt="Customer review" fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
