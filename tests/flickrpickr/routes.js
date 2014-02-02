var routes = [];

routes.push({
    generate:"routes.staticpage",
    data: {
        url: [""],
        name: "Homepage"
    }
});

routes.push({
    generate:"routes.staticpage",
    data: {
        url: ["randomFlickr",":query", ":limit"],
        name: "RandFlickr"
    }
});
