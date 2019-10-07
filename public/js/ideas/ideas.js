$(document).ready(() => {
    $.getJSON("/api/ideas", (data) => {
        const root = { parent: "", name: "idea", categories: {}, ideas: [] }
        data.forEach((idea) => {
            const getCategoryComponents = (category) => category.split("/")

            const categories = getCategoryComponents(idea.category)

            let node = root;
            for (let i = 0; i < categories.length; i++) {
                const categoryName = categories[i];
                if (i == categories.length - 1 && node.categories[categoryName]) {
                    node.categories[categoryName].ideas.push(idea)
                    break;
                } else if (i == categories.length - 1) {
                    node.categories[categoryName] = {}
                    node.categories[categoryName] = { parent: i === 0 ? root.name : categories[i - 1], name: categoryName, categories: {}, ideas: [ idea ] }
                    break;
                }

                if (node.categories[categoryName]) {
                    node.categories[categoryName] = { parent: i === 0 ? root.name : categories[i - 1], name: categoryName, categories: {}, ideas: [] }
                } else {
                    node.categories = {}
                    node.categories[categoryName] = { parent: i === 0 ? root.name : categories[i - 1], name: categoryName, categories: {}, ideas: [] }
                }

                node = node.categories[categoryName];
            }
        })

        const renderCategory = (ostream, node) => {
            ostream.append(`<div class="accordion">`);

            Object.values(node.categories).forEach((key) => {
                let output = ""
                output += "<div class=\"card\">"
                output += `<div class="card-header"><h2 class="mb-0">`
                output += `<button class="btn btn-link" data-toggle="collapse" data-target="#category-${key.parent}-${key.name}">${key.name}</button>`
                output += `</h2></div>`
                output += `<div id=category-${key.parent}-${key.name} class="card-body collapse"><ul class="list-group category">`
                output += `<div id=category-${key.parent}-${key.name}-parent></div>`
                if (Object.keys(node.categories) !== 0) {
                    output += `<div id="${key.parent}-${key.name}" class="accordion"><ul class="list-group category">`
                }
                key.ideas.forEach(idea => {
                    output += `<a href="/ideas/${idea._id}" class="list-group-item list-group-item-action">${idea.title}</a>`
                })
                output += `</ul></div>`
                output += "</div>"
                ostream.append(output)

                renderCategory($(`#category-${key.parent}-${key.name}-parent`), key)
            })

            ostream.append("</div>");
        }

        renderCategory($("#ideas"), root);
    })    
})