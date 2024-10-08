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
  // New carousel feature
  carousel(containerSelector, options = {}) {
    const container = document.querySelector(containerSelector);
    const slides = Array.from(container.children);
    let currentIndex = 0;

    // Default options
    const defaultOptions = {
      items: options.items || 1, // Number of items to show by default
      responsive: options.responsive || {}, // Breakpoints for responsiveness
      autoplay: options.autoplay || false, // Autoplay option
      autoplayInterval: options.autoplayInterval || 3000, // Autoplay interval
      transitionDuration: options.transitionDuration || 500, // Transition speed
      showNavigation: options.showNavigation || true, // Show navigation
      loop: true, // Enable looping by default
    };

    // Get the number of visible items based on window width
    const getVisibleItems = () => {
      let itemsToShow = defaultOptions.items;
      const windowWidth = window.innerWidth;

      for (const [breakpoint, config] of Object.entries(
        defaultOptions.responsive
      )) {
        if (windowWidth <= breakpoint) {
          itemsToShow = config.items;
        }
      }
      return itemsToShow;
    };

    let visibleItems = getVisibleItems();
    let isTransitioning = false; // Flag to prevent multiple clicks during transition

    // Clone slides for infinite looping effect
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    container.appendChild(firstClone);
    container.insertBefore(lastClone, slides[0]);

    const allSlides = Array.from(container.children); // Update the slide collection

    // Style the container and slides
    container.style.display = "flex";
    container.style.overflow = "hidden";
    container.style.position = "relative";
    container.style.transition = `transform ${defaultOptions.transitionDuration}ms ease`;

    const slideWidth = 100 / visibleItems;

    allSlides.forEach((slide) => {
      slide.style.minWidth = `${slideWidth}%`;
    });

    const updateSlidePosition = () => {
      const offset = -(currentIndex + 1) * (100 / visibleItems);
      container.style.transform = `translateX(${offset}%)`;
    };

    const resetPosition = () => {
      if (currentIndex === allSlides.length - 2) {
        container.style.transition = "none"; // Disable transition for instant change
        currentIndex = 0;
        updateSlidePosition();
        setTimeout(() => {
          container.style.transition = `transform ${defaultOptions.transitionDuration}ms ease`; // Re-enable transition
        });
      } else if (currentIndex === -1) {
        container.style.transition = "none";
        currentIndex = slides.length - 1;
        updateSlidePosition();
        setTimeout(() => {
          container.style.transition = `transform ${defaultOptions.transitionDuration}ms ease`;
        });
      }
    };

    // Initial position (since we have clones)
    updateSlidePosition();

    // Navigation buttons
    if (defaultOptions.showNavigation) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Prev";
      prevButton.classList.add("carousel-prev");
      container.appendChild(prevButton);

      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.classList.add("carousel-next");
      container.appendChild(nextButton);

      prevButton.addEventListener("click", () => moveToSlide(currentIndex - 1));
      nextButton.addEventListener("click", () => moveToSlide(currentIndex + 1));
    }

    const moveToSlide = (index) => {
      if (isTransitioning) return; // Prevent spamming clicks during transition
      isTransitioning = true;
      currentIndex = (index + allSlides.length) % allSlides.length;

      updateSlidePosition();

      container.addEventListener(
        "transitionend",
        () => {
          resetPosition();
          isTransitioning = false; // Allow next transition
        },
        { once: true }
      );
    };

    // Autoplay functionality
    if (defaultOptions.autoplay) {
      setInterval(() => {
        moveToSlide(currentIndex + 1);
      }, defaultOptions.autoplayInterval);
    }
  }
}
