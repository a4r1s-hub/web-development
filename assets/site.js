const contentConfig = {
  projects: {
    container: "projects-grid",
    endpoint: "/api/projects",
    fallback: "content/projects.json",
    limit: null,
    key: "projects",
  },
  featuredProjects: {
    container: "featured-projects-grid",
    endpoint: "/api/projects",
    fallback: "content/projects.json",
    limit: 3,
    key: "projects",
  },
  blog: {
    container: "blog-grid",
    endpoint: "/api/posts",
    fallback: "content/posts.json",
    limit: null,
    key: "posts",
  },
  latestPosts: {
    container: "latest-posts-grid",
    endpoint: "/api/posts",
    fallback: "content/posts.json",
    limit: 3,
    key: "posts",
  },
};

const createCard = (item, type) => {
  const card = document.createElement("article");
  card.className = "card";

  if (item.imageUrl) {
    const media = document.createElement("img");
    media.className = "card-media";
    media.src = item.imageUrl;
    media.alt = `${item.title} cover`;
    card.append(media);
  }

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = item.category || type;

  const title = document.createElement("h3");
  if (item.linkUrl) {
    const link = document.createElement("a");
    link.href = item.linkUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = item.title;
    title.append(link);
  } else {
    title.textContent = item.title;
  }

  const summary = document.createElement("p");
  summary.textContent = item.summary;

  const footer = document.createElement("div");
  footer.className = "card-footer";

  const date = document.createElement("span");
  date.textContent = item.date;

  const location = document.createElement("span");
  location.textContent = item.role || item.readTime;

  footer.append(date, location);

  card.append(tag, title, summary, footer);
  return card;
};

const loadContent = async (endpoint) => {
  const response = await fetch(endpoint, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${endpoint}`);
  }
  return response.json();
};

const renderCollection = async ({ container, endpoint, fallback, limit, key }) => {
  const target = document.getElementById(container);
  if (!target) {
    return;
  }

  try {
    let data;
    try {
      data = await loadContent(endpoint);
    } catch (error) {
      data = await loadContent(fallback);
    }

    const list = Array.isArray(data) ? data : data[key] || [];
    if (list.length === 0 && fallback && endpoint !== fallback) {
      data = await loadContent(fallback);
    }
    const listFallback = Array.isArray(data) ? data : data[key] || [];
    const items = limit ? listFallback.slice(0, limit) : listFallback;

    target.innerHTML = "";
    items.forEach((item) => {
      const type = endpoint.includes("projects") ? "Project" : "Blog";
      target.append(createCard(item, type));
    });
  } catch (error) {
    target.innerHTML = `<p class="lead">Unable to load content yet. ${error.message}</p>`;
  }
};

Object.values(contentConfig).forEach(renderCollection);
