const contentConfig = {
  projects: {
    container: "projects-grid",
    endpoint: "content/projects.json",
    limit: null,
    key: "projects",
  },
  featuredProjects: {
    container: "featured-projects-grid",
    endpoint: "content/projects.json",
    limit: 3,
    key: "projects",
  },
  blog: {
    container: "blog-grid",
    endpoint: "content/posts.json",
    limit: null,
    key: "posts",
  },
  latestPosts: {
    container: "latest-posts-grid",
    endpoint: "content/posts.json",
    limit: 3,
    key: "posts",
  },
};

const createCard = (item, type) => {
  const card = document.createElement("article");
  card.className = "card";

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = item.category || type;

  const title = document.createElement("h3");
  title.textContent = item.title;

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

const renderCollection = async ({ container, endpoint, limit, key }) => {
  const target = document.getElementById(container);
  if (!target) {
    return;
  }

  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${endpoint}`);
    }
    const data = await response.json();
    const list = Array.isArray(data) ? data : data[key] || [];
    const items = limit ? list.slice(0, limit) : list;

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
