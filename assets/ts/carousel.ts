/**
 * Carousel class
 *
 * Makes a caroussel from a list of slides. Custom made for art-site
 */
class Carousel {
  private container: HTMLElement;
  private slideList: SlideList;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private readonly SWIPE_THRESHOLD = 50; // Minimum distance in pixels to trigger swipe

  /**
   * Creates a new Carousel instance.
   *
   * @param selector - A CSS selector string for the carousel container element.
   *                   The container must exist in the DOM.
   * @param slideSelector - A CSS selector string for the slide elements.
   *                        These must be direct or descendant children of the container.
   * @param navPrevSelector - A CSS selector string for the "previous" navigation button.
   *                          This button must be a child of the container.
   * @param navNextSelector - A CSS selector string for the "next" navigation button.
   *                          This button must be a child of the container.
   *
   * All selectors must refer to elements that are children (direct or indirect) of the container element.
   */
  constructor(
    selector: string,
    slideSelector: string,
    navPrevSelector: string,
    navNextSelector: string,
  ) {
    this.container = document.querySelector(selector);
    if (!this.container) throw new Error(`Element not found: ${selector}`);

    // Select all slide elements that are children of the container
    const slides = Array.from(this.container.querySelectorAll(slideSelector))
      .filter((el): el is HTMLElement => el instanceof HTMLElement)
      .map((slideElement: HTMLElement) => {
        return new Slide(slideElement);
      });
    this.slideList = new SlideList(slides);

    // Select navigation buttons that are children of the container
    const prevButton = this.container.querySelector(navPrevSelector);
    const nextButton = this.container.querySelector(navNextSelector);

    prevButton?.addEventListener("click", () => this.navigateBackward());
    nextButton?.addEventListener("click", () => this.navigateForward());

    this.container.addEventListener("touchstart", (e) => this.handleTouchStart(e), { passive: true });
    this.container.addEventListener("touchend", (e) => this.handleTouchEnd(e), { passive: true });
  }

  private handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  private handleTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const swipeDistance = this.touchStartX - this.touchEndX;

    // Swipe left (next)
    if (swipeDistance > this.SWIPE_THRESHOLD) {
      this.navigateForward();
    }
    // Swipe right (previous)
    else if (swipeDistance < -this.SWIPE_THRESHOLD) {
      this.navigateBackward();
    }
  }

  private navigateForward(): void {
    this.slideList.navigateForward();
  }

  private navigateBackward(): void {
    this.slideList.navigateBackward();
  }
}

class SlideList {
  private slides: Slide[];
  private currentIndex: number;

  constructor(slides: Slide[]) {
    if (slides.length < 5) {
      throw new Error("SlideList must have at least 5 slides");
    }

    this.slides = slides;
    this.currentIndex = 0;

    this.updateSlidePositions(false);
  }

  public navigateForward(): Slide {
    const oldCurrent = this.currentSlide;
    this.incrementCurrentIndex();
    this.updateSlidePositions(true, oldCurrent, "left");
    return this.currentSlide;
  }

  public navigateBackward(): Slide {
    const oldCurrent = this.currentSlide;
    this.decrementCurrentIndex();
    this.updateSlidePositions(true, oldCurrent, "right");
    return this.currentSlide;
  }

  private incrementCurrentIndex(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  private decrementCurrentIndex(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  private updateSlidePositions(
    animate: boolean,
    oldSlide?: Slide,
    exitDirection?: "left" | "right",
  ): void {
    if (!animate) {
      // Clear all slides without animation (for initialization)
      this.clearAllSlidesWithoutAnimation();
    } else if (oldSlide && exitDirection) {
      // Animate the old slide out
      if (exitDirection === "left") {
        oldSlide.moveLeft(true);
      } else {
        oldSlide.moveRight(true);
      }
    }

    // Set new positions
    // Current slide should animate in
    this.currentSlide.moveIntoView(animate);

    // Next and prev slides should move instantly (no animation) to avoid wrapping animation
    // But skip the old slide if it's the same as next or prev (it's already being animated)
    if (this.nextSlide !== oldSlide) {
      this.nextSlide.moveRight(false);
    }
    if (this.prevSlide !== oldSlide) {
      this.prevSlide.moveLeft(false);
    }

    // Far slides should be hidden off-screen
    this.farRightSlide.moveFarRight(false);
    this.farLeftSlide.moveFarLeft(false);
  }

  private clearAllSlidesWithoutAnimation(): void {
    for (const slide of this.slides) {
      slide.clearPositionWithoutAnimation();
    }
  }

  private get currentSlide(): Slide {
    return this.slides[this.currentIndex];
  }

  private get nextSlide(): Slide {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    return this.slides[nextIndex];
  }

  private get prevSlide(): Slide {
    const prevIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    return this.slides[prevIndex];
  }

  private get farRightSlide(): Slide {
    const farRightIndex = (this.currentIndex + 2) % this.slides.length;
    return this.slides[farRightIndex];
  }

  private get farLeftSlide(): Slide {
    const farLeftIndex =
      (this.currentIndex - 2 + this.slides.length) % this.slides.length;
    return this.slides[farLeftIndex];
  }
}

class Slide {
  private static readonly POSITION_CLASSES = [
    "active",
    "left",
    "right",
    "far-left",
    "far-right",
  ] as const;
  private static readonly ACTIVE_CLASS = "active";
  private static readonly LEFT_CLASS = "left";
  private static readonly RIGHT_CLASS = "right";
  private static readonly FAR_LEFT_CLASS = "far-left";
  private static readonly FAR_RIGHT_CLASS = "far-right";
  private static readonly NO_TRANSITION_CLASS = "no-transition";

  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public moveIntoView(animate: boolean = true): void {
    this.setPositionClass(Slide.ACTIVE_CLASS, animate);
  }

  public moveLeft(animate: boolean = true): void {
    this.setPositionClass(Slide.LEFT_CLASS, animate);
  }

  public moveRight(animate: boolean = true): void {
    this.setPositionClass(Slide.RIGHT_CLASS, animate);
  }

  public moveFarLeft(animate: boolean = true): void {
    this.setPositionClass(Slide.FAR_LEFT_CLASS, animate);
  }

  public moveFarRight(animate: boolean = true): void {
    this.setPositionClass(Slide.FAR_RIGHT_CLASS, animate);
  }

  public clearPosition(): void {
    this.removeAllPositionClasses();
  }

  public clearPositionWithoutAnimation(): void {
    this.disableTransition();
    this.removeAllPositionClasses();
    this.forceReflow();
    this.enableTransition();
  }

  private setPositionClass(className: string, animate: boolean): void {
    if (!animate) {
      this.disableTransition();
    }

    this.removeAllPositionClasses();
    this.element.classList.add(className);

    if (!animate) {
      this.forceReflow();
      this.enableTransition();
    }
  }

  private removeAllPositionClasses(): void {
    this.element.classList.remove(...Slide.POSITION_CLASSES);
  }

  private disableTransition(): void {
    this.element.classList.add(Slide.NO_TRANSITION_CLASS);
  }

  private enableTransition(): void {
    this.element.classList.remove(Slide.NO_TRANSITION_CLASS);
  }

  private forceReflow(): void {
    // Force browser reflow to apply no-transition class before removing it
    void this.element.offsetHeight;
  }
}

export { Carousel };
