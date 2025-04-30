import { defineQuery } from "next-sanity";

export const getHomepageQuery = `*[_type == "home"][0]{
  featuredProjects[]->{
    title,
    slug,
    projectNumber,
    featuredImage
  }
}`;

export const getAboutPageQuery = defineQuery(`
  *[_type == "about"][0]{
    aboutText,
    contact {
      titleTranslations,
      email,
      phone
    },
    office {
      titleTranslations,
      address,
      addressUrl
    },
    social {
      instagram
    },
    team {
      titleTranslations,
      coFounders[]{
        name,
        role
      },
      teammates[]{
        name
      },
      teammatesTitleTranslations,
      pastTeammates[]{
        name
      },
      pastTeammatesTitleTranslations
    },
    aboutInfo
  }
`);

export const getProjectsGridQuery = defineQuery(`
  *[_type == "project"] | order(projectNumber asc) {
    title,
    slug,
    projectNumber,
    category, // ← ADD THIS
    thumbnail,
    "projectInfo": builder[_type == "projectInfo"][0]{
      year,
      location,
      program,
      area
    }
  }
`);

export const getSingleProjectQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    title,
    slug,
    projectNumber,
    builder[]{
      // Your dynamic sections like images, text, etc
      ...
    }
  }
`);

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    siteTitle,
    description,
    ogImage,
    logo,
    navLinks,
    languages
  }
`);
