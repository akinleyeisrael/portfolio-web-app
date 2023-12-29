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
import { Experience, Info } from "@prisma/client";
import {
  DeleteExperienceButton,
  DeleteInfoButton,
  EditExperienceForm,
  EditInfoForm,
  ExperienceForm,
  InfoForm,
} from "./Forms";
import { v2 as cloudinary } from "cloudinary";
import CldImage from "../../../../components/CldImage";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface FormProps {
  info: Info;
  exp: Experience;
}

export default async function adminAbout({ info, exp }: FormProps) {
  const infos = await prisma.info.findMany();
  const experiences = await prisma.experience.findMany();


  return (
    <section>
      <div className="max-w-7xl px-10 mx-auto space-y-5 md:ml-[17rem] pt-20 min-h-screen">
        <div className=" flex items-center space-x-2 mb-2 shadow-md rounded-lg bg-primary p-4">
          <h1 className="font-bold pl-5 text-primary-foreground">
            Description Form
          </h1>
        </div>
        <InfoForm info={info} />
        <Table>
          <TableCaption>Description Form</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Resume</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {infos.map((info) => (
              <TableRow key={info.id}>
                {info.public_id && (
                  <TableCell className="font-medium">
                    <CldImage
                      className="aspect-video"
                      width={100}
                      height={100}
                      src={info.public_id}
                      alt={"pdf"}
                    />
                  </TableCell>
                )}
                {/* <TableCell className="font-medium">{info.resume}</TableCell> */}
                <TableCell className="font-medium">
                  {info.description.length > 50
                    ? `${info.description.substring(0, 50)}...`
                    : info.description}
                </TableCell>
                <TableCell className="font-medium">
                  <EditInfoForm info={info} />
                </TableCell>
                <TableCell className="font-medium">
                  <DeleteInfoButton id={info.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* EXPERIENCE TABLE */}
        <div className=" flex items-center shadow-md rounded-lg bg-primary p-4 ">
          <h1 className="font-bold pl-5 text-primary-foreground">
            Experience Form
          </h1>
        </div>
        <ExperienceForm exp={exp} />
        <Table>
          <TableCaption>Experience Form</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell className="font-medium">
                  {experience.jobtitle}
                </TableCell>
                <TableCell>{experience.company}</TableCell>
                <TableCell>
                  {experience.year.toLocaleString("default", { month: "long" })}{" "}
                  {experience.year.getFullYear()}
                </TableCell>
                <TableCell className="text-right">
                  <EditExperienceForm exp={experience} />
                </TableCell>
                <TableCell className="text-right">
                  <DeleteExperienceButton id={experience.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
