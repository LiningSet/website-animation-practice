const burgerBtn = document.querySelector(".burger");
const navModal = document.querySelector(".nav-section");
const cursor = document.querySelector(".cursor");
const slides = document.querySelectorAll(".slide");
const fashions = document.querySelectorAll(".fashion");
const logo = document.querySelector("#logo");

burgerBtn.addEventListener("click", () => {
  burgerBtn.classList.toggle("active");

  if (burgerBtn.classList.contains("active")) {
    navModal.style.clipPath = "circle(200% at 100% -10%)";
    logo.style.color = "#000";
    document.body.style.overflowY = "hidden";
  } else {
    navModal.style.clipPath = "circle(50px at 100% -10%)";
    logo.style.color = "#fff";
    document.body.style.overflowY = "visible";
  }
});

let controller;
let slideScene;
let pageScene;
let fashionScene;
let fashionFadeoutScene;

function homeInit() {
  controller = new ScrollMagic.Controller();
  slides.forEach((slide, index, slides) => {
    let nextSlide = slides.length - 1 === index ? "nope" : slides[index + 1];
    let revealTL = gsap.timeline({
      defaults: { duration: 1.5, ease: Power2.easeInOut },
    });
    console.log(nextSlide);
    revealTL
      .fromTo(`#${slide.id} .reveal-layer`, { left: "0" }, { left: "100%" })
      .from(`#${slide.id} img`, { scale: 1.5 }, ">-1.5");

    let pageTL = gsap.timeline({
      defaults: { duration: 1.5, ease: Power2.easeInOut },
      reversed: true,
    });

    pageTL
      .fromTo(nextSlide, { y: "0" }, { y: "25%" })
      .fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 })
      .fromTo(nextSlide, { y: "25%" }, { y: "0" }, "-=2");

    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(revealTL)
      .addTo(controller);

    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: "100%",
    })
      .setTween(pageTL)
      .setPin(slide, { pushFollowers: false })
      .addTo(controller);
  });
}

function fashionInit() {
  controller = new ScrollMagic.Controller();
  fashions.forEach((fashion) => {
    let moveFashion = gsap.timeline({
      defaults: { duration: 1, ease: Power2.easeInOut },
    });
    moveFashion.fromTo(
      fashion.querySelector(".img-inner"),
      { x: "100%" },
      { x: 0 }
    );

    let fadeFashion = gsap.timeline({
      defaults: { duration: 1, ease: Power2.easeInOut },
      reversed: true,
    });
    fadeFashion.to(fashion, { opacity: 0 });

    fashionScene = new ScrollMagic.Scene({
      triggerElement: fashion,
      triggerHook: 0.85,
      duration: "100%",
    })
      .setTween(moveFashion)
      .addTo(controller);

    fashionFadeoutScene = new ScrollMagic.Scene({
      triggerElement: fashion,
      triggerHook: 0,
      duration: "100%",
    })
      .setTween(fadeFashion)
      .setPin(fashion, { pushFollowers: false })
      .addTo(controller);
  });
}

//homeInit();
//fashionInit();

//cursor
window.addEventListener("mousemove", (e) => {
  cursor.style.top = `${e.pageY}px`;
  cursor.style.left = `${e.pageX}px`;
});
let layerAssociated;
window.addEventListener("mouseover", (e) => {
  const target = e.target;

  if (target.classList.contains("explore-btn")) {
    layerAssociated = target.closest(".slide").querySelector(".color-layer");
    cursor.classList.add("c-tap");
    layerAssociated.style.height = "100%";
  } else if (target.id === "logo" || target.classList.contains("burger")) {
    cursor.classList.add("c-hover");
  } else {
    cursor.className = "cursor";
    layerAssociated === undefined ? "n" : (layerAssociated.style.height = "0");
  }
});

barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        homeInit();
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        fashionInit();
      },
      beforeLeave() {
        fashionScene.destroy();
        fashionFadeoutScene.destroy();
        controller.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        let tl = gsap.timeline({ defaults: { ease: Power2.inOut } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 }).fromTo(
          ".sheet",
          1,
          { left: "-100%" },
          { left: "0", stagger: 0.25, onComplete: done },
          "-=1"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //scroll up

        window.scrollTo(0, 0);

        //animation
        let tl = gsap.timeline({ defaults: { ease: Power2.inOut } });
        tl.fromTo(
          ".sheet",
          1,
          { left: "0" },
          { left: "100%", stagger: -0.25, onComplete: done }
        )
          .fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 }, "-=0.5")
          .fromTo("header", { y: "-100%" }, { y: 0 }, ">-0.5");
      },
    },
  ],
});
