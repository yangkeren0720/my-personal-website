import { profile } from "@/content/site";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Where a long scroll ends, so the résumé and ways to reach Eva are here too.
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </span>
        <span className="footer-links">
          {profile.resumeUrl && (
            <a href={`${base}${profile.resumeUrl}`} download>
              Résumé (PDF)
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
