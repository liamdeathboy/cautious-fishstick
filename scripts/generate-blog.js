#!/usr/bin/env node
// Generates the WordPress-style /blog/ tree (index, /blog/<slug>/, /blog/category/<cat>/,
// /blog/tag/<tag>/) from data/blog-posts.json + data/blog-content/<slug>.html, plus thin
// redirect stubs at the old flat blog.html / blog/<slug>.html URLs so already-indexed
// links don't 404. Re-run after editing data/blog-posts.json or a blog-content fragment.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const POSTS_JSON_PATH = path.join(ROOT, 'data', 'blog-posts.json');
const CONTENT_DIR = path.join(ROOT, 'data', 'blog-content');
const GAMES_DATA_PATH = path.join(ROOT, 'js', 'games-data.js');
const SITE_URL = 'https://schplay.com';

function loadJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function loadGameList() {
  const code = fs.readFileSync(GAMES_DATA_PATH, 'utf8');
  const sandbox = { window: { SCHPLAY_GAMES: {} } };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'games-data.js' });
  return sandbox.window.SCHPLAY_GAMES.list || [];
}

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return () => {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    return hash / 0xffffffff;
  };
}

function formatDate(iso) {
  const parsed = new Date(iso + 'T00:00:00');
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Content fragments were extracted from the old one-level-deep blog/<slug>.html files, so
// their links use "../games/x.html" and bare sibling "other-slug.html" hrefs. Posts now live
// two levels deep (blog/<slug>/index.html) — rewrite everything to absolute site-root paths,
// which resolve correctly no matter how deep a page lives.
function rewriteProseLinks(html, slugSet) {
  return html.replace(/href="([^"]+)"/g, (full, href) => {
    if (/^https?:\/\//i.test(href) || href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:')) {
      return full;
    }
    if (href.startsWith('../')) {
      return `href="/${href.slice(3)}"`;
    }
    const bare = href.replace(/\.html$/i, '');
    if (slugSet.has(bare)) {
      return `href="/blog/${bare}/"`;
    }
    return full;
  });
}

function loadPosts() {
  const data = loadJson(POSTS_JSON_PATH);
  const slugSet = new Set(data.posts.map((p) => p.slug));

  return data.posts
    .map((post) => {
      const contentPath = path.join(CONTENT_DIR, `${post.slug}.html`);
      const rawContent = fs.readFileSync(contentPath, 'utf8');
      return {
        ...post,
        categorySlug: slugify(post.category),
        tagSlugs: (post.tags || []).map(slugify),
        content: rewriteProseLinks(rawContent, slugSet)
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Page shell ────────────────────────────────────────────────────────────
function pageShell({ title, description, canonicalPath, ogType, bodyClass, schemaEntries, main }) {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const schemaJson = JSON.stringify(schemaEntries.length === 1 ? schemaEntries[0] : schemaEntries, null, 8);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="/css/monocraft.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="theme-color" content="#0f1a2a">
    <title>${escapeHtml(title)}</title>
    <link rel="canonical" href="${canonical}">
    <link rel="icon" type="image/webp" href="/images/favicon.ico">
    <link rel="apple-touch-icon" href="/images/favicon-32x32.png">
    <meta property="og:type" content="${ogType}">
    <meta property="og:site_name" content="Schplay">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${SITE_URL}/images/logo.webp">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${SITE_URL}/images/logo.webp">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'" crossorigin="anonymous">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" crossorigin="anonymous"></noscript>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=optional" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=optional"></noscript>
    <link rel="stylesheet" href="/css/new-style.css">
    <link rel="stylesheet" href="/css/restyle.css">
    <link rel="stylesheet" href="/css/user-choice.css">
    <link rel="stylesheet" href="/css/blog.css">
    <script type="application/ld+json">
        ${schemaJson}
    </script>
</head>
<body class="${bodyClass}">
  <header id="site-header" role="banner">
    <div id="navbar-placeholder"></div>
  </header>

  <main class="container" role="main">
${main}
  </main>

  <footer id="site-footer" role="contentinfo">
    <div id="footer-placeholder"></div>
  </footer>

  <script src="/js/load-components.js?v=2026-04-01-mobile-1" defer data-component-root="/"></script>
  <script src="/js/lazy-media.js" defer></script>
</body>
</html>
`;
}

function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`
    }))
  };
}

function breadcrumbHtml(items) {
  const crumbs = items.map((item, index) => {
    if (index === items.length - 1) {
      return `<span aria-current="page">${escapeHtml(item.name)}</span>`;
    }
    return `<a href="${item.path}">${escapeHtml(item.name)}</a>`;
  });
  return `<p class="blog-breadcrumb">${crumbs.join(' <span>/</span> ')}</p>`;
}

// ── "You Might Also Like" static games section ──────────────────────────────
function buildGamesSection(seedKey, gameList, count) {
  const rand = seededRandom(seedKey);
  const pool = gameList.filter((g) => g && g.href && g.name && g.img);
  const indices = pool.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const selected = indices.slice(0, count).map((i) => pool[i]);

  const cards = selected
    .map((g) => {
      const href = `/${g.href}`;
      const img = /^https?:\/\//i.test(g.img) ? g.img : `/${g.img}`;
      return `        <a class="game-card" href="${escapeHtml(href)}"><img src="${escapeHtml(img)}" alt="${escapeHtml(g.name)} unblocked" loading="lazy" decoding="async"><h3>${escapeHtml(g.name)}</h3></a>`;
    })
    .join('\n');

  return `      <section class="games-grid-section blog-you-might-like" aria-labelledby="you-might-like-title">
        <div class="section-header">
          <h2 id="you-might-like-title">You Might Also Like</h2>
          <span class="games-count">${selected.length} games</span>
        </div>
        <div class="games-grid">
${cards}
        </div>
      </section>`;
}

function postCardHtml(post) {
  return `      <article class="post-card">
        <p class="post-meta">
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          <span>${escapeHtml(post.readTime)}</span>
          <a class="post-category" data-category="${post.categorySlug}" href="/blog/category/${post.categorySlug}/">${escapeHtml(post.category)}</a>
        </p>
        <h2><a href="/blog/${post.slug}/">${escapeHtml(post.title)}</a></h2>
        <p>${escapeHtml(post.excerpt)}</p>
        <a class="post-link" href="/blog/${post.slug}/">Read post</a>
      </article>`;
}

function tagChipsHtml(post) {
  if (!post.tagSlugs.length) return '';
  const chips = post.tags
    .map((tag, i) => `<a class="blog-tag" href="/blog/tag/${post.tagSlugs[i]}/">#${escapeHtml(tag)}</a>`)
    .join('\n            ');
  return `          <div class="blog-tags" aria-label="Tags">
            ${chips}
          </div>`;
}

function relatedPostsHtml(post, allPosts) {
  const sameCategory = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const others = allPosts.filter((p) => p.slug !== post.slug && p.category !== post.category);
  const related = [...sameCategory, ...others].slice(0, 3);
  if (!related.length) return '';

  const cards = related
    .map(
      (p) => `        <a class="related-post-card" href="/blog/${p.slug}/">
          <span class="post-category" data-category="${p.categorySlug}">${escapeHtml(p.category)}</span>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.excerpt)}</p>
        </a>`
    )
    .join('\n');

  return `      <section class="blog-related" aria-labelledby="related-title">
        <h2 id="related-title">Related Posts</h2>
        <div class="related-posts-grid">
${cards}
        </div>
      </section>`;
}

// ── Renderers ─────────────────────────────────────────────────────────────
function renderPost(post, allPosts, gameList) {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog/' },
    { name: post.category, path: `/blog/category/${post.categorySlug}/` },
    { name: post.title, path: `/blog/${post.slug}/` }
  ];

  const schemaEntries = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: `${SITE_URL}/images/logo.webp`,
      author: { '@type': 'Organization', name: post.author || 'Team Schplay' },
      publisher: {
        '@type': 'Organization',
        name: 'Schplay',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.webp` }
      },
      datePublished: post.date,
      dateModified: post.date,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}/` },
      keywords: (post.tags || []).join(', ')
    },
    buildBreadcrumbSchema(breadcrumbItems)
  ];

  const main = `    <section class="blog-article-wrapper" aria-labelledby="post-title">
      ${breadcrumbHtml(breadcrumbItems)}

      <article class="blog-article">
        <header class="blog-article-header">
          <a class="blog-category-pill" data-category="${post.categorySlug}" href="/blog/category/${post.categorySlug}/">${escapeHtml(post.category)}</a>
          <h1 id="post-title">${escapeHtml(post.title)}</h1>
          <p class="blog-meta">
            <time datetime="${post.date}">${formatDate(post.date)}</time>
            <span>${escapeHtml(post.readTime)}</span>
            <span>By ${escapeHtml(post.author || 'Team Schplay')}</span>
          </p>
          <p class="blog-lead">${escapeHtml(post.excerpt)}</p>
        </header>

        <div class="blog-prose">
${post.content}
        </div>

        <footer class="blog-article-footer">
${tagChipsHtml(post)}
          <a class="post-link" href="/blog/">Back to all posts</a>
        </footer>
      </article>

${relatedPostsHtml(post, allPosts)}

${buildGamesSection(`blog-${post.slug}`, gameList, 16)}
    </section>`;

  return pageShell({
    title: `${post.title} | Schplay Blog`,
    description: post.excerpt,
    canonicalPath: `/blog/${post.slug}/`,
    ogType: 'article',
    bodyClass: 'blog-paper blog-single',
    schemaEntries,
    main
  });
}

function renderIndex(posts, categories, tags) {
  const [featured, ...rest] = posts;

  const categoryChips = categories
    .map((c) => `<a class="blog-filter-chip" href="/blog/category/${c.slug}/">${escapeHtml(c.name)} <span>${c.count}</span></a>`)
    .join('\n          ');

  const tagChips = tags
    .map((t) => `<a class="blog-tag" href="/blog/tag/${t.slug}/">#${escapeHtml(t.name)}</a>`)
    .join('\n          ');

  const featuredHtml = featured
    ? `      <article class="post-card post-card-featured">
        <p class="post-meta">
          <time datetime="${featured.date}">${formatDate(featured.date)}</time>
          <span>${escapeHtml(featured.readTime)}</span>
          <a class="post-category" data-category="${featured.categorySlug}" href="/blog/category/${featured.categorySlug}/">${escapeHtml(featured.category)}</a>
        </p>
        <h2><a href="/blog/${featured.slug}/">${escapeHtml(featured.title)}</a></h2>
        <p>${escapeHtml(featured.excerpt)}</p>
        <a class="post-link" href="/blog/${featured.slug}/">Read post</a>
      </article>`
    : '';

  const schemaEntries = [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Schplay Blog',
      url: `${SITE_URL}/blog/`,
      description: 'Editorial updates, guides, and product announcements from Schplay.',
      publisher: { '@type': 'Organization', name: 'Schplay', url: SITE_URL },
      blogPost: posts.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: `${SITE_URL}/blog/${p.slug}/`,
        datePublished: p.date
      }))
    },
    buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }])
  ];

  const main = `    <section class="hero" aria-labelledby="blog-hero-title">
      <div class="hero-content">
        <h1 id="blog-hero-title">Schplay Blog</h1>
        <p>Guides, product updates, and classroom tips from the Schplay team.</p>
      </div>
    </section>

    <section class="blog-filters" aria-label="Browse by category">
      <div class="blog-filter-chips">
          ${categoryChips}
      </div>
    </section>

    <section aria-label="Latest articles">
      <p class="blog-results-count">${posts.length} post${posts.length === 1 ? '' : 's'}</p>
      <div class="posts-grid">
${featuredHtml}
${rest.map(postCardHtml).join('\n')}
      </div>
    </section>

    <section class="blog-tag-cloud" aria-label="Browse by tag">
      <h2>Browse by Tag</h2>
      <div class="blog-tags">
          ${tagChips}
      </div>
    </section>`;

  return pageShell({
    title: 'Schplay Blog',
    description: 'Read Schplay guides, product updates, classroom tips, and community stories.',
    canonicalPath: '/blog/',
    ogType: 'website',
    bodyClass: 'blog-paper blog-index',
    schemaEntries,
    main
  });
}

function renderTaxonomyArchive({ kind, slug, name, posts, description }) {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog/' },
    { name, path: `/blog/${kind}/${slug}/` }
  ];

  const schemaEntries = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${name} - Schplay Blog`,
      description,
      url: `${SITE_URL}/blog/${kind}/${slug}/`
    },
    buildBreadcrumbSchema(breadcrumbItems)
  ];

  const label = kind === 'category' ? 'Category' : 'Tag';

  const main = `    <section class="blog-article-wrapper" aria-labelledby="archive-title">
      ${breadcrumbHtml(breadcrumbItems)}

      <header class="blog-archive-header">
        <p class="blog-archive-kicker">${label}</p>
        <h1 id="archive-title">${kind === 'tag' ? '#' : ''}${escapeHtml(name)}</h1>
        <p>${escapeHtml(description)}</p>
      </header>

      <div class="posts-grid">
${posts.map(postCardHtml).join('\n')}
      </div>

      <p class="blog-archive-back"><a href="/blog/">&larr; Back to all posts</a></p>
    </section>`;

  return pageShell({
    title: `${name} ${label === 'Tag' ? 'Posts' : 'Guides'} | Schplay Blog`,
    description,
    canonicalPath: `/blog/${kind}/${slug}/`,
    ogType: 'website',
    bodyClass: 'blog-paper blog-archive',
    schemaEntries,
    main
  });
}

// ── Legacy URL redirect stubs (old flat blog.html / blog/<slug>.html) ──────
function renderRedirectStub(targetPath, label) {
  const target = `${SITE_URL}${targetPath}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, follow">
  <title>${escapeHtml(label)} has moved</title>
  <link rel="canonical" href="${target}">
  <meta http-equiv="refresh" content="0; url=${target}">
  <script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
  <p>This page has moved to <a href="${target}">${target}</a>.</p>
</body>
</html>
`;
}

// ── Main ────────────────────────────────────────────────────────────────
function main() {
  const posts = loadPosts();
  const gameList = loadGameList();

  const categoryMap = new Map();
  const tagMap = new Map();
  posts.forEach((post) => {
    if (!categoryMap.has(post.categorySlug)) {
      categoryMap.set(post.categorySlug, { slug: post.categorySlug, name: post.category, count: 0 });
    }
    categoryMap.get(post.categorySlug).count += 1;

    (post.tags || []).forEach((tag, i) => {
      const tagSlug = post.tagSlugs[i];
      if (!tagMap.has(tagSlug)) {
        tagMap.set(tagSlug, { slug: tagSlug, name: tag, count: 0 });
      }
      tagMap.get(tagSlug).count += 1;
    });
  });

  const categories = [...categoryMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  const tags = [...tagMap.values()].sort((a, b) => a.name.localeCompare(b.name));

  fs.mkdirSync(BLOG_DIR, { recursive: true });

  // /blog/
  fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), renderIndex(posts, categories, tags), 'utf8');

  // /blog/<slug>/
  posts.forEach((post) => {
    const dir = path.join(BLOG_DIR, post.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPost(post, posts, gameList), 'utf8');

    // Legacy flat URL -> soft redirect to the new directory URL.
    fs.writeFileSync(
      path.join(BLOG_DIR, `${post.slug}.html`),
      renderRedirectStub(`/blog/${post.slug}/`, post.title),
      'utf8'
    );
  });

  // /blog/category/<slug>/
  categories.forEach((cat) => {
    const dir = path.join(BLOG_DIR, 'category', cat.slug);
    fs.mkdirSync(dir, { recursive: true });
    const catPosts = posts.filter((p) => p.categorySlug === cat.slug);
    const html = renderTaxonomyArchive({
      kind: 'category',
      slug: cat.slug,
      name: cat.name,
      posts: catPosts,
      description: `${catPosts.length} Schplay blog post${catPosts.length === 1 ? '' : 's'} in ${cat.name}.`
    });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  });

  // /blog/tag/<slug>/
  tags.forEach((tag) => {
    const dir = path.join(BLOG_DIR, 'tag', tag.slug);
    fs.mkdirSync(dir, { recursive: true });
    const tagPosts = posts.filter((p) => p.tagSlugs.includes(tag.slug));
    const html = renderTaxonomyArchive({
      kind: 'tag',
      slug: tag.slug,
      name: tag.name,
      posts: tagPosts,
      description: `${tagPosts.length} Schplay blog post${tagPosts.length === 1 ? '' : 's'} tagged "${tag.name}".`
    });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  });

  // Legacy root blog.html -> /blog/
  fs.writeFileSync(path.join(ROOT, 'blog.html'), renderRedirectStub('/blog/', 'Schplay Blog'), 'utf8');

  // The old fake "weekly-update-template" post used to be indexed as a real post; send it home.
  fs.writeFileSync(
    path.join(BLOG_DIR, 'weekly-update-template.html'),
    renderRedirectStub('/blog/', 'Schplay Blog'),
    'utf8'
  );

  console.log(
    `Generated /blog/ with ${posts.length} posts, ${categories.length} categories, ${tags.length} tags.`
  );
}

main();
