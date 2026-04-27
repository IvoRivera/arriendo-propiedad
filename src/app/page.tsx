import { ImageServiceServer } from "@/services/imageServiceServer";
import { HomeClient } from "./home-client";
import { getPropertyBaseConfig } from "@/lib/systemConfigServer";

export default async function Home() {
  const dynamicImages = await ImageServiceServer.getPublicImages();
  const property = await getPropertyBaseConfig();
  
  return <HomeClient dynamicImages={dynamicImages} property={property} />;
}
