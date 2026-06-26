import RecentProducts from "../RecentProducts/RecentProducts";
import CategoriesSlider from "../CategoriesSlider/CategoriesSlider";
import MainSlider from "../MainSlider/MainSlider";
export default function Home() {
  return <>
    <div className="container py-8 px-10 mx-auto">
      <MainSlider />
      <CategoriesSlider />
      <RecentProducts />
    </div>
  </>
}