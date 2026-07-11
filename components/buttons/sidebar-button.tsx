import Image from "next/image";
import EyeIcon from '../../public/eye-icon.svg'

type SidebarButtonProps = {
    onClick: () => void;
};

export default function SidebarButton({ onClick }: SidebarButtonProps) {

    return(
        <button 
        onClick={onClick}
        type="button"
        className="w-14.5 h-12 rounded-r-full bg-[#635FC7] grid place-items-center fixed bottom-25 cursor-pointer z-[100]">
            <Image 
                height={24}
                width={24}
                src={EyeIcon}
                alt="Show Sidebar"
            />
        </button>
    )
}