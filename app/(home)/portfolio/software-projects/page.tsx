import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopRightIcon,
  GitHubLogoIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { MotionDiv } from "../../../../components/framer";

const SoftwareProjects = async () => {

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

  const softwarePortfolios = await prisma.porfolio.findMany({
    orderBy: {
      year: "desc"
    },
    include: {
      webTechs: true
    }
  });
  return (
    <MotionDiv
      className="flex flex-col min-h-screen bg-background max-w-[80rem] mx-auto"
      id="resume"
      initial="initial"
      animate="animate"
      variants={variants}
    >
      <div className="mx-auto items-center max-w-5xl min-h-screen px-6 py-10 sm:px-0 sm:py-10 ">
        <Link
          className="group mb-2 inline-flex items-center font-semibold text-lg leading-tight text-primary"
          href="/"
        >
          <ArrowRightIcon className="mr-1 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-2" />
          Akin
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-10">
          All Projects
        </h1>
        <Table className="text-base">
          <TableCaption>List of projects.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Year</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="hidden sm:table-cell">Built with</TableHead>
              <TableHead className="hidden sm:table-cell">
                Project description
              </TableHead>
              <TableHead className="hidden sm:table-cell">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {softwarePortfolios.map((portfolio) => (
              <TableRow key={portfolio.id}>
                <TableCell height={80} id={portfolio.title!}>{portfolio.year}</TableCell>
                {/* conditional render for one cell */}
                <TableCell className="font-semibold table-cell sm:hidden">
                  <Link
                    href={portfolio.link ? portfolio.link : ""}
                    title={portfolio.link!}
                  >
                    <p className="group mb-2 inline-flex items-center leading-tight">
                      {portfolio.title}
                      <ArrowTopRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </p>
                  </Link>
                </TableCell>
                <TableCell className="font-semibold hidden sm:table-cell">
                  {portfolio.title}
                </TableCell>
                {/* conditional render for cell */}
                <TableCell>
                  {portfolio.webTechs
                    .map((tech) => (
                      <div
                        key={tech.id}
                        className="inline-flex items-center rounded-full bg-muted-foreground m-1 px-3 py-1 text-xs font-medium leading-5 text-primary-foreground "
                      >
                        {tech.framework}
                      </div>
                    ))}

                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Sheet>
                    <SheetTrigger className="group mb-2 inline-flex items-center leading-tight">
                      Open
                      <ReaderIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </SheetTrigger>
                    <SheetContent side={"bottom"}>
                      <SheetHeader>
                        <SheetTitle>About the project</SheetTitle>
                        <SheetDescription className="overflow-y-auto max-h-[35rem]">
                          {/* max-h-80 sets the maximum height */}
                          <div className="flex flex-col items-center justify-center py-10">
                            <div className="mb-8">
                              <Image
                                sizes="100vw"
                                width={1000}
                                height={1000}
                                src={portfolio.media} // Replace with your image URL
                                alt="image"
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="rounded-lg p-4">
                              <h2 className="text-xl font-medium mb-2">
                                Description
                              </h2>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: portfolio.description,
                                }}
                              />
                            </div>
                          </div>
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Link
                    href={portfolio.link ? portfolio.link : ""}
                    title={portfolio.link!}
                  >
                    {portfolio.link?.includes("github") ? (
                      <p className="group mb-2 items-center inline-flex transition-transform ease-in-out transform hover:scale-105">
                        GitHub <GitHubLogoIcon className="ml-1 h-4 w-4" />
                      </p>
                    ) : (
                      <p className="group mb-2 inline-flex items-center leading-tight">
                        {" "}
                        {portfolio.link}{" "}
                        <ArrowTopRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </p>
                    )}{" "}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MotionDiv>
  );
};

export default SoftwareProjects;
