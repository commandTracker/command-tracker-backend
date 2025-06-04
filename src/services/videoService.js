import ytdl from "@distube/ytdl-core";

const getYoutubeVideo = async (youtubeUrl) => {
  try {
    const videoStream = ytdl(youtubeUrl, { quality: "highest" });

    return videoStream;
  } catch (error) {
    throw error;
  }
};

export { getYoutubeVideo };
