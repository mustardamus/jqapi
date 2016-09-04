module.exports = {
  categoriesList: '<ul class="categories"></ul>',
  entriesList: '<ul class="entries"></ul>',

  categoriesItem (category) {
    return `
      <li class="category ${category.slug}">
        <div class="category-name">${category.name}</div>
      </li>
    `
  },

  entriesItem (entry) {
    return `
      <li class="entry ${entry.name}">
        <div class="entry-title">${entry.title}</div>
        <div class="entry-desc">${entry.desc}</div>
      </li>
    `
  }
}
