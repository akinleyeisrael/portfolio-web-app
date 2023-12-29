import { YoutubeVideo } from "@/components/YoutubeVideo";
import CldImage from "@/components/CldImage";
import { fetchSoftwareComponent, fetchVideoComponent } from "@/lib/actions";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Play } from "lucide-react";
import FsLightbox from "fslightbox-react";

interface Vid {
    videoId: string;
    thumbnail: string;
    title: string;
}
const Videos = () => {
    const [vids, setVids] = useState<any[]>([]);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vidss = await fetchVideoComponent();
                setVids(vidss);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []); // Empty dependency array to execute the effect only once on mount

    const firstTwoVideos = vids.slice(0, 6);
    const youtubevideos = firstTwoVideos.map(
        (video) => `https://www.youtube.com/watch?v=${video.videoId}`
    ) as string[];

    return (
        <div className="mx-auto">
            <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-3">
                {firstTwoVideos.map((video: Vid, index) => (
                    <div className="relative " key={video.videoId}>
                        <Image
                            width={1000}
                            height={1000}
                            sizes="100vw"
                            src={video.thumbnail!}
                            alt={`Video ${index + 1}`}
                            className="w-full rounded-md aspect-video border object-cover"
                        />
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center group bg-background cursor-pointer opacity-0 hover:opacity-90 duration-300"
                            onClick={() => openLightboxOnSlide(index + 1)}
                        >
                            <p className="text-primary text-lg font-thin">
                                <Play size={30} />
                            </p>
                            <p className="text-primary text-lg font-thin">{video.title}</p>
                        </div>
                    </div>
                    // <YoutubeVideo key={vid.videoId} id={vid.videoId} thumbnail={vid.thumbnail} title={vid.title} />
                ))}
            </div>
            <Link
                className="group mb-2 mt-6 inline-flex items-center rounded  text-center leading-tight text-primary"
                href="/portfolio/music-videos"
            >
                View Full Video Archive
                <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>

            <FsLightbox
                exitFullscreenOnClose={true}
                toggler={lightboxController.toggler}
                sources={youtubevideos}
                slide={lightboxController.slide}
            />
        </div>
    );
};

export default Videos;
