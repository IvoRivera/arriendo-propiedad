import { ImageServiceServer } from "@/services/imageServiceServer";
import { HomeClient } from "./home-client";
import { getPropertyBaseConfig } from "@/lib/systemConfigServer";
import { buildPropertyJsonLd } from "@/config/seo";

export default async function Home() {
  const dynamicImages = await ImageServiceServer.getPublicImages();
  const property = await getPropertyBaseConfig();
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPropertyJsonLd(property)),
        }}
      />
      <HomeClient dynamicImages={dynamicImages} property={property} />
    </>
  );
}
