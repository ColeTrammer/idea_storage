$(() => {
    const renderBreadcrumbs = category => {
        const parts = category.split("/");
        const listElements = parts.map((part, i) => `<li class="breadcrumb-item ${i === parts.length - 1 ? "active" : ""}">${part}</li>`);
        return `<ol class="breadcrumb mb-0">${listElements.join("")}</ol>`;
    };

    const f = () => {
        $("#idea-category").html(renderBreadcrumbs($("#category").val()));
        $("#idea-title").html($("#title").val());
        $("#idea-content").html(marked($("#content").val()));
    };

    f();
    $("#idea-form").on("input", () => {
        f();
        $("#idea").show();
    });
});
