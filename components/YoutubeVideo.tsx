"use client"
import React from "react";
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

interface Props {
    id: string,
    thumbnail: string,
    title: string
}
export const YoutubeVideo = ({ id, thumbnail, title }: Props) => (
    <div className=" ">
        <LiteYouTubeEmbed
            id={id}
            title={title}
            thumbnail={thumbnail}
            aspectHeight={50}
            aspectWidth={50}
            
        />
    </div>
);