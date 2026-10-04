import { Phone, MessageCircle, Megaphone } from "lucide-react";

/*
  Requires lucide-react: npm install lucide-react

  Update the WhatsApp chat link and the WhatsApp channel link (both currently "#")
  once you have the real numbers/links.
*/

const NAVY = "#0A1F44";
const WHATSAPP_GREEN = "#25D366";

function ContactItem({ icon, iconColor, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
      style={{ color: NAVY }}
    >
      <span
        className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
        style={{ backgroundColor: `${iconColor}1A` }}
      >
        {icon}
      </span>
      {label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer>
      <div className="bg-[#F3F4F6] px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
          <p className="text-base font-semibold" style={{ color: NAVY }}>
            Have a doubt? Contact a Student Counselor
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <ContactItem
              icon={<Phone size={18} color={NAVY} />}
              iconColor={NAVY}
              label="Call us +94 11 754 4801"
              href="tel:+94117544801"
            />
            <ContactItem
              icon={<MessageCircle size={18} color={WHATSAPP_GREEN} />}
              iconColor={WHATSAPP_GREEN}
              label="Chat with us"
              href="https://api.whatsapp.com/send?phone=94117544801"
            />
            <ContactItem
              icon={<Megaphone size={18} color={WHATSAPP_GREEN} />}
              iconColor={WHATSAPP_GREEN}
              label="Join for admission updates"
              href="https://www.whatsapp.com/channel/0029Vb7cSon6GcGMD44O4i38"
            />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: NAVY }} className="px-6 py-4">
        <p className="text-center text-xs text-white">
          © 2026 All Rights Reserved. Web Design and Development by Manditha
        </p>
      </div>
    </footer>
  );
}
