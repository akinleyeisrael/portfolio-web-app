"use client";
import { VideoPortfolio } from "@prisma/client";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import FsLightbox from "fslightbox-react";
import { Music4Icon, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MotionDiv } from "../../../../components/framer";


export const Lightbox = ({ videos }: { videos: VideoPortfolio[] }) => {

  const variants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const [lightboxController, setLightbxController] = useState({
    toggler: false,
    slide: 1,
  });

  function openLightboxOnSlide(num: number) {
    setLightbxController({
      toggler: !lightboxController.toggler,
      slide: num,
    });
  }

  const youtubevideos = videos.map((video) => `https://www.youtube.com/watch?v=${video.videoId}`) as string[];
  //append a url e.g www.yotube .com while mapping

  return (
    <MotionDiv
      className="flex flex-col min-h-screen bg-background max-w-[80rem] mx-auto"
      id="resume"
      initial="initial"
      animate="animate"
      variants={variants}
    >
      <div className="container mx-auto max-w-7xl py-10 min-h-screen">
        <h1 className="text-2xl font-thin leading-tight mb-10 ">
          <Music4Icon className="inline-flex mr-4" />
          Music Videos{" "}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 ">
          {videos.map((video, index) => (
            <div className="relative " key={video.videoId}>
              <Image
                width={2000}
                height={2000}
                sizes="100vw"
                src={video.thumbnail!}
                alt={`Video ${index + 1}`}
                className="moving-border w-full rounded-md aspect-video border object-cover"
              />
              <div
                className=" absolute inset-0 flex flex-col items-center justify-center group bg-background cursor-pointer opacity-0 hover:opacity-90 duration-300"
                onClick={() => openLightboxOnSlide(index + 1)}
              >
                <p className="text-primary text-lg font-thin">
                  <Play size={30} />
                </p>
                <p className="text-primary text-lg font-thin">{video.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FsLightbox
        exitFullscreenOnClose={true}
        toggler={lightboxController.toggler}
        sources={youtubevideos}
        slide={lightboxController.slide}
      />
    </MotionDiv>
  );
};

export default Lightbox;
