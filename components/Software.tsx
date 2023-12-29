
import CldImage from "@/components/CldImage";
import { fetchSoftwareComponent } from "@/lib/actions";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

interface image {
    id: number,
    public_id: string,
    media: string,
    title: string,
    description: string,
}

const Software = () => {
    const [imgs, setImgs] = useState<any[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const imgss = await fetchSoftwareComponent();
                setImgs(imgss);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []); // Empty dependency array to execute the effect only once on mount

    const firstEightImages = imgs.slice(0, 8);

    return (
        <div className=" mx-auto">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 ">
                {firstEightImages.map((img: image, index) => (
                    <div className="flex justify-center items-center" key={img.public_id}>
                        <div className="relative ">
                            <Link href={`/portfolio/software-projects#${img.title}`}>
                                <h1 className="absolute inset-0 z-10 font-thin text-center text-lg flex flex-col items-center justify-center bg-background opacity-0 hover:opacity-90 duration-300">
                                    <p className="tracking-wider leading-tight">{img.title}</p>
                                </h1>
                                <Image className="block aspect-square object-cover overflow-hidden rounded border"
                                    width={1000}
                                    height={1000}
                                    src={img.media}
                                    alt={`image ${index + 1}`}
                                />
                            </Link>
                        </div>

                    </div>
                ))}
            </div>
            <Link
                className="group mb-2  mt-6  inline-flex items-center rounded  text-center leading-tight text-primary"
                href={"/portfolio/software-projects"}
            >
                View Full Project Archive
                <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
        </div>
    );
};

export default Software;
