import { ImageService } from "@/services/image-service";
import { HomeClient } from "./home-client";

export default async function Home() {
  const dynamicImages = await ImageService.getPublicImages();
  
  return <HomeClient dynamicImages={dynamicImages} />;
}
