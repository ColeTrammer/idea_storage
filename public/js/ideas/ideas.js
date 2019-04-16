$(document).ready(() => {
    $.getJSON("/api/ideas", (data) => {
        const map = {}
        data.forEach((idea) => {
            if (map[idea.category])
                map[idea.category].push(idea)
            else
                map[idea.category] = [ idea ]
        })

        Object.keys(map).forEach((key) => {
            let output = ""
            output += "<div class=\"card\">"
            output += `<div class="card-header"><h2 class="mb-0">`
            output += `<button class="btn btn-link" data-toggle="collapse" data-target="#category-${key}">${key}</button>`
            output += `</h2></div>`
            output += `<div id=category-${key} class="card-body collapse"><ul class="list-group category">`
            map[key].forEach((idea) => {
                output += `<a href="/ideas/${idea._id}" class="list-group-item list-group-item-action">${idea.title}</a>`
            })
            output += "</ul></div>"
            output += "</div>"
            $("#ideas").append(output)
        })
    })    
})