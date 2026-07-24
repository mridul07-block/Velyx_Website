import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import CineNav from "../components/CineNav";
import CineFooter from "../components/CineFooter";
import CustomCursor from "../components/CustomCursor";
import ProgressUpdater from "../components/ProgressUpdater";
import Seo from "../components/Seo";
import { SITE } from "../components/seoConfig";
import { getPost, getPosts, formatDate } from "../lib/blog";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);
  if (!post) return <Navigate to="/blog" replace />;

  const url = `${SITE.url}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: post.cover || SITE.ogImage,
    keywords: post.tags.join(", "),
    author: { "@type": "Organization", name: "Velyx Labs", url: SITE.url },
    publisher: { "@type": "Organization", name: "Velyx Labs", url: SITE.url, logo: { "@type": "ImageObject", url: SITE.ogImage } },
    mainEntityOfPage: url,
  };

  const others = getPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        image={post.cover || SITE.ogImage}
        jsonLd={jsonLd}
      />
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="blog" />

      <article className="post">
        <header className="post__head">
          <div className="post__head-bg" />
          <div className="container post__head-inner">
            <motion.div
              className="page-hero__crumbs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/blog" style={{ color: "var(--accent)" }}>BLOG</Link>{" "}
              <span style={{ color: "var(--fg-mute)" }}>/</span> {post.tags[0]?.toUpperCase() || "NOTE"}
            </motion.div>
            <motion.h1
              className="post__title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            >
              {post.title}
            </motion.h1>
            <motion.div
              className="post__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {formatDate(post.date)} · {post.readingTime}
              {post.tags.length > 0 && (
                <span className="post__tags">
                  {post.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </span>
              )}
            </motion.div>
          </div>
        </header>

        {post.cover && (
          <div className="container">
            <div className="post__cover">
              <img src={post.cover} alt={post.title} />
            </div>
          </div>
        )}

        <div className="container">
          <div className="post__body" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>

        {/* CTA */}
        <section className="container" style={{ paddingBlock: "clamp(40px, 6vw, 90px)" }}>
          <div className="cs-cta">
            <h2>Want this <span className="serif">for your business?</span></h2>
            <p>We take on a handful of founders each quarter. If this resonates, let's talk.</p>
            <button
              data-cal-namespace="30min"
              data-cal-link="velyx-labs/30min"
              data-cal-config='{"layout":"month_view"}'
              className="btn btn--primary"
            >
              Book a strategy call <span className="arr">↗</span>
            </button>
          </div>
        </section>

        {others.length > 0 && (
          <section className="container" style={{ paddingBottom: "clamp(60px, 9vw, 120px)" }}>
            <div className="cs-label">Keep reading</div>
            <div className="blog-grid" style={{ marginTop: 24 }}>
              {others.map((p) => (
                <article key={p.slug} className="blog-card">
                  <Link to={`/blog/${p.slug}`} className="blog-card__link">
                    <div className="blog-card__body">
                      <div className="blog-card__meta">
                        {p.tags[0] && <span className="tag">{p.tags[0]}</span>}
                        <span>{p.readingTime}</span>
                      </div>
                      <h2 className="blog-card__title">{p.title}</h2>
                      <p className="blog-card__desc">{p.description}</p>
                      <span className="blog-card__cta">Read <span className="arr">↗</span></span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>

      <CineFooter />
    </>
  );
}
