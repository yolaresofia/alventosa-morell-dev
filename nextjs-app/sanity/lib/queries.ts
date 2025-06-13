import { defineQuery } from "next-sanity";

export const getHomepageQuery = `*[_type == "home"][0]{
  featuredProjects[]->{
    title,
    slug,
    projectNumber,
    featuredImage,
    mobileFeaturedImage
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
    aboutInfo,
    awards {
      titleTranslations,
      list[]{
        title
      }
    },
    cv[]{
      title,
      file {
        asset->{
          url
        }
      }
    }
  }
`);

export const getProjectsGridQuery = defineQuery(`
  *[_type == "project"] | order(projectNumber asc) {
    title,
    slug,
    projectNumber,
    category,
    notClickableInIndex,
    thumbnail,
    "projectInfo": builder[_type == "projectInfo"][0]{
      year,
      location,
      program,
      area,
    }
  }
`);

export const getSingleProjectQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    title,
    slug,
    projectNumber,
    builder[]{
      ...,
      _type == "coverVideo" => {
        _type,
        _key,
        altText,
        vimeoUrl
      }
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
