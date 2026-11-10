import "./style.css";

const input = document.querySelector("input");
const results = document.querySelector(".repo-list");

async function searchRepos(query) {
    const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`,
    );

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();

    results.replaceChildren();

    for (const repo of data.items) {
        const div = document.createElement("div");

        div.textContent = repo.name;

        div.addEventListener("click", function () {
            addRepository(repo);

            results.replaceChildren();
            input.value = "";
        });

        results.appendChild(div);
    }
}

let timer;

input.addEventListener("input", function (event) {
    const query = event.target.value.trim();

    clearTimeout(timer);

    if (!query) {
        results.replaceChildren();
        return;
    }

    timer = setTimeout(() => {
        searchRepos(query).catch(console.error);
    }, 500);
});

const selectedRepos = document.querySelector(".selected");

function addRepository(repo) {
    const card = document.createElement("div");
    card.classList.add("repo-card");

    const info = document.createElement("div");

    const name = document.createElement("p");
    name.textContent = `Name: ${repo.name}`;

    const owner = document.createElement("p");
    owner.textContent = `Owner: ${repo.owner.login}`;

    const stars = document.createElement("p");
    stars.textContent = `Stars: ${repo.stargazers_count}`;

    info.appendChild(name);
    info.appendChild(owner);
    info.appendChild(stars);

    const removeButton = document.createElement("button");
    removeButton.textContent = "✕";
    removeButton.classList.add("remove-btn");

    removeButton.addEventListener("click", function () {
        card.remove();
    });

    card.appendChild(info);
    card.appendChild(removeButton);

    selectedRepos.appendChild(card);
}
