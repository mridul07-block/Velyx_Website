import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import FilterPills from "../components/FilterPills";
import Lightbox from "../components/Lightbox";
import { SWIPE } from "../data/swipe";
import { SWIPE_FILTERS, pickFilter } from "../data/filters";

export default function SwipeFile() {
  const [params, setParams] = useSearchParams();
  const type = pickFilter(SWIPE_FILTERS, params.get("type"));
  const list = type === "all" ? SWIPE : SWIPE.filter((s) => s.type === type);
  const [open, setOpen] = useState(null);
  const close = () => setOpen(null);

  return (
    <Layout>
      <Seo
        title="Swipe file"
        description="A raw look at recent Velyx Labs design work across products, websites and brands."
        path="/swipe-file"
      />
      <section className="page-head">
        <div className="container">
          <SectionHeader
            as="h1"
            align="center"
            title="Swipe file"
            sub="A raw look at recent design work across products, websites and brands."
          />
          <FilterPills
            label="Filter images"
            options={SWIPE_FILTERS}
            value={type}
            onChange={(key) => { setOpen(null); setParams(key === "all" ? {} : { type: key }, { replace: true }); }}
          />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container swipe-grid">
          {list.map((s, i) => (
            <button key={s.src} type="button" className="swipe-item" aria-label={`Open image ${i + 1}`} onClick={() => setOpen(i)}>
              <img src={s.src} width={s.w} height={s.h} alt="" loading="lazy" />
            </button>
          ))}
        </div>
        {list.length === 0 && <p className="container muted center">No images in this category yet.</p>}
      </section>
      {open !== null && <Lightbox items={list} index={open} onIndex={setOpen} onClose={close} />}
    </Layout>
  );
}
