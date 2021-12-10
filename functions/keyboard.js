export const onKeyPress = (event, router) => {
    const searchInput = document.getElementById("search")

    if (searchInput !== document.activeElement) {
        if (event.key === "N") {
            router.push("/new")
        }
    }
}
