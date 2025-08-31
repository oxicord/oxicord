document.addEventListener("DOMContentLoaded", () => {
    const sections = Array.from(document.querySelectorAll(".reveal-container .section-wrapper .section"));

    const onScroll = () => {
        sections.forEach((sec) => {
            if (sec.classList.contains("visible")) return;
            const rect = sec.getBoundingClientRect();
            const height = rect.height || (rect.bottom - rect.top);
            const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
            const ratio = visible / height;
            if (ratio >= 0.3) {
                sec.classList.add("visible");
            };
        });
    };

    document.addEventListener("scroll", onScroll);
    document.addEventListener("resize", onScroll);

    onScroll();
});