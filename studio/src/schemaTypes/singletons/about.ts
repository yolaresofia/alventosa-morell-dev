import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const about = defineType({
  name: "about",
  title: "Sobre Nosaltres",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "aboutText",
      title: "About Text",
      type: "object",
      fields: [
        defineField({ name: "ca", title: "Català", type: "blockContent" }),
        defineField({ name: "en", title: "English", type: "blockContent" }),
        defineField({ name: "es", title: "Español", type: "blockContent" }),
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      fields: [
        defineField({
          name: "titleTranslations",
          title: "Contact Title Translations",
          type: "object",
          fields: [
            defineField({ name: "ca", title: "Català", type: "string" }),
            defineField({ name: "en", title: "English", type: "string" }),
            defineField({ name: "es", title: "Español", type: "string" }),
          ],
        }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
      ],
    }),
    defineField({
      name: "office",
      title: "Office",
      type: "object",
      fields: [
        defineField({
          name: "titleTranslations",
          title: "Office Title Translations",
          type: "object",
          fields: [
            defineField({ name: "ca", title: "Català", type: "string" }),
            defineField({ name: "en", title: "English", type: "string" }),
            defineField({ name: "es", title: "Español", type: "string" }),
          ],
        }),
        defineField({ name: "address", title: "Address", type: "blockContent" }),
        defineField({ name: "addressUrl", title: "Address URL", type: "link" }),
      ],
    }),
    defineField({
      name: "social",
      title: "Social Media",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram", type: "link" }),
      ],
    }),
    defineField({
      name: "team",
      title: "Team",
      type: "object",
      fields: [
        defineField({
          name: "titleTranslations",
          title: "Team Title Translations",
          type: "object",
          fields: [
            defineField({ name: "ca", title: "Català", type: "string" }),
            defineField({ name: "en", title: "English", type: "string" }),
            defineField({ name: "es", title: "Español", type: "string" }),
          ],
        }),
        defineField({
          name: "coFounders",
          title: "Co-Founders",
          type: "array",
          of: [
            defineField({
              name: "coFounder",
              title: "Co-Founder",
              type: "object",
              fields: [
                defineField({ name: "name", title: "Name", type: "string" }),
                defineField({
                  name: "role",
                  title: "Role",
                  type: "object",
                  fields: [
                    defineField({ name: "ca", title: "Català", type: "string" }),
                    defineField({ name: "en", title: "English", type: "string" }),
                    defineField({ name: "es", title: "Español", type: "string" }),
                  ],
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "teammates",
          title: "Teammates",
          type: "array",
          of: [
            defineField({
              name: "teammate",
              title: "Teammate",
              type: "object",
              fields: [
                defineField({ name: "name", title: "Name", type: "string" }),
              ],
            }),
          ],
        }),
        defineField({
          name: "teammatesTitleTranslations",
          title: "Teammates Title Translations",
          type: "object",
          fields: [
            defineField({ name: "ca", title: "Català", type: "string" }),
            defineField({ name: "en", title: "English", type: "string" }),
            defineField({ name: "es", title: "Español", type: "string" }),
          ],
        }),
        defineField({
          name: "pastTeammates",
          title: "Past Teammates",
          type: "array",
          of: [
            defineField({
              name: "pastTeammate",
              title: "Past Teammate",
              type: "object",
              fields: [
                defineField({ name: "name", title: "Name", type: "string" }),
              ],
            }),
          ],
        }),
        defineField({
          name: "pastTeammatesTitleTranslations",
          title: "Past Teammates Title Translations",
          type: "object",
          fields: [
            defineField({ name: "ca", title: "Català", type: "string" }),
            defineField({ name: "en", title: "English", type: "string" }),
            defineField({ name: "es", title: "Español", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "aboutInfo",
      title: "About Info",
      type: "object",
      fields: [
        defineField({ name: "ca", title: "Català", type: "blockContent" }),
        defineField({ name: "en", title: "English", type: "blockContent" }),
        defineField({ name: "es", title: "Español", type: "blockContent" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
      };
    },
  },
});
