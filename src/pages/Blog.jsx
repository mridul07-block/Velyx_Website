import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CineNav from "../components/CineNav";
import CineFooter from "../components/CineFooter";
import CustomCursor from "../components/CustomCursor";
import ProgressUpdater from "../components/ProgressUpdater";
import Seo from "../components/Seo";
import { getPosts, formatDate } from "../lib/blog";

export default function Blog() {
  const posts = getPosts();

  return (
    <>
      <Seo
        title="Blog — notes on agentic systems & AI leverage"
        description="Field notes from Velyx Labs on building agentic systems, AI-native SaaS, and automation that gives founders compounding leverage."
        path="/blog"
      />
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="blog" />

      <section className="page-hero" data-screen-label="01 Blog Hero">
        <div className="page-hero__bg" />
        <div className="page-hero__bg-grid" style={{ animation: "grid-drift 40s linear infinite", opacity: 0.5 }} />
        <div className="page-hero__inner" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <motion.div
              className="page-hero__crumbs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span>VELYX LABS</span> <span style={{ color: "var(--fg-mute)" }}>/</span> BLOG
            </motion.div>
            <motion.h1
              className="page-hero__title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Field notes on <span className="serif">leverage.</span>
            </motion.h1>
          </div>
          <motion.p
            className="page-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            How we think about agentic systems, AI-native software, and building companies that scale
            in revenue rather than headcount.
          </motion.p>
        </div>
      </section>

      <div className="container">
        {posts.length === 0 ? (
          <p style={{ padding: "80px 0", color: "var(--fg-dim)" }}>No posts yet — check back soon.</p>
        ) : (
          <div className="blog-grid">
            {posts.map((p, i) => (
              <motion.article
                key={p.slug}
                className="blog-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: Math.min(i * 0.07, 0.3), ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/blog/${p.slug}`} className="blog-card__link">
                  {p.cover && (
                    <div className="blog-card__cover">
                      <img src={p.cover} alt={p.title} loading="lazy" />
                    </div>
                  )}
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      {p.tags[0] && <span className="tag">{p.tags[0]}</span>}
                      <span>{formatDate(p.date)} · {p.readingTime}</span>
                    </div>
                    <h2 className="blog-card__title">{p.title}</h2>
                    <p className="blog-card__desc">{p.description}</p>
                    <span className="blog-card__cta">Read <span className="arr">↗</span></span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <CineFooter />
    </>
  );
}
