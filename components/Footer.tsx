import { profile } from "@/content/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="footer-dim">Built with Next.js and Framer Motion</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
