import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import jsonData from '../utils/update_data2.json';
import extractAllDataItemsFromAllSections from "../utils/loadImageData";
import Header from "../components/Header";
import { ThemeProviders } from "../components/theme-providers";
import { Analytics, AnalyticsConfig } from "pliny/analytics";
import { SearchConfig, SearchProvider } from "pliny/search";
import Footer from "../components/Footer";
import siteMetadata from "../utils/siteMetadata";

const Home: NextPage<{ data: ImageProps[] }> = ({ data }) => {
  const router = useRouter();
  const { photoId, session } = router.query;
  const [images, setImages] = useState<ImageProps[]>([]);

  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  useEffect(() => {
    if (session) {
      setImages(data?.filter(m => m['session_id'] === parseInt(session as string)) ?? []);
    } else {
      setImages(data ?? []);
    }
  }, [session, data]);

  return (
    <ThemeProviders>
      <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
      <div className="flex h-screen flex-col justify-between font-sans">
        <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
          <Header />
          <>
            <Head>
              <title>Next.js Conf 2022 Photos</title>
              <meta
                property="og:image"
                content="https://nextjsconf-pics.vercel.app/og-image.png"
              />
              <meta
                name="twitter:image"
                content="https://nextjsconf-pics.vercel.app/og-image.png"
              />
            </Head>
            <main className="mx-auto max-w-[1960px] p-4">
              {photoId && (
                <Modal
                  images={images}
                  onClose={() => {
                    setLastViewedPhoto(photoId);
                  }}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {images.map(({ id, public_id, format, blurDataUrl }) => (
                  <Link
                    key={id}
                    href={`/?photoId=${id}`}
                    as={`/p/${id}`}
                    ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                    shallow
                    className="group relative mb-5 block w-full cursor-zoom-in after:content after:group-hover:brightness-110 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                  >
                    <Image
                      alt="Next.js Conf photo"
                      className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      placeholder="blur"
                      blurDataURL={blurDataUrl}
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                      width={720}
                      height={480}
                      sizes="(max-width: 640px) 100vw,
                        (max-width: 1280px) 50vw,
                        (max-width: 1536px) 33vw,
                        25vw"
                    />
                  </Link>
                ))}
              </div>
            </main>
          </>
        </SearchProvider>
        <Footer />
      </div>
    </ThemeProviders>
  );
};

export default Home;

export async function getStaticProps() {
  let images = extractAllDataItemsFromAllSections(jsonData as any);

  const promises = images.map(async (image) => {
    image['blurDataUrl'] = await getBase64ImageUrl(image);
    return image;
  });

  const updatedImages = await Promise.all(promises);

  return {
    props: {
      data: updatedImages,
    },
  };
}
