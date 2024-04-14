import type { GetStaticProps, GetStaticPaths, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";
import extractAllDataItemsFromAllSections from "../../utils/loadImageData";
import jsonData from '../../utils/update_data2.json';

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  console.log("🚀 ~ currentPhoto:", currentPhoto)
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhoto.public_id}.${currentPhoto.format}`;

  return (
    <>
      <Head>
        <title>Next.js Conf 2022 Photos</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  let images = extractAllDataItemsFromAllSections(jsonData as any);
  
  const currentPhoto = images.find(
    (img) => img.id === Number(context.params.photoId),
  );
  
  // Kiểm tra currentPhoto không null trước khi truy cập thuộc tính blurDataUrl
  if (currentPhoto) {
    currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto);
  }

  return {
    props: {
      currentPhoto: currentPhoto || null, // Trả về null nếu không tìm thấy ảnh
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let results = extractAllDataItemsFromAllSections(jsonData as any);
  
  let fullPaths = [];
  for (let i = 0; i < results.length; i++) {
    fullPaths.push({ params: { photoId: results[i].id.toString() } }); // Sử dụng results[i].id thay vì results['id']
  }

  return {
    paths: fullPaths,
    fallback: false,
  };
};
