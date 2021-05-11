const container = document.querySelector(".container");
const filterCard = document.querySelector(".filter_container");
const filterDiv = document.querySelector(".filter");
const clearBtn = document.querySelector(".clear_button");
const tags = new Set();

const createButtons = (languages, tools) => {
  const requirements = [...languages, ...tools];
  return requirements.reduce((acc, curr) => {
    return acc + `<button class="requirement">${curr}</button>`;
  }, "");
};

const resetPage = () => {
    document.querySelectorAll(".card").forEach((e) => e.remove());
    getData();
}

const createElements = (info) => {
  const {
    company,
    logo,
    featured,
    position,
    role,
    level,
    postedAt,
    contract,
    location,
    languages,
    tools,
  } = info;
  const isNew = info.new;

  const newSpan = isNew
    ? `<span class="new">
        New!
      </span>`
    : "";

  const newFeature = featured
    ? `<span class="featured">
        Featured!
      </span>`
    : "";

  const buttons = createButtons(languages, tools);
  return `
  <img class="icon" src='${logo}' alt='${company}'></img>
    <div class="job">
    <p class="company">
      ${company}
      ${newSpan}
      ${newFeature}
    </p>
    <h4 class="position">
      ${position}
    </h4>
    <p class="posted">
      <span class="postedAt">
        ${postedAt}
      </span>
      <span class="dot">·</span>
      <span class="contract">
        ${contract}
      </span>
      <span class="dot">·</span>
      <span class="location">
        ${location}
      </span>
    </p>
    </div>
    <div class="requirements">
      <button class="requirement">${role}</button><button class="requirement">${level}</button>
      ${buttons}
    </div>
  `;
};

const createCards = (data) => {
  let fragment = new DocumentFragment();
  data.forEach((info) => {
    const card = document.createElement("div");
    card.className = info.featured ? "card feature" : "card";
    const elements = createElements(info);
    card.innerHTML = elements;
    fragment.appendChild(card);
  });
  container.appendChild(fragment);
};

const redrawCards = async () => {
  let res = await fetch("./data.json");
    let data = await res.json();
    let cardTags = [];

    data.forEach(({ id, role, level, languages, tools }) => {
        if ([...tags].every((element) => [role, level, ...languages, ...tools].indexOf(element) > -1)) {
            cardTags.push(data[id - 1])
        }
    })

    document.querySelectorAll(".card").forEach((e) => e.remove());

    createCards(cardTags)
}

const getData = async () => {
  let res = await fetch("./data.json");
  let data = await res.json();
  createCards(data);
};

const handleClick = (e) => {
    if (e.target.classList.contains('requirement') && !tags.has(e.target.innerText)) {
        let filterItem = document.createElement('div');
        filterItem.className = 'filter_tag';
        filterItem.innerHTML = `
      <div class="filter_requirement">${e.target.innerText}</div>
      <div class="filter_X">&#10005;</div>
    `;
        tags.add(e.target.innerText)
        filterCard.prepend(filterItem)
        filterDiv.style.display = 'flex'
        redrawCards();
    }
}

const handleClear = () => {
  tags.clear()
  filterCard.innerHTML = ''
    filterDiv.style.display = 'none'
    resetPage();
}

const handleTagClick = (e) => {
  if (e.target.classList.contains('filter_X')) {
    tags.delete(e.target.previousElementSibling.innerText)
    e.target.parentNode.remove()
    if(!tags.size){
      filterDiv.style.display = 'none'
      }
      redrawCards();
  }
}



window.onload = getData();
container.addEventListener("click", handleClick);
clearBtn.addEventListener("click", handleClear);
filterCard.addEventListener('click', handleTagClick)
