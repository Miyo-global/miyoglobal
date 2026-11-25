/** The two registered offices, as printed on /about and /contact and described in their Place JSON-LD. */
export const OFFICES = [
  {
    id: "hyderabad",
    region: "India · Operations HQ",
    city: "Hyderabad",
    lines: ["MIYO Global Office (Trendz Trinity)", "Plot No. 21, Madhapur, Gafoornagar", "Hyderabad, Telangana 500081", "India"],
    note: "Delivery across Bangalore, Pune, Noida, and Chennai.",
    address: {
      streetAddress: "MIYO Global Office (Trendz Trinity), Plot No. 21, Madhapur, Gafoornagar",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500081",
      addressCountry: "IN",
    },
  },
  {
    id: "ras-al-khaimah",
    region: "UAE",
    city: "Ras Al Khaimah",
    lines: ["Prime Assets Education & Training Ltd.", "Office A, RAK DAO Business Centre", "Al Riffa, Sheikh Mohammed Bin Zayed Road", "Ras Al Khaimah, UAE"],
    note: undefined,
    address: {
      streetAddress: "Office A, RAK DAO Business Centre, Al Riffa, Sheikh Mohammed Bin Zayed Road",
      addressLocality: "Ras Al Khaimah",
      addressRegion: "Ras Al Khaimah",
      addressCountry: "AE",
    },
  },
] as const;

/** One Place node per office, each with its PostalAddress, for a page's `pageJsonLd` extra nodes. */
export const officePlaces = (pageUrl: string) =>
  OFFICES.map((o) => ({
    "@type": "Place",
    "@id": `${pageUrl}#office-${o.id}`,
    name: `MIYO Global, ${o.city}`,
    address: { "@type": "PostalAddress", ...o.address },
  }));
