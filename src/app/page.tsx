import { ImageService } from "@/services/image-service";
import { HomeClient } from "./home-client";
import { getPropertyBaseConfig } from "@/lib/systemConfigServer";

export default async function Home() {
  const dynamicImages = await ImageService.getPublicImages();
  const property = await getPropertyBaseConfig();
  
  return <HomeClient dynamicImages={dynamicImages} property={property} />;
}
