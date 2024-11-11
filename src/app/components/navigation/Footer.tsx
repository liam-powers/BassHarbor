import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="fixed min-w-full flex justify-end bottom-0 p-4">
            <Link href="https://github.com/liam-powers" rel="noopener noreferrer" target="_blank">
                <div className="flex items-center gap-1">
                    <Image src="/github.png" width={50} height={50} alt="github logo" />
                    <div>
                        Liam&apos;s GitHub
                    </div>
                </div>
            </Link>
        </footer>
    )
}