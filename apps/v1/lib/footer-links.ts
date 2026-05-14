export interface FooterLink {
    name: string;
    ref: string;
    visibleOn: string[];
}

export const footerLinks: FooterLink[] = [
    { name: "Linkedin", ref: "https://www.linkedin.com/in/maxime-duhamel/", visibleOn: ["/projects"] },
    { name: "RSS feed", ref: "/rss", visibleOn: ["/blog"] },
    { name: "Youtube", ref: "https://www.youtube.com/@maximeduh", visibleOn: ["/projects"] },
    { name: "Github", ref: "https://github.com/Phenixis", visibleOn: ["/"] },
    { name: "X", ref: "https://twitter.com/maxime_duhamel_", visibleOn: ["/projects"] },
];
