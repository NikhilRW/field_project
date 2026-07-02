import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 bg-[oklch(0.18_0.02_260)] text-white/85">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-11 place-items-center rounded-xl overflow-hidden">
              <img src="/icon.png" alt="Helping Hands" className="size-11 object-contain" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-tight text-white">Helping Hands</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                Samajik Seva Sanstha
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            A registered non-profit dedicated to education, healthcare, food security and
            long-term community development across rural and urban India.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[
              [Instagram, "https://www.instagram.com/Helpinghand7887/"],
              [Youtube, "https://www.youtube.com/@helpinghandsamajiksevasans9500"],
            ].map(([Icon, href], i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Social link"
                className="grid size-9 place-items-center rounded-full bg-white/8 text-white/80 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              ["About Us", "/about"],
              ["Our Programs", "/programs"],
              ["Recent Activities", "/activities"],
              ["Impact Gallery", "/gallery"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link to={href} className="text-white/65 transition-colors hover:text-primary-glow">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Programs</h4>
          <ul className="space-y-2.5 text-sm text-white/65">
            <li>Education Drives</li>
            <li>Health Camps</li>
            <li>Food Distribution</li>
            <li>Women Empowerment</li>
            <li>Disaster Relief</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-white/65">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary-glow" />
              <span>Near Manali Palace, Kalyan West, Maharashtra</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary-glow" />
              <span>+91 88982 35366</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary-glow" />
              <span>sachindilipraut@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Helping Hands · Samajik Seva Sanstha. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span>Designed with <span className="text-primary-glow">♥</span> for social impact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
