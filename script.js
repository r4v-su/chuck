class App {
  constructor() {
    this.container = document.querySelector("main");
    this.sortButton = document.getElementById("sortButton");
    this.modal = document.querySelector(".mdc-dialog");
    this.list = this.renderCategoriesList();
    this.currentCategory = null;
    this.sortFlag = true;

    this.appendCategories();
    this.pinModalActions();
    this.pinSort();
    // if true sorting a-z, if false sorting z-a;
  }

  renderCategoriesList() {
    const list = document.createElement("ul");
    list.setAttribute("class", "mdc-list");
    list.setAttribute("id", "categoriesList");

    this.container.appendChild(list);
    return list;
  }

  renderSingleCategory(category, id) {
    const mdc_list_item = document.createElement("li");
    mdc_list_item.setAttribute("class", "mdc-list-item");
    mdc_list_item.setAttribute("id", id);

    const mdc_span_ripple = document.createElement("span");
    mdc_span_ripple.setAttribute("class", "mdc-list-item__ripple");

    const mcd_span_text = document.createElement("span");
    mcd_span_text.setAttribute("class", "mdc-list-item__text");
    mcd_span_text.innerText = category.toUpperCase();

    mdc_list_item.appendChild(mdc_span_ripple);
    mdc_list_item.appendChild(mcd_span_text);

    mdc_list_item.addEventListener("click", (e) => {this.categoryOnClick(e)
    });

    this.list.appendChild(mdc_list_item);
  }

  categoryOnClick(e) {
    let clicked = null;
    if (e.target.nodeName === "LI") {
      clicked = e.target;
    } else {
      clicked = e.target.closest("li");
    }
    let clickedCategory = clicked.innerText;
    this.currentCategory = clickedCategory.toLowerCase(); //change global currentCategory, showJoke uses this.currentCategory;
    this.showJoke();
  }
  appendCategories() {
    fetch("https://api.chucknorris.io/jokes/categories")
      .then((response) => response.json())
      .then((categories) => {
        categories.sort().forEach((category, index) => {
          this.renderSingleCategory(category, index);
        });
        this.colorizeCategories();
      })
      .catch((error) => {
        alert(
          "There was an error with external API. Try again in a few seconds"
        );
        console.log(error);
      });
  }
  colorizeCategories() {
    let a = [...this.list.querySelectorAll("li")];
    const itemsCount = a.length;

    a.forEach((element, index) => {
      element.style.backgroundColor = `rgb(
                ${Math.round(98 + (100 / itemsCount) * index)},
                ${Math.round(0 + (10 / itemsCount) * index)},
                ${Math.round(238 + (150 / itemsCount) * index)}
            )`;
    });
  }

  showJoke() {
    fetch(
      `https://api.chucknorris.io/jokes/random?category=${this.currentCategory}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.showModal(data.value);
      })
      .catch((error) => {
        console.error(error);
        alert("cannot read data from external API. Try again later");
      });
  }
  showModal(joke) {
    this.modal.querySelector(".mdc-dialog__content").innerText = joke;
    this.modal.classList.remove("mdc-dialog--close");
    this.modal.classList.add("mdc-dialog--open");
  }
  //modal actions
  pinModalActions() {
    document.getElementById("nextJoke").addEventListener("click", () => {
      this.showJoke();
    });
    document.getElementById("close").addEventListener("click", () => {
      this.closeModal();
    });
  }
  closeModal() {
    this.modal.classList.remove("mdc-dialog--open");
    this.modal.classList.add("mdc-dialog--close");
  }
  //sorting
  pinSort() {
    this.sortButton.addEventListener("click", () => {
      this.switchSortCategories();
    });
  }
  switchSortCategories() {
    this.sortFlag = !this.sortFlag;
    const items = [...this.list.querySelectorAll("li")];
    items.reverse();
    items.forEach((item) => this.list.appendChild(item));
  }
}

new App();
