import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const linkCSS = "hover:text-pastel-red";
    const links = [
        {
            label: "home",
            href: "/"
        },
        {
            label: "browse",
            href: "/upright",
        },
        {
            label: "about",
            href: "/about",
        }
    ]

    return (
        <div>
            <div className="w-full absolute italic top-0 pt-4 pl-4">
                <div className="flex flex-row gap-4 items-center">
                    {links.map((link) => (
                        <Link key={link.label} href={link.href} className={linkCSS}>
                            {link.label}
                        </Link>
                    ))
                    }
                </div>
            </div>
            <div className="absolute right-0 p-4">
                <Image src="/ship.png" width={50} height={50} alt="BH logo" />
            </div>
        </div>
    );
}