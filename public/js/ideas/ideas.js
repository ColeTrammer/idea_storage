$(() => {
    $.getJSON("/api/ideas", data => {
        const root = { parent: "", name: "idea", categories: {}, ideas: [] };
        data.forEach(idea => {
            const getCategoryComponents = category => category.split("/");

            const categories = getCategoryComponents(idea.category);

            let node = root;
            for (let i = 0; i < categories.length; i++) {
                const categoryName = categories[i];
                if (i == categories.length - 1 && node.categories[categoryName]) {
                    node.categories[categoryName].ideas.push(idea);
                    break;
                } else if (i == categories.length - 1) {
                    node.categories[categoryName] = {
                        parent: i === 0 ? root.name : categories[i - 1],
                        name: categoryName,
                        categories: {},
                        ideas: [idea],
                    };
                    break;
                }

                if (!node.categories[categoryName]) {
                    node.categories[categoryName] = {
                        parent: i === 0 ? root.name : categories[i - 1],
                        name: categoryName,
                        categories: {},
                        ideas: [],
                    };
                }

                node = node.categories[categoryName];
            }
        });

        const renderCategory = (ostream, node) => {
            Object.values(node.categories).forEach(key => {
                const id = `category-${key.parent}-${key.name}`;
                const headerId = `${id}-header`;
                const contentId = `${id}-content`;

                let output = "";
                output += '<div class="accordion-item">';
                output += `<h2 class="accordion-header" id="${headerId}">`;
                output += `<button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#${contentId}" aria-expanded="false" aria-controls="${contentId}">${key.name}</button>`;
                output += `</h2>`;
                output += `<div id=${contentId} class="accordion-collapse collapse" aria-labelledby="${headerId}"><ul class="list-group list-group-flush">`;
                output += `<div id=category-${key.parent}-${key.name}-parent class="accordion accordion-flush"></div>`;
                key.ideas.forEach(idea => {
                    output += `<a href="/ideas/${idea._id}" class="list-group-item list-group-item-action">${idea.title}</a>`;
                });
                output += `</ul></div>`;
                output += "</div>";
                ostream.append(output);

                renderCategory($(`#category-${key.parent}-${key.name}-parent`), key);
            });
        };

        renderCategory($("#ideas"), root);
    });
});
