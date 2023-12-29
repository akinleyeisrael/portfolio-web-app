import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/client";
import { Porfolio, VideoPortfolio, WebTech } from "@prisma/client";
import {
  DeletePortfolioButton,
  DeleteVideoButton,
  DeleteWebTechButton,
  EditPortfolioForm,
  EditVideoForm,
  EditWebTechForm,
  PorfolioForm,
  VideoForm,
  WebTechForm,
} from "./Form";
import { v2 as cloudinary } from "cloudinary";
import CldImage from "../../../../components/CldImage";
import { YoutubeVideo } from "../../../../components/YoutubeVideo";

interface Props {
  porfolio: Porfolio;
  videoPortfolio: VideoPortfolio;
  webTech: WebTech;
}

const adminPortfolio = async ({ porfolio, videoPortfolio, webTech }: Props) => {
  const porfolios = await prisma.porfolio.findMany({
    include: {
      webTechs: true,
    },
  });
  const videos = await prisma.videoPortfolio.findMany();
  const webTechs = await prisma.webTech.findMany();
  // const { resources: medias } = await cloudinary.api.resources_by_tag("media", { context: true })

  return (
    <section className="max-w-7xl px-10 mx-auto pt-20 md:ml-[17rem] space-y-5">
      <div className=" flex items-center space-x-2 mb-2 shadow-md rounded-lg bg-primary p-4">
        <h1 className="font-bold pl-5 text-primary-foreground">
          WebTechnology Form
        </h1>
      </div>
      <WebTechForm webTech={webTech} />
      <Table className="w-[500px]">
        <TableCaption>A list of your framework for portfolios.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Framework</TableHead>
            <TableHead colSpan={2} className="text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <div className="grid grid-cols-4 gap-4 w-[60rem]">
            {webTechs.map((framework) => (
              <TableRow key={framework.id}>
                <TableCell>{framework.framework}</TableCell>
                <TableCell>
                  <EditWebTechForm webTech={framework} />
                </TableCell>
                <TableCell>
                  <DeleteWebTechButton id={framework.id} />
                </TableCell>
              </TableRow>
            ))}
          </div>
        </TableBody>
      </Table>

      <div className=" flex items-center space-x-2 mb-2 shadow-md rounded-lg bg-primary p-4">
        <h1 className="font-bold pl-5 text-primary-foreground">
          Portfolio Form
        </h1>
      </div>
      <PorfolioForm porfolio={porfolio} />
      <Table>
        <TableCaption>A list of your recent portfolios.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Media</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Built With</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {porfolios.map((porfolio) => (
            <TableRow key={porfolio.id}>
              {porfolio.public_id && (
                <TableCell className="font-medium">
                  <CldImage
                    className="aspect-video"
                    width={200}
                    height={200}
                    src={porfolio.public_id}
                    alt={"image"}
                  />
                </TableCell>
              )}
              {/* <TableCell className="font-medium">{porfolio.media}</TableCell> */}
              <TableCell>{porfolio.title}</TableCell>
              <TableCell>
                {porfolio.webTechs.map((tech) => (
                  <div
                    key={tech.id}
                    className="flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium leading-5 text-primary-foreground "
                  >
                    {tech.framework}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                {porfolio.description.length > 20
                  ? `${porfolio.description.substring(0, 30)}...`
                  : porfolio.description}
              </TableCell>
              <TableCell>{porfolio.year}</TableCell>
              <TableCell>{porfolio.link}</TableCell>
              <TableCell className="font-medium">
                <EditPortfolioForm porfolio={porfolio} />
              </TableCell>
              <TableCell className="font-medium">
                <DeletePortfolioButton id={porfolio.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className=" flex items-center space-x-2 mb-2 shadow-md rounded-lg bg-primary p-4">
        <h1 className="font-bold pl-5 text-primary-foreground">Video Form</h1>
      </div>
      <VideoForm video={videoPortfolio} />
      <Table>
        <TableCaption>A list of your recent portfolios.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead className="w-[100px]">Video(id)</TableHead>
            <TableHead className="">Title</TableHead>
            <TableHead colSpan={2}>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              {video.public_id && (
                <TableCell className="font-medium">
                  <CldImage
                    className="aspect-video"
                    width={200}
                    height={200}
                    src={video.public_id}
                    alt={"image"}
                  />
                </TableCell>
              )}
              {/* <TableCell className="font-medium">{video.url}</TableCell> */}
              <TableCell draggable title="video">
                <YoutubeVideo
                  id={video.videoId!}
                  thumbnail={video.thumbnail!}
                  title={video.title}
                />
              </TableCell>
              {/* <TableCell className="font-medium">{video.videoId}</TableCell> */}
              <TableCell>{video.title}</TableCell>
              <TableCell>
                <EditVideoForm video={video} />
              </TableCell>
              <TableCell>
                <DeleteVideoButton id={video.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default adminPortfolio;
