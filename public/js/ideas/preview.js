$(() => {
    const renderBreadcrumbs = (category, title) => {
        const parts = category.split("/");
        const listElements = parts.map(
            (part, i) => `<li class="breadcrumb-item">
                              <a href="/ideas/#${parts.slice(0, i + 1).join("/")}/">${part}</a>
                          </li>`
        );
        return `<nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                ${listElements.join("")}
                <li class="breadcrumb-item active" aria-current="page">${title}</li>
            </ol>
        </nav>`;
    };

    const update = () => {
        const category = $("#category").val();
        const title = $("#title").val();
        const content = $("#content").val();

        $("#idea-category").html(renderBreadcrumbs(category, title));
        $("#idea-title").html(title);
        $("#idea-content").html(marked.parse(content));
    };

    update();
    $("#idea-form").on("input", () => {
        update();
        $("#idea").show();
    });
});
