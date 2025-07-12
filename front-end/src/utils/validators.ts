export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
    const cleaned = cpf.replace(/\D/g, '');
    
  // Verifica se tem 11 dígitos
    if (cleaned.length !== 11) return false;
    
  // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Calcula primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    const digit1 = remainder >= 10 ? 0 : remainder;

  // Calcula segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    const digit2 = remainder >= 10 ? 0 : remainder;

  // Verifica se os dígitos calculados batem com os informados
    return (
    parseInt(cleaned.charAt(9)) === digit1 &&
    parseInt(cleaned.charAt(10)) === digit2
    );
};