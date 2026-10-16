/**
 * Portfolio Data Outline — Wilson Lee
 *
 * Replace the placeholder paths (`assets/images/...`) and text fields below
 * with your own photographs, project screenshots, and achievement descriptions.
 */

export const portfolioData = {
  profile: {
    name: "Wilson Lee",
    photoUrl: "assets/images/profile/avatar.svg",
    description:
      "Description text — Add your personal bio, engineering background, photography focus, and key achievements here. You can write a few sentences about what you build, what you shoot, and how to reach you.",
    links: [
      { label: "GitHub", url: "https://github.com/ATraptheBob" },
      { label: "Email", url: "mailto:wleebobledestructeur@gmail.com" }
    ]
  },

  engineering: {
    // Top row of floating, off-kilter project cards (matches top 5 frames in sketch)
    topCards: [
      {
        id: "eng-01",
        title: "Engineering Project 01",
        caption: "Achievement or technical milestone",
        img: "assets/images/engineering/01.svg",
        angle: -9.5,
        offsetY: -6,
        offsetX: 0,
        zIndex: 2
      },
      {
        id: "eng-02",
        title: "Engineering Project 02",
        caption: "Systems architecture & build",
        img: "assets/images/engineering/02.svg",
        angle: 10.5,
        offsetY: 16,
        offsetX: -18,
        zIndex: 3
      },
      {
        id: "eng-03",
        title: "Engineering Project 03",
        caption: "Core hardware / software design",
        img: "assets/images/engineering/03.svg",
        angle: -0.5,
        offsetY: -8,
        offsetX: -14,
        zIndex: 1
      },
      {
        id: "eng-04",
        title: "Engineering Project 04",
        caption: "Prototype & performance results",
        img: "assets/images/engineering/04.svg",
        angle: 17.5,
        offsetY: 22,
        offsetX: -16,
        zIndex: 4
      },
      {
        id: "eng-05",
        title: "Engineering Project 05",
        caption: "Research & implementation",
        img: "assets/images/engineering/05.svg",
        angle: 0.4,
        offsetY: -4,
        offsetX: -10,
        zIndex: 2
      }
    ],

    // Middle band of floating off-kilter text blocks (matches "Text here" in sketch)
    floatingTexts: [
      {
        id: "eng-text-1",
        text: "Text here",
        subtext: "Replace with your engineering achievements, build notes, or project summary.",
        angle: -2.4,
        offsetY: 0
      },
      {
        id: "eng-text-2",
        text: "text here",
        subtext: "Replace with technical highlights, awards, or key systems you have designed.",
        angle: -3.2,
        offsetY: 14
      }
    ],

    // Bottom row of floating, off-kilter project cards (matches bottom cluster in sketch)
    bottomCards: [
      {
        id: "eng-06",
        title: "Engineering Project 06",
        caption: "Mechanical / embedded system",
        img: "assets/images/engineering/06.svg",
        angle: -4.2,
        offsetY: 12,
        offsetX: 0,
        zIndex: 2
      },
      {
        id: "eng-07",
        title: "Engineering Project 07",
        caption: "Experimental validation",
        img: "assets/images/engineering/07.svg",
        angle: 13.5,
        offsetY: -4,
        offsetX: -16,
        zIndex: 3
      },
      {
        id: "eng-08",
        title: "Engineering Project 08",
        caption: "Component detail",
        img: "assets/images/engineering/08.svg",
        angle: 1.8,
        offsetY: 18,
        offsetX: -26,
        size: "compact",
        zIndex: 5
      },
      {
        id: "eng-09",
        title: "Engineering Project 09",
        caption: "Production deployment",
        img: "assets/images/engineering/09.svg",
        angle: -0.6,
        offsetY: -6,
        offsetX: -22,
        zIndex: 2
      },
      {
        id: "eng-10",
        title: "Engineering Project 10",
        caption: "Benchmarks & telemetry",
        img: "assets/images/engineering/10.svg",
        angle: 19.5,
        offsetY: 24,
        offsetX: -18,
        zIndex: 4
      }
    ]
  },

  photography: {
    // Same spatial layout and angles so both tabs share an identical theme/structure
    topCards: [
      {
        id: "photo-01",
        title: "Photograph 01",
        caption: "35mm — Location / Date",
        img: "assets/images/photography/01.svg",
        angle: -9.5,
        offsetY: -6,
        offsetX: 0,
        zIndex: 2
      },
      {
        id: "photo-02",
        title: "Photograph 02",
        caption: "Natural light study",
        img: "assets/images/photography/02.svg",
        angle: 10.5,
        offsetY: 16,
        offsetX: -18,
        zIndex: 3
      },
      {
        id: "photo-03",
        title: "Photograph 03",
        caption: "Street & architecture",
        img: "assets/images/photography/03.svg",
        angle: -0.5,
        offsetY: -8,
        offsetX: -14,
        zIndex: 1
      },
      {
        id: "photo-04",
        title: "Photograph 04",
        caption: "Evening exposure",
        img: "assets/images/photography/04.svg",
        angle: 17.5,
        offsetY: 22,
        offsetX: -16,
        zIndex: 4
      },
      {
        id: "photo-05",
        title: "Photograph 05",
        caption: "Landscape composition",
        img: "assets/images/photography/05.svg",
        angle: 0.4,
        offsetY: -4,
        offsetX: -10,
        zIndex: 2
      }
    ],

    floatingTexts: [
      {
        id: "photo-text-1",
        text: "Text here",
        subtext: "Replace with notes on your photography, gear, or favorite locations.",
        angle: -2.4,
        offsetY: 0
      },
      {
        id: "photo-text-2",
        text: "text here",
        subtext: "Replace with exhibition notes, visual stories, or selected series.",
        angle: -3.2,
        offsetY: 14
      }
    ],

    bottomCards: [
      {
        id: "photo-06",
        title: "Photograph 06",
        caption: "Monochrome frame",
        img: "assets/images/photography/06.svg",
        angle: -4.2,
        offsetY: 12,
        offsetX: 0,
        zIndex: 2
      },
      {
        id: "photo-07",
        title: "Photograph 07",
        caption: "Motion & shadow",
        img: "assets/images/photography/07.svg",
        angle: 13.5,
        offsetY: -4,
        offsetX: -16,
        zIndex: 3
      },
      {
        id: "photo-08",
        title: "Photograph 08",
        caption: "Detail study",
        img: "assets/images/photography/08.svg",
        angle: 1.8,
        offsetY: 18,
        offsetX: -26,
        size: "compact",
        zIndex: 5
      },
      {
        id: "photo-09",
        title: "Photograph 09",
        caption: "Quiet horizon",
        img: "assets/images/photography/09.svg",
        angle: -0.6,
        offsetY: -6,
        offsetX: -22,
        zIndex: 2
      },
      {
        id: "photo-10",
        title: "Photograph 10",
        caption: "Late afternoon",
        img: "assets/images/photography/10.svg",
        angle: 19.5,
        offsetY: 24,
        offsetX: -18,
        zIndex: 4
      }
    ]
  }
};
