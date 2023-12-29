import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/client";
import Link from "next/link";

import CldImage from "../../../components/CldImage";
import Videos from "@/components/Videos";
import { YoutubeVideo } from "../../../components/YoutubeVideo";
import { Edit } from "lucide-react";
import {
  DashboardIcon,
  FaceIcon,
  Pencil1Icon,
  Pencil2Icon,
  ReaderIcon,
} from "@radix-ui/react-icons";

const admin = async () => {
  const infos = await prisma.info.findMany();
  const experiences = await prisma.experience.findMany();
  const porfolios = await prisma.porfolio.findMany();
  const videos = await prisma.videoPortfolio.findMany();

  return (
    <section className="items-center justify-center pt-20 mx-auto max-w-7xl px-10 md:ml-[17rem]">
      <div className=" flex items-center text-primary-foreground bg-primary space-x-2 mb-2 shadow-2xl rounded-md space-y-5">
        <h1 className="font-bold pl-5 inline-flex items-center m-4">
          About - Description Section
          <Link href={"/admin/about#desc"}>
            <Pencil2Icon className="ml-2" />
          </Link>
        </h1>
        {/* <p className="mb-20 inline-flex">

        </p> */}
      </div>
      {/* <Separator className="mb-2 max-w-[14rem]"/> */}
      <div className="grid max-w-full pb-[1rem]">
        {infos.map((info) => (
          <Card className="shadow-md h-52" key={info.id}>
            <CardHeader>
              <CardTitle>
                <ReaderIcon />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 flex  justify-around text-xs">
                <div className="space-y-2">
                  <h1>Resume</h1>
                  <Separator />
                  {info.public_id && (
                    <p className="font-medium">
                      <CldImage
                        className="aspect-video"
                        width={50}
                        height={50}
                        src={info.public_id}
                        alt={"resume"}
                      />
                    </p>
                  )}
                  {/* <p>{info.resume}</p> */}
                </div>
                <div className="space-y-2">
                  <h1>Description</h1>
                  <Separator />
                  <p className="text-right">{info.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center text-primary-foreground space-x-2 mb-2 shadow-md mt-5 rounded-md bg-primary space-y-5 ">
        <h1 className="font-bold pl-5 inline-flex items-center m-4">
          About - Experience Section
          <Link href={"/admin/about#exp"}>
            <Pencil2Icon className="ml-2" />
          </Link>
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pb-2">
        {experiences.map((exp) => (
          <Card className="shadow-md h-52" key={exp.id}>
            <CardHeader>
              <CardTitle>
                <DashboardIcon />
              </CardTitle>
              {/* <CardDescription>Job Experience</CardDescription> */}
            </CardHeader>
            <CardContent className="p-3 flex justify-around text-xs">
              <div className="space-y-2">
                <h2>Job Title</h2>
                <Separator />
                <p className="text-xs">{exp.jobtitle}</p>
              </div>
              <div className="space-y-2">
                <h2>Company</h2>
                {/* <LucideUmbrella/> */}
                <Separator />
                <p className="text-xs">{exp.company}</p>
              </div>
              <div className="space-y-2">
                <h2>Year</h2>
                <Separator />
                {exp.year.toLocaleString("default", { month: "long" })}{" "}
                {exp.year.getFullYear()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center text-primary-foreground space-x-2 mb-2 shadow-md mt-5 rounded-md bg-primary space-y-5 ">
        <h1 className="font-bold pl-5 inline-flex items-center m-4">
          Portfolio Section
          <Link href={"/admin/portfolio#port"}>
            <Pencil2Icon className="ml-2" />
          </Link>
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {porfolios.map((portfolio) => (
          <Card className="shadow-md h-52" key={portfolio.id}>
            <CardHeader>
              <CardTitle>
                <FaceIcon />
              </CardTitle>
            </CardHeader>
            <CardContent className="whitespace-nowrap overflow-hidden">
              <div className="p-3 flex justify-around text-xs">
                <div className="space-y-2">
                  <h1>Media</h1>
                  <Separator />
                  {portfolio.public_id && (
                    <p className="font-medium">
                      <CldImage
                        className="aspect-video"
                        width={100}
                        height={100}
                        src={portfolio.public_id}
                        alt={"media"}
                      />
                    </p>
                  )}
                  {/* <p>{portfolio.media}</p> */}
                </div>
                <div className="space-y-2">
                  <h1>Description</h1>
                  <Separator />
                  <p>
                    {portfolio.description.length > 20
                      ? `${portfolio.description.substring(0, 20)}...`
                      : portfolio.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <h1>Year</h1>
                  <Separator />
                  <p>{portfolio.year}</p>
                </div>
                <div className="space-y-2">
                  <h1>Link</h1>
                  <Separator />
                  <p>{portfolio.link}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center text-primary-foreground space-x-2 mb-2 shadow-md mt-5 rounded-md bg-primary space-y-5 ">
        <h1 className="font-bold pl-5 inline-flex items-center m-4">
          Video Section
          <Link href={"/admin/portfolio#vid"}>
            <Pencil2Icon className="ml-2" />
          </Link>
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {videos.map((video) => (
          <Card className="shadow-md h-52" key={video.id}>
            <CardHeader>
              <CardTitle>
                <FaceIcon />
              </CardTitle>
            </CardHeader>
            <CardContent className="whitespace-nowrap overflow-hidden">
              <div className="p-3 flex justify-around text-xs">
                <div className="space-y-2">
                  <h1>Thumbnail</h1>
                  <Separator />
                  <CldImage
                    className="aspect-video"
                    width={100}
                    height={100}
                    alt={"thumbnail"}
                    src={video.public_id!}
                  />
                  {/* <p>{video.thumbnaii}</p> */}
                </div>
                <div className="space-y-2  w-20 aspect-video">
                  <h1>Video</h1>
                  <Separator />
                  <YoutubeVideo
                    id={video.videoId!}
                    thumbnail={video.thumbnail!}
                    title={video.title}
                  />
                  {/* <p>{video.videoId}</p> */}
                </div>
                <div className="space-y-2">
                  <h1>Title</h1>
                  <Separator />
                  <p>{video.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default admin;
