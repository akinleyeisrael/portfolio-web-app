import prisma from '@/lib/client'
import { Music4Icon, Play } from 'lucide-react'
import Image from 'next/image'
import Lightbox from './Lightbox'

const MusicVideos = async () => {
    const videos = await prisma.videoPortfolio.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    })

    

    return (
        <div>
            <Lightbox videos={videos} />
        </div>
    )
}

export default MusicVideos