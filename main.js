class DesignerGuide {
  constructor() {}
  mouseMove(styles) {
    const body = document.querySelector("body");
    const mover = document.createElement("div");

    // Apply styles including transition
    Object.assign(mover.style, {
      ...styles,
      transition: "left 0.1s ease, top 0.1s ease",
      position: "absolute",
      pointerEvents: "none",
    });

    // Append the div to the body
    body.appendChild(mover);

    document.addEventListener("mousemove", (event) => {
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        mover.style.left = `${event.clientX - 10}px`;
        mover.style.top = `${event.clientY - 13}px`;
      });
    });
  }
}
