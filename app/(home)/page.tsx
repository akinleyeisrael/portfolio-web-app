import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/client";
import { ArrowRightIcon, GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import PortfolioSection from "@/components/PortfolioSection";
import { motion } from "framer-motion"
import dynamic from "next/dynamic";
import { MotionDiv } from "../../components/framer";
import { v2 as cloudinary } from "cloudinary";


// const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });

export default async function Home() {
  const experiences = await prisma.experience.findMany();
  const infos = await prisma.info.findMany()

  // enable pdf deleivery in the cloudinary settings
  const downloadResume = (resumeUrl: string) => {
    const url = cloudinary.url(resumeUrl, {
      flags: "attachment:resume",
      transformation: { filename: resumeUrl }
    })
    console.log(url)
    return url
  }

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

  return (
    <MotionDiv
      className="flex flex-col min-h-screen bg-background max-w-[80rem] mx-auto"
      id="resume"
      initial="initial"
      animate="animate"
      variants={variants}
    >
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-36">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="box text-3xl text-primary font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Akinola Akinleye
                </h1>
                {infos.map(description => (
                  <p key={description.id} className="mx-auto max-w-[700px] text-muted-foreground">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: description.description,
                      }}
                    />
                  </p>
                ))}

              </div>
              <div className="flex flex-row space-x-4 ">
                <Link href="github.com/akinleyeisreal">
                  <GitHubLogoIcon />
                </Link>
                <Link href="linkedln.com">
                  <LinkedInLogoIcon />
                </Link>
                <Link href="https://instagram.com/mrjustizzy">
                  <InstagramLogoIcon />
                </Link>
              </div>
              {infos.map(resume => (
                <Link key={resume.id} href={(downloadResume(resume.resume!))}  >
                  <Button className="-inset-1 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg  opacity-50 hover:opacity-100 transition duration-1000 group-hover:duration-200">
                    Download CV
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-[80rem] px-10 pt-10 md:pt-0" id="experience">
          {experiences.map((exp) => (
            <ol
              key={exp.id}
              className="relative border-s border-gray-200 dark:border-gray-700 px"
            >
              <li className="ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {exp.year.toLocaleString("default", { month: "long" })}{" "}
                  {exp.year.getFullYear()}
                </time>
                <Separator className="my-2 p-2 rounded" />
                <h3 className="text-lg text-right font-semibold text-gray-900 dark:text-white ">
                  {exp.jobtitle}
                </h3>
                <p className="text-base text-right font-normal text-gray-500 dark:text-gray-400">
                  {exp.company}
                </p>
              </li>
            </ol>
          ))}

          <Link
            className="group mb-2 inline-flex items-center rounded  text-center leading-tight text-primary"
            href="/"
          >
            View Full Resume Archive
            <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </section>
        <PortfolioSection />

      </main>
    </MotionDiv>
  );
}
