import RecentProducts from "../RecentProducts/RecentProducts";
import RecentlyViewed from "../RecentlyViewed/RecentlyViewed";
import CategoriesSlider from "../CategoriesSlider/CategoriesSlider";
import MainSlider from "../MainSlider/MainSlider";
export default function Home() {
  return <>
    <div className="pb-8 pt-4">
      <MainSlider />
      <CategoriesSlider />

      <section className="my-12">
        <h2 className="section-header">
          Recent Products
        </h2>
        <RecentProducts />
      </section>

      <section className="mb-8">
        <RecentlyViewed />
      </section>
    </div>
  </>
}