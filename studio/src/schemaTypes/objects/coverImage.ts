import { defineField, defineType } from "sanity"
import { ImageIcon } from "@sanity/icons"

export const coverImage = defineType({
  name: "coverImage",
  title: "Imatge a pantalla completa",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "image",
      title: "Imatge",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "mobileImage",
      title: "Imatge móvil",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "altText",
      title: "Text alternatiu",
      type: "object",
      fields: [
        defineField({ name: "ca", title: "Català", type: "string" }),
        defineField({ name: "es", title: "Español", type: "string" }),
        defineField({ name: "en", title: "English", type: "string" }),
      ],
      validation: (Rule) => Rule.required().error("El text alternatiu és obligatori"),
    }),
    defineField({
      name: "hasPadding",
      title: "Té marge",
      type: "boolean",
      description: "Afegeix marge a la part superior i inferior de la imatge",
    }),
    defineField({
      name: "bottomText",
      title: "Text inferior",
      type: "object",
      description: "Aquest camp és opcional. Si no s'afegeix cap text, no es mostrarà.",
      fields: [
        defineField({ name: "ca", title: "Català", type: "text" }),
        defineField({ name: "es", title: "Español", type: "text" }),
        defineField({ name: "en", title: "English", type: "text" }),
      ],
    }),
  ],
  preview: {
    select: {
      media: "image",
      title: "altText.ca",
      hasPadding: "hasPadding",
    },
    prepare({ media, title, hasPadding }) {
      return {
        title: title || "Imatge a pantalla completa",
        subtitle: `${title ? "" : "Sense text alternatiu"}${hasPadding ? " • Amb marge" : ""}`,
        media: media || ImageIcon,
      }
    },
  },
})