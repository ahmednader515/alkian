import Image from "next/image";

export const DashboardBanner = () => {
    return (
        <div className="w-full relative">
            <Image
                src="/dashboard-banner.png"
                alt="Dashboard Banner"
                width={1920}
                height={400}
                className="w-full h-auto object-cover"
                priority
                unoptimized
            />
        </div>
    );
};

