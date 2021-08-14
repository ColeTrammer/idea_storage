$(document).ready(() => {
    const f = () => {
        $("#preview-category").html($("#category").val());
        $("#preview-title").html($("#title").val());
        $("#preview-content").html(marked($("#content").val()));
    };

    f();
    $("#idea").on("input", () => {
        f();
        $("#preview").show();
    });
});
