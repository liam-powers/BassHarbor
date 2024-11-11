import Button from './components/Button';

export default function Home() {
    return (
        <div>
            <div className="h-screen flex flex-col items-center justify-center">
                <div className="text-white font-body text-center text-lg pb-4">
                    <div className="font-bold">Welcome to Bass* Harbor.</div>
                    Spend less time shopping and more time jamming.
                </div>

                <div className="font-thick">
                    <Button link="/upright" >
                        BROWSE
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 p-4 text-white font-body text-sm">
                <div className="flex flex-row gap-1">
                    <div className="font-bold">*bass</div>
                    (/beɪs/)
                </div>
                <div className="italic">noun</div>
                <div className="italic">1:unanimously named the best instrument family since 1542.</div>
                <div className="font-bold">“Is that a cello?”</div>
            </div>
        </div>
    )
}
