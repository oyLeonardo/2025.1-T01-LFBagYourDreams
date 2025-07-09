import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import CartDrawer from './Carrinho';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Masculino', path: '/categoria/masculino' },
        { name: 'Feminino', path: '/categoria/feminino' },
        { name: 'Infantil', path: '/categoria/infantil' },
        { name: 'Termicas', path: '/categoria/termicas' },
    ];

    const UserIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    return (
        <>
            {/* Top Bar - Fundo branco com logo verde */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo com espessura reduzida (font-bold) e alinhada à esquerda */}
                        <div className="flex-shrink-0 flex items-center ml-0">
                            <div className="text-[#075336] font-['Playfair_Display'] font-bold text-2xl select-none">
                                LF Bag Your Dreams
                            </div>
                        </div>

                        {/* Barra de Busca (Central) - Visível apenas em desktop */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-6">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Pesquisar produtos..."
                                    className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Ícones e Admin (Desktop) */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            <NavLink 
                                to="/conta" 
                                className="text-gray-700 hover:text-[#075336] p-2"
                            >
                                <UserIcon />
                            </NavLink>

                        <div className="ml-1">
                            <CartDrawer />
                        </div>

                        <NavLink
                            to="/admin"
                            className="px-3 py-1.5 bg-[#075336] text-white rounded-md hover:bg-[#053c27] transition-colors text-sm font-medium"
                        >
                                Admin
                            </NavLink>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden items-center">
                            {/* Ícone de busca mobile */}
                            <button className="mr-3 text-gray-700 hover:text-[#075336]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            
                            <div className="mr-2">
                                <CartDrawer />
                            </div>
                            
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navbar Separado - Fundo branco com letras pretas */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="hidden md:flex justify-center space-x-10">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                children={({ isActive }) => (
                                    <div className="group relative">
                                        <span className={`px-3 py-4 text-sm font-semibold transition-colors duration-300 block
                                            ${isActive ? 'text-green-800' : 'text-gray-800 hover:text-green-700'}`}>
                                            {link.name}
                                        </span>
                                        <span className="absolute bottom-3 left-0 right-0 h-0.5 bg-green-700 transform transition-all duration-300 origin-center scale-x-0 group-hover:scale-x-100"></span>
                                        <span className={`absolute bottom-3 left-0 right-0 h-0.5 bg-green-700 transform transition-all duration-300 origin-center ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                </div>
            </nav>

            {/* Menu Mobile */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-inner">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {/* Barra de busca mobile no menu */}
                        <div className="px-2 py-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive
                                            ? 'text-[#075336] bg-green-100'
                                            : 'text-gray-700 hover:text-[#075336] hover:bg-gray-100'
                                    }`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        <NavLink
                            to="/conta"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#075336] hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Minha Conta
                        </NavLink>

                        <NavLink
                            to="/admin"
                            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-[#075336] hover:bg-green-800"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Área Admin
                        </NavLink>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;