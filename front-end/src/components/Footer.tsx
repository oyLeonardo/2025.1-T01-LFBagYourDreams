import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="mt-auto py-12 bg-gradient-to-b from-[#075336] to-[#054028] text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">LF Bag Your Dreams</div>
            <p className="text-[#a2d9c3] text-sm mb-4">
              Bolsas artesanais com propósito e autenticidade
            </p>
            <div className="flex space-x-4">
              {['facebook', 'instagram', 'whatsapp'].map((rede) => (
                <a 
                  key={rede} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-[#4a8c68] flex items-center justify-center hover:bg-[#8FBC8F] transition-colors"
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Produtos</h3>
            <ul className="space-y-2">
              {['Masculino', 'Feminino', 'Infantil', 'Termicas'].map((item) => (
                <li key={item}>
                  <Link  to={`/categoria/${item.toLowerCase()}`} className="text-[#a2d9c3] hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Ajuda</h3>
            <ul className="space-y-2">
              {['Como Personalizar', 'Trocas e Devoluções', 'Perguntas Frequentes', 'Entregas', 'Pagamentos'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#a2d9c3] hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#a2d9c3] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <a href='tel:+556196188709' className="text-[#a2d9c3]">(61) 9618-8709</a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#a2d9c3] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <a href='mailto:lfbagyourdreams@gmail.com' className="text-[#a2d9c3]">lfbagyourdreams@gmail.com</a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#a2d9c3] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-[#a2d9c3]">Brasília, DF - Brasil</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 text-center text-sm border-t border-[#4a8c68]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-[#a2d9c3]">
                © {new Date().getFullYear()} LF Bag Your Dreams. Todos os direitos reservados.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6">
                {['Termos de Uso', 'Política de Privacidade', 'FAQ'].map((item) => (
                  <a key={item} href="#" className="text-[#a2d9c3] hover:text-white transition-colors">{item}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;