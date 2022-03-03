$(() => {
    $("#idea-content").html(marked.parse($("#idea-content").html()));
});
