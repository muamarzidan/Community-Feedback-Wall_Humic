import { useState } from 'react';
import { Search, Mail, UserPlus } from 'lucide-react';

import Layout from '../../components/Layout';
import AmarProfile from '@/assets/images/profile-amar-about-agora.jpeg';
import FigmaIcon from '@/assets/icons/figma-agora.png';

export default function AboutPage() {
    const teamMembers = [
        {
            name: "Muamar Zidan Tri Antoro",
            alt: "Profile Muamar Zidan Tri Antoro - Agora",
            role: "UI/UX Designer",
            description: "Fokus pada user experience, prototyping, dan sistem desain. Sering menulis dokumentasi & membuat komponen reusable.",
            tools: ["Figma", "Figma", "Figma", "Figma"],
            bgColor: "bg-[#E8F4F8]",
            image: AmarProfile
        },
        {
            name: "Difa Rindang Utari",
            alt: "Profile Difa Rindang Utari - Agora",
            role: "Frontend Developer",
            description: "Membangun antarmuka yang interaktif dan cepat dengan React dan Tailwind CSS.",
            tools: ["React", "Tailwind", "JavaScript"],
            bgColor: "bg-[#F3E8FF]",
            image: AmarProfile
        },
        {
            name: "Rafi Ramadhan",
            alt: "Profile Rafi Ramadhan - Agora",
            role: "Backend Engineer",
            description: "Menangani API, database, dan optimasi performa server-side untuk memastikan integrasi lancar.",
            tools: ["Node.js", "Express", "MongoDB"],
            bgColor: "bg-[#FFE8E8]",
            image: AmarProfile
        },
        {
            name: "Salsabila Nur",
            alt: "Profile Salsabila Nur - Agora",
            role: "Project Manager",
            description: "Mengatur jalannya proyek dan memastikan komunikasi antar tim berjalan efisien.",
            tools: ["Notion", "Figma", "Slack"],
            bgColor: "bg-[#FFF8E8]",
            image: AmarProfile
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');

    // filter hasil pencarian
    const filteredMembers = teamMembers.filter((member) => {
        const term = searchTerm.toLowerCase();
        return (
            member.name.toLowerCase().includes(term) ||
            member.role.toLowerCase().includes(term) ||
            member.tools.some(tool => tool.toLowerCase().includes(term))
        );
    });

    return (
        <Layout>
            <div className="flex flex-col h-full min-h-screen bg-white">
                <main className="px-6 py-8 mx-auto sm:py-12">
                    {/* Header */}
                    <div className="flex flex-col gap-5 text-center">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-bold text-gray-800 sm:text-6xl">
                                <span className='text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-200'>
                                    Our Developer
                                </span>
                            </h1>
                            <p className="text-xs text-black sm:text-xl">
                                Tim yang membangun Agora — dari riset, desain, sampai deploy.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full h-full max-w-lg mx-auto">
                            <Search className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 sm:w-5 sm:h-5 left-4 top-1/2" />
                            <input
                                type="text"
                                placeholder="Search by name, role or skill..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-12 pr-4 border border-gray-300 rounded-lg sm:py-4 sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    {/* Team List */}
                    <div className="mt-6 space-y-5 sm:space-y-16 sm:mt-16">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member, index) => (
                                <div 
                                    key={index}
                                    className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 sm:items-center border sm:border-b sm:border-x-0 sm:border-t-0 rounded-xl sm:rounded-0 border-gray-300 p-4 sm:pb-12`}
                                >
                                    {/* Image Profile */}
                                    <img 
                                        src={member.image}
                                        alt={member.alt}
                                        className="object-cover w-full h-full max-w-17 max-h-17 sm:max-w-[570px] sm:max-h-[414px] flex-shrink-0 rounded-full sm:rounded-none"
                                    />

                                    {/* Content */}
                                    <div className="flex-1 space-y-3 sm:space-y-5">
                                        <div className="hidden px-4 py-2 text-xl font-medium border border-gray-200 rounded-full sm:inline-block text-800">
                                            {member.role}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-sm font-bold text-black sm:text-4xl">
                                                    {member.name}
                                                </h2>
                                                <div className="inline-block px-4 py-2 text-[10px] font-medium border border-gray-200 rounded-full sm:text-xl sm:hidden text-800">
                                                    {member.role}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-900 sm:text-2xl">
                                                {member.description}
                                            </p>
                                        </div>

                                        {/* Tools */}
                                        <div className="space-y-3">
                                            <div className="text-sm font-bold text-black sm:text-2xl">Tools:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {member.tools.map((tool, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="flex items-center gap-2 px-4 py-2 text-xs text-black bg-gray-100 border border-gray-200 rounded-full sm:text-base"
                                                    >
                                                        <img
                                                            src={FigmaIcon}
                                                            alt="Tools Figma - Agora"
                                                            className="object-contain w-4 h-4 sm:h-5 sm:w-5"
                                                        />
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-2">
                                            <button className="flex items-center justify-center w-full gap-2 px-6 py-3 text-xs text-white transition-all rounded-full shadow-sm cursor-pointer sm:w-fit sm:text-xl bg-primary-500 hover:bg-primary-700">
                                                <UserPlus className="w-5 h-5" />
                                                Connect
                                            </button>
                                            <button className="flex items-center justify-center w-full gap-2 px-6 py-3 text-xs transition-all rounded-full cursor-pointer sm:w-fit sm:text-xl text-primary-500 bg-primary-50 hover:bg-primary-100">
                                                <Mail className="w-5 h-5" />
                                                Email
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Search className="w-10 h-10 mb-4 text-gray-400" />
                                <p className="text-gray-500 sm:text-xl">No team members found for “{searchTerm}”.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </Layout>
    );
}
