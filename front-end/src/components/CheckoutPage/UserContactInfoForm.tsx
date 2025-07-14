// src/components/UserContactInfoForm.tsx
import React, { type ChangeEvent } from 'react';
import { type MercadoPagoIdentificationType, type FormErrors } from '../../types/mercadopago.ts'; // Importe os tipos necessários

interface UserContactInfoFormProps {
  nome: string;
  email: string;
  cpf: string; // Mantém CPF aqui, mas será mapeado para docNumber
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  docType: string; // Novo campo para o MP
  docTypes: MercadoPagoIdentificationType[]; // Tipos de documento do MP
  mercadoPagoLoaded: boolean; // ADICIONADO: para controlar o disabled do docType
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCpfChange: (value: string) => void;
  onTelefoneChange: (value: string) => void;
  onCepChange: (value: string) => void;
  onEmailBlur: () => void;
  onCpfBlur: () => void;
  onTelefoneBlur: () => void;
  errors: FormErrors;
}

const UserContactInfoForm: React.FC<UserContactInfoFormProps> = ({
  nome,
  email,
  cpf,
  telefone,
  cep,
  endereco,
  numero,
  complemento,
  cidade,
  estado,
  docType, // MP
  docTypes, // MP
  mercadoPagoLoaded, // USADO AQUI
  onInputChange,
  onCpfChange,
  onTelefoneChange,
  onCepChange,
  onEmailBlur,
  onCpfBlur,
  onTelefoneBlur,
  errors
}) => {
  return (
    <div className="border-b border-[#e0e8e0] pb-8">
      <div className="flex items-center mb-6">
        <div className="bg-[#8FBC8F] w-8 h-8 rounded-full flex items-center justify-center mr-3">
          <span className="text-white">1</span>
        </div>
        <h2 className="text-xl font-bold text-[#075336]">
          Dados de Entrega
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campo Nome */}
        <div className="md:col-span-2">
          <label htmlFor="nome" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            id="nome"
            name="nome" // Adicionado name
            value={nome}
            onChange={onInputChange}
            className={`w-full rounded-xl border ${errors.nome ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="Seu nome completo"
            required
          />
          {errors.nome && <p className="mt-1 text-red-500 text-sm">{errors.nome}</p>}
        </div>

        {/* Campo Email */}
        <div className="md:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email" // Adicionado name
            value={email}
            onChange={onInputChange}
            onBlur={onEmailBlur}
            className={`w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="seu.email@exemplo.com"
          />
          {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
          <p className="mt-1 text-xs text-[#5d7a6d]">Opcional: para receber atualizações do pedido</p>
        </div>

        {/* Campo Tipo de Documento (para MP) */}
        <div>
          <label htmlFor="docType" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            Tipo de Documento *
          </label>
          <select
            id="docType"
            name="docType"
            value={docType}
            onChange={onInputChange}
            className={`w-full rounded-xl border ${errors.docType ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            required
            disabled={!mercadoPagoLoaded || docTypes.length === 0} // ADICIONADO: controle de disabled
          >
            {docTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          {errors.docType && <p className="mt-1 text-red-500 text-sm">{errors.docType}</p>}
        </div>

        {/* Campo CPF (agora mapeado para docNumber) */}
        <div>
          <label htmlFor="docNumber" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            CPF / Documento *
          </label>
          <input
            type="text"
            id="docNumber" // Mudado de 'cpf' para 'docNumber' para consistência com MP
            name="docNumber" // Adicionado name
            value={cpf} // Mantém o estado `cpf` para formatação
            onChange={(e) => onCpfChange(e.target.value)}
            onBlur={onCpfBlur}
            className={`w-full rounded-xl border ${errors.docNumber ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="000.000.000-00"
            required
          />
          {errors.docNumber && <p className="mt-1 text-red-500 text-sm">{errors.docNumber}</p>}
        </div>

        {/* Campo Telefone */}
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            Telefone *
          </label>
          <input
            type="text"
            id="telefone"
            name="telefone" // Adicionado name
            value={telefone}
            onChange={(e) => onTelefoneChange(e.target.value)}
            onBlur={onTelefoneBlur}
            className={`w-full rounded-xl border ${errors.telefone ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="(00) 00000-0000"
            required
          />
          {errors.telefone && <p className="mt-1 text-red-500 text-sm">{errors.telefone}</p>}
        </div>

        {/* Campo CEP */}
        <div>
          <label htmlFor="cep" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            CEP *
          </label>
          <input
            type="text"
            id="cep"
            name="cep" // Adicionado name
            value={cep}
            onChange={(e) => onCepChange(e.target.value)}
            className={`w-full rounded-xl border ${errors.cep ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="00000-000"
            required
          />
          {errors.cep && <p className="mt-1 text-red-500 text-sm">{errors.cep}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="endereco" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            Endereço *
          </label>
          <input
            type="text"
            id="endereco"
            name="endereco" // Adicionado name
            value={endereco}
            onChange={onInputChange}
            className={`w-full rounded-xl border ${errors.endereco ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="Nome da rua"
            required
            disabled={true} // Desabilitado para ViaCEP preencher
          />
          {errors.endereco && <p className="mt-1 text-red-500 text-sm">{errors.endereco}</p>}
        </div>
        
        <div>
          <label htmlFor="cidade" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            Cidade *
          </label>
          <input
            type="text"
            id="cidade"
            name="cidade" // Adicionado name
            value={cidade}
            onChange={onInputChange}
            className={`w-full rounded-xl border ${errors.cidade ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="Sua cidade"
            required
            disabled={true} // Desabilitado para ViaCEP preencher
          />
          {errors.cidade && <p className="mt-1 text-red-500 text-sm">{errors.cidade}</p>}
        </div>

        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            Estado *
          </label>
          <input
            type="text"
            id="estado"
            name="estado" // Adicionado name
            value={estado}
            onChange={onInputChange}
            className={`w-full rounded-xl border ${errors.estado ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="UF"
            required
            disabled={true} // Desabilitado para ViaCEP preencher
          />
          {errors.estado && <p className="mt-1 text-red-500 text-sm">{errors.estado}</p>}
        </div>

        <div>
          <label htmlFor="numero" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            Número *
          </label>
          <input
            type="text"
            id="numero"
            name="numero" // Adicionado name
            value={numero}
            onChange={onInputChange}
            className={`w-full rounded-xl border ${errors.numero ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="Número"
            required
          />
          {errors.numero && <p className="mt-1 text-red-500 text-sm">{errors.numero}</p>}
        </div>

        <div>
          <label htmlFor="complemento" className="block text-sm font-medium text-[#5d7a6d] mb-2">
            Complemento
          </label>
          <input
            type="text"
            id="complemento"
            name="complemento" // Adicionado name
            value={complemento}
            onChange={onInputChange}
            className="w-full rounded-xl border border-[#d0e8e0] bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]"
            placeholder="Ex: Casa, Apto 101, Atrás do posto"
          />
          <p className="mt-1 text-xs text-[#5d7a6d]">Opcional: casa, apartamento, ponto de referência, etc.</p>
        </div>

      </div>
    </div>
  );
};

export default UserContactInfoForm;