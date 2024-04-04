import OverlayFadeRenderItem from "./Component/overlayFadeItems";

interface PosterMovies {
  vote_average: number;
  original_title: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  id: number;
}

const data = [
  {
    id: "1",
    name: "duyhuong",
    image: "huong.png",
    title: "Người mẫu và lon bia",
    genreIds: "",
    voteAverage: "2",
  },
  {
    id: "1",
    name: "duyhuong",
    image: "duyanhhuong.jpg",
    title: "Đẹp đôi 10 điểm",
    genreIds: "",
    voteAverage: "2",
  },
  {
    id: "1",
    name: "duyhuong",
    image: "huong2.jpg",
    title: "Người mẫu dễ thương nhất",
    genreIds: "",
    voteAverage: "2",
  },
  {
    id: "1",
    name: "duyhuong",
    image: "huong3.jpg",
    title: "Người mẫu thần thái 10 điểm",
    genreIds: "",
    voteAverage: "2",
  },
];

export default function Home() {
  const renderPosterMovies = (item: any) => {
    return (
      <OverlayFadeRenderItem
        id={item?.id}
        title={item?.title}
        name={item?.original_title}
        images={item?.image}
        genreIds={item?.genre_ids}
        voteAverage={item?.vote_average}
      />
    );
  };
  const suggestUserChoiceList = () => {
    return (
      <div className="">
        <div className="grid place-content-center gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className=" text-xs text-white flex justify-center">
            {" "}
            Ngày 29/3/2024{" "}
          </div>
          <div className="items-center flex justify-center">
            {" "}
            <div className="rounded-full bg-red-700 w-[10px]  h-[10px]"> </div>
          </div>

          {data?.map(renderPosterMovies)}
        </div>
      </div>
    );
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="h-[500px]">
        {/* <CarouselMovie dataPopularMovies={popularMovies} /> */}
        <div className="md:mx-24">{suggestUserChoiceList()}</div>
      </div>{" "}
    </main>
  );
}
