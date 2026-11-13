"use client";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the world of annonymous conversation
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore Mystery message - Where your identity remains a secret
          </p>
        </section>

        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-40 sm:max-w-xxs"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <footer className="text-center p-4 md:p-6">
          @ 2023 Mystery message. All rights reserved
        </footer>
      </main>
    </>
  );
}

export default Home;
