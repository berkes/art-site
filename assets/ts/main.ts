// Utils
function requireHTMLElement(selector: string, parent: Element): HTMLElement {
  const element = parent.querySelector(selector);
  if (!element) throw new Error(`Element not found: ${selector}`);
  return element as HTMLElement;
}
function requireHTMLElementById(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Element not found: ${id}`);
  return element as HTMLElement;
}

class Carousel {
  private container: HTMLElement;
  private slideList: SlideList;

  constructor(selector: string) {
    this.container = document.querySelector(selector);
    if (!this.container) throw new Error(`Element not found: ${selector}`);

    const slides = Array.from(this.container.querySelectorAll(".slide"))
      .filter((el): el is HTMLElement => el instanceof HTMLElement)
      .map((slideElement) => {
        return new Slide(slideElement);
      });
    this.slideList = new SlideList(slides);

    // Navigation buttons
    const prevButton = this.container.querySelector(".nav.prev");
    const nextButton = this.container.querySelector(".nav.next");

    prevButton?.addEventListener("click", () => this.navigateBackward());
    nextButton?.addEventListener("click", () => this.navigateForward());
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
    this.updateSlidePositions(true, oldCurrent, 'left');
    return this.currentSlide;
  }

  public navigateBackward(): Slide {
    const oldCurrent = this.currentSlide;
    this.decrementCurrentIndex();
    this.updateSlidePositions(true, oldCurrent, 'right');
    return this.currentSlide;
  }
  
  private incrementCurrentIndex(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }
  
  private decrementCurrentIndex(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }
  
  private updateSlidePositions(animate: boolean, oldSlide?: Slide, exitDirection?: 'left' | 'right'): void {
    if (!animate) {
      // Clear all slides without animation (for initialization)
      this.clearAllSlidesWithoutAnimation();
    } else if (oldSlide && exitDirection) {
      // Animate the old slide out
      if (exitDirection === 'left') {
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
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    return this.slides[prevIndex];
  }
  
  private get farRightSlide(): Slide {
    const farRightIndex = (this.currentIndex + 2) % this.slides.length;
    return this.slides[farRightIndex];
  }
  
  private get farLeftSlide(): Slide {
    const farLeftIndex = (this.currentIndex - 2 + this.slides.length) % this.slides.length;
    return this.slides[farLeftIndex];
  }
}

class Slide {
  private static readonly POSITION_CLASSES = ["active", "left", "right", "far-left", "far-right"] as const;
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

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Carousel(".work-carousel");
});
