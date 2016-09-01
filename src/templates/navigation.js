module.exports = {
  categoriesList: '<ul class="categories"></ul>',

  categoriesItem (category) {
    return `
      <li class="category ${category.slug}">
        <div class="category-name">${category.name}</div>
        <div class="category-desc">${category.desc}</div>
      </li>
    `
  }
}
